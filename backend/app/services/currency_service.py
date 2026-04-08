from datetime import date
from decimal import Decimal

import httpx

from app.config import settings
from app.repositories.exchange_rate_repo import ExchangeRateRepository


class CurrencyService:
    def __init__(self, exchange_rate_repo: ExchangeRateRepository, redis_client=None):
        self.exchange_rate_repo = exchange_rate_repo
        self.redis = redis_client

    async def get_rate(
        self, from_currency: str, to_currency: str, rate_date: date
    ) -> Decimal:
        if from_currency == to_currency:
            return Decimal("1")

        # 1. Check Redis cache
        if self.redis:
            cache_key = f"rate:{from_currency}:{to_currency}:{rate_date.isoformat()}"
            cached = await self.redis.get(cache_key)
            if cached:
                return Decimal(cached.decode())

        # 2. Check DB
        db_rate = await self.exchange_rate_repo.get_rate(from_currency, to_currency, rate_date)
        if db_rate is not None:
            if self.redis:
                await self._cache_rate(from_currency, to_currency, rate_date, db_rate)
            return db_rate

        # 3. Fetch from Frankfurter API
        rate = await self._fetch_from_api(from_currency, to_currency, rate_date)

        # 4. Store in DB + Redis
        await self.exchange_rate_repo.save_rate(from_currency, to_currency, rate, rate_date)
        if self.redis:
            await self._cache_rate(from_currency, to_currency, rate_date, rate)

        return rate

    async def _fetch_from_api(
        self, from_currency: str, to_currency: str, rate_date: date
    ) -> Decimal:
        url = f"{settings.frankfurter_base_url}/{rate_date.isoformat()}"
        params = {"from": from_currency, "to": to_currency}

        async with httpx.AsyncClient() as client:
            response = await client.get(url, params=params, timeout=10.0)
            response.raise_for_status()
            data = response.json()
            rate_value = data["rates"][to_currency]
            return Decimal(str(rate_value))

    async def _cache_rate(
        self, from_currency: str, to_currency: str, rate_date: date, rate: Decimal
    ) -> None:
        cache_key = f"rate:{from_currency}:{to_currency}:{rate_date.isoformat()}"
        today = date.today()
        ttl = 21600 if rate_date == today else 2592000  # 6h for today, 30d for historical
        await self.redis.set(cache_key, str(rate), ex=ttl)

    def get_conversion_date(self, group) -> date:
        from datetime import date as date_type

        today = date_type.today()
        if group.group_type == "trip":
            if group.trip_end_date is None or group.trip_end_date >= today:
                return today
            else:
                return group.trip_end_date
        return today
