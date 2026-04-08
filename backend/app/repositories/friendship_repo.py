import uuid

from sqlalchemy import select, or_, and_
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.friendship import Friendship
from app.repositories.base import BaseRepository


class FriendshipRepository(BaseRepository[Friendship]):
    def __init__(self, db: AsyncSession):
        super().__init__(db, Friendship)

    async def get_friendship(self, user_id: uuid.UUID, friend_id: uuid.UUID) -> Friendship | None:
        result = await self.db.execute(
            select(Friendship).where(
                or_(
                    and_(Friendship.user_id == user_id, Friendship.friend_id == friend_id),
                    and_(Friendship.user_id == friend_id, Friendship.friend_id == user_id),
                )
            )
        )
        return result.scalar_one_or_none()

    async def get_user_friends(self, user_id: uuid.UUID, status: str = "accepted") -> list[Friendship]:
        result = await self.db.execute(
            select(Friendship).where(
                or_(Friendship.user_id == user_id, Friendship.friend_id == user_id),
                Friendship.status == status,
            )
        )
        return list(result.scalars().all())

    async def get_pending_requests(self, user_id: uuid.UUID) -> list[Friendship]:
        result = await self.db.execute(
            select(Friendship).where(
                Friendship.friend_id == user_id,
                Friendship.status == "pending",
            )
        )
        return list(result.scalars().all())

    async def are_friends(self, user_id: uuid.UUID, friend_id: uuid.UUID) -> bool:
        friendship = await self.get_friendship(user_id, friend_id)
        return friendship is not None and friendship.status == "accepted"
