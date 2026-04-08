"""
Unit tests for CurrencyService.
Mocks: httpx.AsyncClient (lowest external layer) - the Frankfurter API call.
Real: ExchangeRateRepository with SQLite DB, CurrencyService business logic.
"""
from datetime import date
from decimal import Decimal
from unittest.mock import AsyncMock, MagicMock, patch

import pytest
import pytest_asyncio
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.exchange_rate_repo import ExchangeRateRepository
from app.services.currency_service import CurrencyService


def _mock_frankfurter(to_currency: str, rate: float):
    mock_resp = MagicMock()
    mock_resp.status_code = 200
    mock_resp.raise_for_status = MagicMock()
    mock_resp.json.return_value = {
        "amount": 1.0, "base": "USD", "date": "2024-06-15",
        "rates": {to_currency: rate},
    }
    return mock_resp


class TestCurrencyServiceGetRate:
    @pytest.mark.asyncio
    async def test_same_currency_returns_one(self, db_session: AsyncSession):
        repo = ExchangeRateRepository(db_session)
        service = CurrencyService(repo, redis_client=None)
        rate = await service.get_rate("USD", "USD", date(2024, 6, 15))
        assert rate == Decimal("1")

    @pytest.mark.asyncio
    @patch("app.services.currency_service.httpx.AsyncClient")
    async def test_fetches_from_api_on_cache_miss(self, mock_httpx, db_session: AsyncSession):
        mock_client = AsyncMock()
        mock_client.get = AsyncMock(return_value=_mock_frankfurter("EUR", 0.92))
        mock_client.__aenter__ = AsyncMock(return_value=mock_client)
        mock_client.__aexit__ = AsyncMock(return_value=False)
        mock_httpx.return_value = mock_client

        repo = ExchangeRateRepository(db_session)
        service = CurrencyService(repo, redis_client=None)
        rate = await service.get_rate("USD", "EUR", date(2024, 6, 15))

        assert rate == Decimal("0.92")
        mock_client.get.assert_called_once()

    @pytest.mark.asyncio
    @patch("app.services.currency_service.httpx.AsyncClient")
    async def test_caches_in_db_after_api_fetch(self, mock_httpx, db_session: AsyncSession):
        mock_client = AsyncMock()
        mock_client.get = AsyncMock(return_value=_mock_frankfurter("GBP", 0.79))
        mock_client.__aenter__ = AsyncMock(return_value=mock_client)
        mock_client.__aexit__ = AsyncMock(return_value=False)
        mock_httpx.return_value = mock_client

        repo = ExchangeRateRepository(db_session)
        service = CurrencyService(repo, redis_client=None)

        # First call → API
        rate1 = await service.get_rate("USD", "GBP", date(2024, 6, 15))
        assert rate1 == Decimal("0.79")
        await db_session.commit()

        # Second call → DB cache (no new API call)
        mock_client.get.reset_mock()
        rate2 = await service.get_rate("USD", "GBP", date(2024, 6, 15))
        assert rate2 == Decimal("0.79")
        mock_client.get.assert_not_called()

    @pytest.mark.asyncio
    @patch("app.services.currency_service.httpx.AsyncClient")
    async def test_historical_rate_for_specific_date(self, mock_httpx, db_session: AsyncSession):
        mock_client = AsyncMock()
        mock_client.get = AsyncMock(return_value=_mock_frankfurter("JPY", 156.5))
        mock_client.__aenter__ = AsyncMock(return_value=mock_client)
        mock_client.__aexit__ = AsyncMock(return_value=False)
        mock_httpx.return_value = mock_client

        repo = ExchangeRateRepository(db_session)
        service = CurrencyService(repo, redis_client=None)
        rate = await service.get_rate("USD", "JPY", date(2023, 12, 25))

        assert rate == Decimal("156.5")
        # Verify the URL contains the date
        call_args = mock_client.get.call_args
        assert "2023-12-25" in str(call_args)


class TestConversionDateLogic:
    def test_non_trip_group_returns_today(self):
        service = CurrencyService(exchange_rate_repo=None, redis_client=None)

        class FakeGroup:
            group_type = "home"
            trip_end_date = None

        assert service.get_conversion_date(FakeGroup()) == date.today()

    def test_active_trip_returns_today(self):
        service = CurrencyService(exchange_rate_repo=None, redis_client=None)

        class FakeGroup:
            group_type = "trip"
            trip_end_date = date(2099, 12, 31)  # Future

        assert service.get_conversion_date(FakeGroup()) == date.today()

    def test_trip_no_end_date_returns_today(self):
        service = CurrencyService(exchange_rate_repo=None, redis_client=None)

        class FakeGroup:
            group_type = "trip"
            trip_end_date = None

        assert service.get_conversion_date(FakeGroup()) == date.today()

    def test_ended_trip_returns_end_date(self):
        service = CurrencyService(exchange_rate_repo=None, redis_client=None)
        end = date(2024, 3, 15)

        class FakeGroup:
            group_type = "trip"
            trip_end_date = end

        assert service.get_conversion_date(FakeGroup()) == end
