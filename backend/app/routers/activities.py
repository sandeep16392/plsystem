import uuid

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_current_user_id
from app.core.exceptions import ForbiddenError
from app.database import get_db
from app.repositories.activity_repo import ActivityRepository
from app.repositories.group_repo import GroupRepository
from app.schemas.activity import ActivityResponse

router = APIRouter(tags=["activities"])


@router.get("/api/activities", response_model=list[ActivityResponse])
async def get_user_activities(
    limit: int = Query(default=50, le=100),
    offset: int = Query(default=0, ge=0),
    user_id: uuid.UUID = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    repo = ActivityRepository(db)
    activities = await repo.get_user_activities(user_id, limit=limit, offset=offset)
    return [ActivityResponse.model_validate(a) for a in activities]


@router.get("/api/groups/{group_id}/activities", response_model=list[ActivityResponse])
async def get_group_activities(
    group_id: uuid.UUID,
    limit: int = Query(default=50, le=100),
    offset: int = Query(default=0, ge=0),
    user_id: uuid.UUID = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    group_repo = GroupRepository(db)
    if not await group_repo.is_member(group_id, user_id):
        raise ForbiddenError("Not a member of this group")

    repo = ActivityRepository(db)
    activities = await repo.get_group_activities(group_id, limit=limit, offset=offset)
    return [ActivityResponse.model_validate(a) for a in activities]
