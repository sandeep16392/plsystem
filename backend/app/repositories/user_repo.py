from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.repositories.base import BaseRepository


class UserRepository(BaseRepository[User]):
    def __init__(self, db: AsyncSession):
        super().__init__(db, User)

    async def get_by_username(self, username: str) -> User | None:
        result = await self.db.execute(select(User).where(User.username == username))
        return result.scalar_one_or_none()

    async def get_by_email(self, email: str) -> User | None:
        result = await self.db.execute(select(User).where(User.email == email))
        return result.scalar_one_or_none()

    async def search_by_username_or_email(self, query: str) -> list[User]:
        result = await self.db.execute(
            select(User).where(
                (User.username.ilike(f"%{query}%")) | (User.email.ilike(f"%{query}%"))
            ).limit(20)
        )
        return list(result.scalars().all())
