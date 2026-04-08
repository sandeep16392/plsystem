from datetime import date
from decimal import Decimal

from sqlalchemy import select
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
        exchange_rate = ExchangeRate(
            base_currency=base_currency,
            target_currency=target_currency,
            rate=rate,
            rate_date=rate_date,
        )
        self.db.add(exchange_rate)
        await self.db.flush()
        return exchange_rate
