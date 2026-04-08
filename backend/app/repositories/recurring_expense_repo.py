import uuid
from datetime import date

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.recurring_expense import RecurringExpense, RecurringExpenseSplit
from app.repositories.base import BaseRepository


class RecurringExpenseRepository(BaseRepository[RecurringExpense]):
    def __init__(self, db: AsyncSession):
        super().__init__(db, RecurringExpense)

    async def get_by_group(self, group_id: uuid.UUID) -> list[RecurringExpense]:
        result = await self.db.execute(
            select(RecurringExpense)
            .where(RecurringExpense.group_id == group_id)
            .order_by(RecurringExpense.created_at.desc())
        )
        return list(result.scalars().all())

    async def get_due(self, as_of: date) -> list[RecurringExpense]:
        result = await self.db.execute(
            select(RecurringExpense).where(
                RecurringExpense.is_active == True,
                RecurringExpense.next_due_date <= as_of,
            )
        )
        return list(result.scalars().all())

    async def get_splits(self, recurring_expense_id: uuid.UUID) -> list[RecurringExpenseSplit]:
        result = await self.db.execute(
            select(RecurringExpenseSplit).where(
                RecurringExpenseSplit.recurring_expense_id == recurring_expense_id
            )
        )
        return list(result.scalars().all())
