import uuid

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_current_user_id
from app.core.exceptions import ForbiddenError, NotFoundError
from app.database import get_db
from app.repositories.group_repo import GroupRepository
from app.models.group import Group
from app.schemas.group import (
    GroupCreate,
    GroupMemberAdd,
    GroupMemberResponse,
    GroupResponse,
    GroupUpdate,
)

router = APIRouter(prefix="/api/groups", tags=["groups"])


def get_group_repo(db: AsyncSession = Depends(get_db)) -> GroupRepository:
    return GroupRepository(db)


@router.get("", response_model=list[GroupResponse])
async def list_groups(
    user_id: uuid.UUID = Depends(get_current_user_id),
    repo: GroupRepository = Depends(get_group_repo),
):
    groups = await repo.get_user_groups(user_id)
    result = []
    for g in groups:
        members = await repo.get_members(g.id)
        gr = GroupResponse.model_validate(g)
        gr.members = [GroupMemberResponse.model_validate(m) for m in members]
        result.append(gr)
    return result


@router.post("", response_model=GroupResponse, status_code=status.HTTP_201_CREATED)
async def create_group(
    data: GroupCreate,
    user_id: uuid.UUID = Depends(get_current_user_id),
    repo: GroupRepository = Depends(get_group_repo),
):
    group = Group(
        name=data.name,
        group_type=data.group_type,
        target_currency=data.target_currency,
        created_by=user_id,
        trip_start_date=data.trip_start_date,
        trip_end_date=data.trip_end_date,
        simplify_debts=data.simplify_debts,
    )
    group = await repo.create(group)
    await repo.add_member(group.id, user_id, role="admin")
    members = await repo.get_members(group.id)
    gr = GroupResponse.model_validate(group)
    gr.members = [GroupMemberResponse.model_validate(m) for m in members]
    return gr


@router.get("/{group_id}", response_model=GroupResponse)
async def get_group(
    group_id: uuid.UUID,
    user_id: uuid.UUID = Depends(get_current_user_id),
    repo: GroupRepository = Depends(get_group_repo),
):
    if not await repo.is_member(group_id, user_id):
        raise ForbiddenError("Not a member of this group")
    group = await repo.get_by_id(group_id)
    if not group:
        raise NotFoundError("Group not found")
    members = await repo.get_members(group_id)
    gr = GroupResponse.model_validate(group)
    gr.members = [GroupMemberResponse.model_validate(m) for m in members]
    return gr


@router.patch("/{group_id}", response_model=GroupResponse)
async def update_group(
    group_id: uuid.UUID,
    data: GroupUpdate,
    user_id: uuid.UUID = Depends(get_current_user_id),
    repo: GroupRepository = Depends(get_group_repo),
):
    if not await repo.is_member(group_id, user_id):
        raise ForbiddenError("Not a member of this group")
    group = await repo.get_by_id(group_id)
    if not group:
        raise NotFoundError("Group not found")
    updates = data.model_dump(exclude_unset=True)
    if updates:
        group = await repo.update(group, **updates)
    members = await repo.get_members(group_id)
    gr = GroupResponse.model_validate(group)
    gr.members = [GroupMemberResponse.model_validate(m) for m in members]
    return gr


@router.delete("/{group_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_group(
    group_id: uuid.UUID,
    user_id: uuid.UUID = Depends(get_current_user_id),
    repo: GroupRepository = Depends(get_group_repo),
):
    if not await repo.is_admin(group_id, user_id):
        raise ForbiddenError("Only admins can delete groups")
    await repo.delete_by_id(group_id)


@router.post("/{group_id}/members", response_model=GroupMemberResponse, status_code=status.HTTP_201_CREATED)
async def add_member(
    group_id: uuid.UUID,
    data: GroupMemberAdd,
    user_id: uuid.UUID = Depends(get_current_user_id),
    repo: GroupRepository = Depends(get_group_repo),
):
    if not await repo.is_member(group_id, user_id):
        raise ForbiddenError("Not a member of this group")
    existing = await repo.get_member(group_id, data.user_id)
    if existing:
        raise ForbiddenError("User is already a member")
    member = await repo.add_member(group_id, data.user_id)
    return GroupMemberResponse.model_validate(member)


@router.delete("/{group_id}/members/{member_user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_member(
    group_id: uuid.UUID,
    member_user_id: uuid.UUID,
    user_id: uuid.UUID = Depends(get_current_user_id),
    repo: GroupRepository = Depends(get_group_repo),
):
    if not await repo.is_admin(group_id, user_id) and member_user_id != user_id:
        raise ForbiddenError("Only admins can remove other members")
    await repo.remove_member(group_id, member_user_id)
