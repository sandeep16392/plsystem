import uuid

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_current_user_id
from app.core.exceptions import ForbiddenError, NotFoundError
from app.database import get_db
from app.repositories.activity_repo import ActivityRepository
from app.repositories.expense_repo import ExpenseRepository
from app.repositories.group_repo import GroupRepository
from app.schemas.expense import ExpenseCreate, ExpenseResponse, ExpenseSplitResponse, ExpenseUpdate
from app.services.activity_service import ActivityService
from app.services.expense_service import ExpenseService

router = APIRouter(tags=["expenses"])


@router.get("/api/groups/{group_id}/expenses", response_model=list[ExpenseResponse])
async def list_expenses(
    group_id: uuid.UUID,
    limit: int = 50,
    offset: int = 0,
    user_id: uuid.UUID = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    group_repo = GroupRepository(db)
    if not await group_repo.is_member(group_id, user_id):
        raise ForbiddenError("Not a member of this group")

    expense_repo = ExpenseRepository(db)
    expenses = await expense_repo.get_by_group(group_id, limit=limit, offset=offset)

    result = []
    for exp in expenses:
        splits = await expense_repo.get_splits(exp.id)
        er = ExpenseResponse.model_validate(exp)
        er.splits = [ExpenseSplitResponse.model_validate(s) for s in splits]
        result.append(er)
    return result


@router.post(
    "/api/groups/{group_id}/expenses",
    response_model=ExpenseResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_expense(
    group_id: uuid.UUID,
    data: ExpenseCreate,
    user_id: uuid.UUID = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    group_repo = GroupRepository(db)
    if not await group_repo.is_member(group_id, user_id):
        raise ForbiddenError("Not a member of this group")

    members = await group_repo.get_members(group_id)
    member_ids = [m.user_id for m in members]

    expense_repo = ExpenseRepository(db)
    service = ExpenseService(expense_repo)
    expense = await service.create_expense(group_id, user_id, data, member_ids)

    # Log activity
    activity_repo = ActivityRepository(db)
    activity_service = ActivityService(activity_repo)
    await activity_service.log_expense_created(
        actor_id=user_id,
        group_id=group_id,
        expense_id=expense.id,
        description=data.description,
        amount=data.amount,
        currency=data.currency,
    )

    splits = await expense_repo.get_splits(expense.id)
    er = ExpenseResponse.model_validate(expense)
    er.splits = [ExpenseSplitResponse.model_validate(s) for s in splits]
    return er


@router.get("/api/expenses/{expense_id}", response_model=ExpenseResponse)
async def get_expense(
    expense_id: uuid.UUID,
    user_id: uuid.UUID = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    expense_repo = ExpenseRepository(db)
    expense = await expense_repo.get_by_id(expense_id)
    if not expense:
        raise NotFoundError("Expense not found")

    group_repo = GroupRepository(db)
    if not await group_repo.is_member(expense.group_id, user_id):
        raise ForbiddenError("Not a member of this group")

    splits = await expense_repo.get_splits(expense.id)
    er = ExpenseResponse.model_validate(expense)
    er.splits = [ExpenseSplitResponse.model_validate(s) for s in splits]
    return er


@router.patch("/api/expenses/{expense_id}", response_model=ExpenseResponse)
async def update_expense(
    expense_id: uuid.UUID,
    data: ExpenseUpdate,
    user_id: uuid.UUID = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    expense_repo = ExpenseRepository(db)
    expense = await expense_repo.get_by_id(expense_id)
    if not expense:
        raise NotFoundError("Expense not found")

    group_repo = GroupRepository(db)
    if not await group_repo.is_member(expense.group_id, user_id):
        raise ForbiddenError("Not a member of this group")

    updates = data.model_dump(exclude_unset=True, exclude={"splits"})
    if updates:
        expense = await expense_repo.update(expense, **updates)

    # If splits are being updated, recalculate
    if data.splits is not None:
        await expense_repo.delete_splits(expense.id)
        members = await group_repo.get_members(expense.group_id)
        member_ids = [m.user_id for m in members]
        service = ExpenseService(expense_repo)
        amount = data.amount if data.amount else expense.amount
        method = data.split_method if data.split_method else expense.split_method
        new_splits = service.calculate_splits(amount, method, member_ids, data.splits)
        for s in new_splits:
            s.expense_id = expense.id
            db.add(s)
        await db.flush()

    splits = await expense_repo.get_splits(expense.id)
    er = ExpenseResponse.model_validate(expense)
    er.splits = [ExpenseSplitResponse.model_validate(s) for s in splits]
    return er


@router.delete("/api/expenses/{expense_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_expense(
    expense_id: uuid.UUID,
    user_id: uuid.UUID = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    expense_repo = ExpenseRepository(db)
    expense = await expense_repo.get_by_id(expense_id)
    if not expense:
        raise NotFoundError("Expense not found")

    group_repo = GroupRepository(db)
    if not await group_repo.is_member(expense.group_id, user_id):
        raise ForbiddenError("Not a member of this group")

    # Log activity before deletion
    activity_repo = ActivityRepository(db)
    activity_service = ActivityService(activity_repo)
    await activity_service.log_expense_deleted(
        actor_id=user_id,
        group_id=expense.group_id,
        expense_id=expense_id,
        description=expense.description,
    )

    await expense_repo.delete_by_id(expense_id)
