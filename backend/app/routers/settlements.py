import uuid
from datetime import date
from decimal import Decimal

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_current_user_id
from app.core.exceptions import ForbiddenError, NotFoundError
from app.database import get_db
from app.repositories.activity_repo import ActivityRepository
from app.repositories.expense_repo import ExpenseRepository
from app.repositories.group_repo import GroupRepository
from app.schemas.expense import ExpenseResponse, ExpenseSplitResponse
from app.schemas.group import BalanceEntry, DebtEntry
from app.schemas.settlement import SettleCreate
from app.services.activity_service import ActivityService
from app.services.balance_service import BalanceService
from app.services.debt_service import DebtService
from app.models.expense import Expense, ExpenseSplit

router = APIRouter(prefix="/api/groups", tags=["balances & settlements"])


async def _dummy_rate(from_c, to_c, d):
    """Phase 2: same-currency only. Phase 3 will add real rates."""
    return Decimal("1")


@router.get("/{group_id}/balances", response_model=list[BalanceEntry])
async def get_balances(
    group_id: uuid.UUID,
    user_id: uuid.UUID = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    group_repo = GroupRepository(db)
    if not await group_repo.is_member(group_id, user_id):
        raise ForbiddenError("Not a member of this group")

    group = await group_repo.get_by_id(group_id)
    if not group:
        raise NotFoundError("Group not found")

    expense_repo = ExpenseRepository(db)
    service = BalanceService(expense_repo)
    balances = await service.compute_group_balances(
        group_id, group.target_currency, _dummy_rate, date.today()
    )

    return [
        BalanceEntry(user_id=uid, balance=bal.quantize(Decimal("0.0001")))
        for uid, bal in balances.items()
    ]


@router.get("/{group_id}/debts", response_model=list[DebtEntry])
async def get_simplified_debts(
    group_id: uuid.UUID,
    user_id: uuid.UUID = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    group_repo = GroupRepository(db)
    if not await group_repo.is_member(group_id, user_id):
        raise ForbiddenError("Not a member of this group")

    group = await group_repo.get_by_id(group_id)
    if not group:
        raise NotFoundError("Group not found")

    expense_repo = ExpenseRepository(db)
    balance_service = BalanceService(expense_repo)
    balances = await balance_service.compute_group_balances(
        group_id, group.target_currency, _dummy_rate, date.today()
    )

    transactions = DebtService.simplify_debts(balances)
    return [
        DebtEntry(
            from_user=t["from_user"],
            to_user=t["to_user"],
            amount=t["amount"].quantize(Decimal("0.0001")),
            currency=group.target_currency,
        )
        for t in transactions
    ]


@router.post("/{group_id}/settle", response_model=ExpenseResponse, status_code=status.HTTP_201_CREATED)
async def settle_up(
    group_id: uuid.UUID,
    data: SettleCreate,
    user_id: uuid.UUID = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    group_repo = GroupRepository(db)
    if not await group_repo.is_member(group_id, user_id):
        raise ForbiddenError("Not a member of this group")
    if not await group_repo.is_member(group_id, data.to_user_id):
        raise ForbiddenError("Recipient is not a member of this group")

    # Create a settlement expense: payer=current_user, split=to_user owes full amount
    expense = Expense(
        group_id=group_id,
        paid_by=user_id,
        description=f"Settlement payment",
        amount=data.amount,
        currency=data.currency,
        split_method="exact",
        expense_date=date.today(),
        is_settlement=True,
    )
    split = ExpenseSplit(
        user_id=data.to_user_id,
        owed_amount=data.amount,
    )

    expense_repo = ExpenseRepository(db)
    expense = await expense_repo.create_with_splits(expense, [split])

    # Log activity
    activity_repo = ActivityRepository(db)
    activity_service = ActivityService(activity_repo)
    await activity_service.log_settlement(
        actor_id=user_id,
        group_id=group_id,
        expense_id=expense.id,
        amount=data.amount,
        currency=data.currency,
        to_user_id=data.to_user_id,
    )

    splits = await expense_repo.get_splits(expense.id)
    er = ExpenseResponse.model_validate(expense)
    er.splits = [ExpenseSplitResponse.model_validate(s) for s in splits]
    return er
