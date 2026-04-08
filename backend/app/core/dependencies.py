import uuid

from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import UnauthorizedError
from app.core.security import decode_token
from app.database import get_db
from app.repositories.user_repo import UserRepository

security_scheme = HTTPBearer()


async def get_current_user_id(
    credentials: HTTPAuthorizationCredentials = Depends(security_scheme),
) -> uuid.UUID:
    token = credentials.credentials
    payload = decode_token(token)
    if payload is None:
        raise UnauthorizedError("Invalid or expired token")
    if payload.get("type") != "access":
        raise UnauthorizedError("Invalid token type")
    user_id = payload.get("sub")
    if user_id is None:
        raise UnauthorizedError("Invalid token payload")
    try:
        return uuid.UUID(user_id)
    except ValueError:
        raise UnauthorizedError("Invalid token payload")


async def get_current_user(
    user_id: uuid.UUID = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    repo = UserRepository(db)
    user = await repo.get_by_id(user_id)
    if user is None:
        raise UnauthorizedError("User not found")
    return user
