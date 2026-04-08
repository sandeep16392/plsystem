import uuid
from decimal import Decimal, ROUND_HALF_EVEN

from app.core.exceptions import BadRequestError
from app.models.expense import Expense, ExpenseSplit
from app.repositories.expense_repo import ExpenseRepository
from app.schemas.expense import ExpenseCreate, ExpenseSplitCreate


class ExpenseService:
    def __init__(self, expense_repo: ExpenseRepository):
        self.expense_repo = expense_repo

    def calculate_equal_splits(
        self, total: Decimal, member_ids: list[uuid.UUID]
    ) -> list[ExpenseSplit]:
        n = len(member_ids)
        if n == 0:
            raise BadRequestError("No members to split with")

        per_person = (total / n).quantize(Decimal("0.0001"), rounding=ROUND_HALF_EVEN)
        remainder = total - (per_person * n)

        splits = []
        for i, user_id in enumerate(member_ids):
            amount = per_person + (remainder if i == 0 else Decimal("0"))
            splits.append(ExpenseSplit(user_id=user_id, owed_amount=amount))
        return splits

    def calculate_exact_splits(
        self, total: Decimal, split_data: list[ExpenseSplitCreate]
    ) -> list[ExpenseSplit]:
        split_total = sum(s.owed_amount for s in split_data if s.owed_amount is not None)
        if split_total != total:
            raise BadRequestError(
                f"Split amounts ({split_total}) do not match total ({total})"
            )
        return [
            ExpenseSplit(user_id=s.user_id, owed_amount=s.owed_amount)
            for s in split_data
        ]

    def calculate_percentage_splits(
        self, total: Decimal, split_data: list[ExpenseSplitCreate]
    ) -> list[ExpenseSplit]:
        pct_total = sum(s.percentage for s in split_data if s.percentage is not None)
        if pct_total != Decimal("100"):
            raise BadRequestError(
                f"Percentages ({pct_total}%) do not sum to 100%"
            )

        splits = []
        running_total = Decimal("0")
        for i, s in enumerate(split_data):
            if i == len(split_data) - 1:
                amount = total - running_total  # Assign remainder to last person
            else:
                amount = (total * s.percentage / Decimal("100")).quantize(
                    Decimal("0.0001"), rounding=ROUND_HALF_EVEN
                )
                running_total += amount
            splits.append(ExpenseSplit(user_id=s.user_id, owed_amount=amount))
        return splits

    def calculate_shares_splits(
        self, total: Decimal, split_data: list[ExpenseSplitCreate]
    ) -> list[ExpenseSplit]:
        total_shares = sum(s.shares for s in split_data if s.shares is not None)
        if total_shares == 0:
            raise BadRequestError("Total shares cannot be zero")

        splits = []
        running_total = Decimal("0")
        for i, s in enumerate(split_data):
            if i == len(split_data) - 1:
                amount = total - running_total
            else:
                amount = (total * Decimal(str(s.shares)) / Decimal(str(total_shares))).quantize(
                    Decimal("0.0001"), rounding=ROUND_HALF_EVEN
                )
                running_total += amount
            splits.append(ExpenseSplit(user_id=s.user_id, owed_amount=amount))
        return splits

    def calculate_splits(
        self,
        total: Decimal,
        split_method: str,
        member_ids: list[uuid.UUID],
        split_data: list[ExpenseSplitCreate] | None = None,
    ) -> list[ExpenseSplit]:
        if split_method == "equal":
            return self.calculate_equal_splits(total, member_ids)
        elif split_method == "exact":
            if not split_data:
                raise BadRequestError("Split data required for exact split")
            return self.calculate_exact_splits(total, split_data)
        elif split_method == "percentage":
            if not split_data:
                raise BadRequestError("Split data required for percentage split")
            return self.calculate_percentage_splits(total, split_data)
        elif split_method == "shares":
            if not split_data:
                raise BadRequestError("Split data required for shares split")
            return self.calculate_shares_splits(total, split_data)
        else:
            raise BadRequestError(f"Unknown split method: {split_method}")

    async def create_expense(
        self,
        group_id: uuid.UUID,
        paid_by: uuid.UUID,
        data: ExpenseCreate,
        member_ids: list[uuid.UUID],
    ) -> Expense:
        splits = self.calculate_splits(
            data.amount, data.split_method, member_ids, data.splits or None
        )

        expense = Expense(
            group_id=group_id,
            paid_by=paid_by,
            description=data.description,
            amount=data.amount,
            currency=data.currency,
            category=data.category,
            split_method=data.split_method,
            expense_date=data.expense_date,
            notes=data.notes,
            is_settlement=data.is_settlement,
        )

        return await self.expense_repo.create_with_splits(expense, splits)
