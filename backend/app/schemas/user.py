import uuid
from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


class UserRegister(BaseModel):
    username: str = Field(..., min_length=3, max_length=50, pattern=r"^[a-zA-Z0-9_]+$")
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=128)
    display_name: str = Field(..., min_length=1, max_length=100)
    default_currency: str = Field(default="USD", min_length=3, max_length=3)


class UserLogin(BaseModel):
    username: str
    password: str


class UserUpdate(BaseModel):
    display_name: str | None = None
    default_currency: str | None = Field(default=None, min_length=3, max_length=3)
    avatar_url: str | None = None


class UserResponse(BaseModel):
    id: uuid.UUID
    username: str
    email: str
    display_name: str
    default_currency: str
    avatar_url: str | None
    created_at: datetime

    model_config = {"from_attributes": True}


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserResponse


class RefreshRequest(BaseModel):
    refresh_token: str
