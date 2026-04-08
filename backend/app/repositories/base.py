import uuid
from typing import Generic, TypeVar, Type

from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import Base

ModelType = TypeVar("ModelType", bound=Base)


class BaseRepository(Generic[ModelType]):
    def __init__(self, db: AsyncSession, model: Type[ModelType]):
        self.db = db
        self.model = model

    async def get_by_id(self, id: uuid.UUID) -> ModelType | None:
        result = await self.db.execute(select(self.model).where(self.model.id == id))
        return result.scalar_one_or_none()

    async def create(self, obj: ModelType) -> ModelType:
        self.db.add(obj)
        await self.db.flush()
        await self.db.refresh(obj)
        return obj

    async def update(self, obj: ModelType, **kwargs) -> ModelType:
        for key, value in kwargs.items():
            setattr(obj, key, value)
        await self.db.flush()
        await self.db.refresh(obj)
        return obj

    async def delete_by_id(self, id: uuid.UUID) -> bool:
        result = await self.db.execute(delete(self.model).where(self.model.id == id))
        return result.rowcount > 0

    async def list_all(self, limit: int = 100, offset: int = 0) -> list[ModelType]:
        result = await self.db.execute(
            select(self.model).limit(limit).offset(offset)
        )
        return list(result.scalars().all())
