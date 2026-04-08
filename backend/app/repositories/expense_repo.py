import uuid

from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.expense import Expense, ExpenseSplit
from app.repositories.base import BaseRepository


class ExpenseRepository(BaseRepository[Expense]):
    def __init__(self, db: AsyncSession):
        super().__init__(db, Expense)

    async def get_by_group(
        self, group_id: uuid.UUID, limit: int = 50, offset: int = 0
    ) -> list[Expense]:
        result = await self.db.execute(
            select(Expense)
            .where(Expense.group_id == group_id)
            .order_by(Expense.expense_date.desc(), Expense.created_at.desc())
            .limit(limit)
            .offset(offset)
        )
        return list(result.scalars().all())

    async def create_with_splits(
        self, expense: Expense, splits: list[ExpenseSplit]
    ) -> Expense:
        self.db.add(expense)
        await self.db.flush()
        for split in splits:
            split.expense_id = expense.id
            self.db.add(split)
        await self.db.flush()
        await self.db.refresh(expense)
        return expense

    async def get_splits(self, expense_id: uuid.UUID) -> list[ExpenseSplit]:
        result = await self.db.execute(
            select(ExpenseSplit).where(ExpenseSplit.expense_id == expense_id)
        )
        return list(result.scalars().all())

    async def delete_splits(self, expense_id: uuid.UUID) -> None:
        await self.db.execute(
            delete(ExpenseSplit).where(ExpenseSplit.expense_id == expense_id)
        )

    async def get_group_expenses_with_splits(
        self, group_id: uuid.UUID
    ) -> list[tuple[Expense, list[ExpenseSplit]]]:
        expenses = await self.get_by_group(group_id, limit=10000, offset=0)
        result = []
        for expense in expenses:
            splits = await self.get_splits(expense.id)
            result.append((expense, splits))
        return result

    async def search(
        self,
        user_id: uuid.UUID,
        query: str | None = None,
        group_id: uuid.UUID | None = None,
        currency: str | None = None,
        limit: int = 50,
        offset: int = 0,
    ) -> list[Expense]:
        from app.models.group import GroupMember

        stmt = (
            select(Expense)
            .join(GroupMember, Expense.group_id == GroupMember.group_id)
            .where(GroupMember.user_id == user_id)
        )
        if query:
            stmt = stmt.where(Expense.description.ilike(f"%{query}%"))
        if group_id:
            stmt = stmt.where(Expense.group_id == group_id)
        if currency:
            stmt = stmt.where(Expense.currency == currency)
        stmt = stmt.order_by(Expense.expense_date.desc()).limit(limit).offset(offset)
        result = await self.db.execute(stmt)
        return list(result.scalars().all())
