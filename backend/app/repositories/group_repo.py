import uuid

from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.group import Group, GroupMember
from app.repositories.base import BaseRepository


class GroupRepository(BaseRepository[Group]):
    def __init__(self, db: AsyncSession):
        super().__init__(db, Group)

    async def get_user_groups(self, user_id: uuid.UUID) -> list[Group]:
        result = await self.db.execute(
            select(Group)
            .join(GroupMember, Group.id == GroupMember.group_id)
            .where(GroupMember.user_id == user_id)
            .order_by(Group.updated_at.desc())
        )
        return list(result.scalars().all())

    async def get_member(self, group_id: uuid.UUID, user_id: uuid.UUID) -> GroupMember | None:
        result = await self.db.execute(
            select(GroupMember).where(
                GroupMember.group_id == group_id,
                GroupMember.user_id == user_id,
            )
        )
        return result.scalar_one_or_none()

    async def add_member(self, group_id: uuid.UUID, user_id: uuid.UUID, role: str = "member") -> GroupMember:
        member = GroupMember(group_id=group_id, user_id=user_id, role=role)
        self.db.add(member)
        await self.db.flush()
        await self.db.refresh(member)
        return member

    async def remove_member(self, group_id: uuid.UUID, user_id: uuid.UUID) -> bool:
        result = await self.db.execute(
            delete(GroupMember).where(
                GroupMember.group_id == group_id,
                GroupMember.user_id == user_id,
            )
        )
        return result.rowcount > 0

    async def get_members(self, group_id: uuid.UUID) -> list[GroupMember]:
        result = await self.db.execute(
            select(GroupMember).where(GroupMember.group_id == group_id)
        )
        return list(result.scalars().all())

    async def is_member(self, group_id: uuid.UUID, user_id: uuid.UUID) -> bool:
        member = await self.get_member(group_id, user_id)
        return member is not None

    async def is_admin(self, group_id: uuid.UUID, user_id: uuid.UUID) -> bool:
        member = await self.get_member(group_id, user_id)
        return member is not None and member.role == "admin"
