import uuid
from datetime import date
from decimal import Decimal

from app.repositories.expense_repo import ExpenseRepository


class BalanceService:
    def __init__(self, expense_repo: ExpenseRepository):
        self.expense_repo = expense_repo

    async def compute_group_balances(
        self,
        group_id: uuid.UUID,
        target_currency: str,
        get_rate_fn,
        conversion_date: date,
    ) -> dict[uuid.UUID, Decimal]:
        expenses_with_splits = await self.expense_repo.get_group_expenses_with_splits(group_id)
        balances: dict[uuid.UUID, Decimal] = {}

        for expense, splits in expenses_with_splits:
            # Convert expense to target currency
            if expense.currency == target_currency:
                rate = Decimal("1")
            else:
                rate = await get_rate_fn(expense.currency, target_currency, conversion_date)
                if rate is None:
                    rate = Decimal("1")  # Fallback

            converted_total = expense.amount * rate

            # Credit the payer
            balances[expense.paid_by] = balances.get(expense.paid_by, Decimal("0")) + converted_total

            # Debit each split member
            for split in splits:
                converted_owed = split.owed_amount * rate
                balances[split.user_id] = balances.get(split.user_id, Decimal("0")) - converted_owed

        return balances
