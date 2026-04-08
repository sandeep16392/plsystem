import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.activity import Activity
from app.models.group import GroupMember
from app.repositories.base import BaseRepository


class ActivityRepository(BaseRepository[Activity]):
    def __init__(self, db: AsyncSession):
        super().__init__(db, Activity)

    async def get_user_activities(
        self, user_id: uuid.UUID, limit: int = 50, offset: int = 0
    ) -> list[Activity]:
        result = await self.db.execute(
            select(Activity)
            .outerjoin(GroupMember, Activity.group_id == GroupMember.group_id)
            .where(
                (GroupMember.user_id == user_id) | (Activity.actor_id == user_id)
            )
            .order_by(Activity.created_at.desc())
            .distinct()
            .limit(limit)
            .offset(offset)
        )
        return list(result.scalars().all())

    async def get_group_activities(
        self, group_id: uuid.UUID, limit: int = 50, offset: int = 0
    ) -> list[Activity]:
        result = await self.db.execute(
            select(Activity)
            .where(Activity.group_id == group_id)
            .order_by(Activity.created_at.desc())
            .limit(limit)
            .offset(offset)
        )
        return list(result.scalars().all())
