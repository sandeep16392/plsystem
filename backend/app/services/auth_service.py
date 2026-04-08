from app.core.exceptions import ConflictError, UnauthorizedError
from app.core.security import create_access_token, create_refresh_token, decode_token, hash_password, verify_password
from app.models.user import User
from app.repositories.user_repo import UserRepository
from app.schemas.user import UserRegister


class AuthService:
    def __init__(self, user_repo: UserRepository):
        self.user_repo = user_repo

    async def register(self, data: UserRegister) -> tuple[User, str, str]:
        existing = await self.user_repo.get_by_username(data.username)
        if existing:
            raise ConflictError("Username already taken")

        existing = await self.user_repo.get_by_email(data.email)
        if existing:
            raise ConflictError("Email already registered")

        user = User(
            username=data.username,
            email=data.email,
            password_hash=hash_password(data.password),
            display_name=data.display_name,
            default_currency=data.default_currency,
        )
        user = await self.user_repo.create(user)
        access_token = create_access_token({"sub": str(user.id)})
        refresh_token = create_refresh_token({"sub": str(user.id)})
        return user, access_token, refresh_token

    async def login(self, username: str, password: str) -> tuple[User, str, str]:
        user = await self.user_repo.get_by_username(username)
        if not user or not verify_password(password, user.password_hash):
            raise UnauthorizedError("Invalid username or password")

        access_token = create_access_token({"sub": str(user.id)})
        refresh_token = create_refresh_token({"sub": str(user.id)})
        return user, access_token, refresh_token

    async def refresh(self, refresh_token_str: str) -> tuple[str, str]:
        payload = decode_token(refresh_token_str)
        if payload is None or payload.get("type") != "refresh":
            raise UnauthorizedError("Invalid refresh token")

        user_id = payload.get("sub")
        if not user_id:
            raise UnauthorizedError("Invalid refresh token")

        user = await self.user_repo.get_by_id(user_id)
        if not user:
            raise UnauthorizedError("User not found")

        access_token = create_access_token({"sub": str(user.id)})
        new_refresh_token = create_refresh_token({"sub": str(user.id)})
        return access_token, new_refresh_token
