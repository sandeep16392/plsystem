from datetime import date
from decimal import Decimal

from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.exchange_rate import ExchangeRate
from app.repositories.base import BaseRepository


class ExchangeRateRepository(BaseRepository[ExchangeRate]):
    def __init__(self, db: AsyncSession):
        super().__init__(db, ExchangeRate)

    async def get_rate(
        self, base_currency: str, target_currency: str, rate_date: date
    ) -> Decimal | None:
        result = await self.db.execute(
            select(ExchangeRate.rate).where(
                ExchangeRate.base_currency == base_currency,
                ExchangeRate.target_currency == target_currency,
                ExchangeRate.rate_date == rate_date,
            )
        )
        return result.scalar_one_or_none()

    async def save_rate(
        self, base_currency: str, target_currency: str, rate: Decimal, rate_date: date
    ) -> ExchangeRate:
        # Check if rate already exists first to avoid UNIQUE violations
        result = await self.db.execute(
            select(ExchangeRate).where(
                ExchangeRate.base_currency == base_currency,
                ExchangeRate.target_currency == target_currency,
                ExchangeRate.rate_date == rate_date,
            )
        )
        existing = result.scalar_one_or_none()
        if existing:
            existing.rate = rate
            await self.db.flush()
            return existing

        exchange_rate = ExchangeRate(
            base_currency=base_currency,
            target_currency=target_currency,
            rate=rate,
            rate_date=rate_date,
        )
        self.db.add(exchange_rate)
        await self.db.flush()
        return exchange_rate
