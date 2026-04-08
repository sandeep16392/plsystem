import uuid
from datetime import date, datetime
from decimal import Decimal

from pydantic import BaseModel, Field


class GroupCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    group_type: str = Field(default="other", pattern=r"^(trip|home|couple|other)$")
    target_currency: str = Field(default="USD", min_length=3, max_length=3)
    trip_start_date: date | None = None
    trip_end_date: date | None = None
    simplify_debts: bool = True


class GroupUpdate(BaseModel):
    name: str | None = None
    target_currency: str | None = Field(default=None, min_length=3, max_length=3)
    trip_start_date: date | None = None
    trip_end_date: date | None = None
    simplify_debts: bool | None = None


class GroupMemberAdd(BaseModel):
    user_id: uuid.UUID


class GroupMemberResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    role: str
    joined_at: datetime

    model_config = {"from_attributes": True}


class GroupResponse(BaseModel):
    id: uuid.UUID
    name: str
    group_type: str
    target_currency: str
    created_by: uuid.UUID
    trip_start_date: date | None
    trip_end_date: date | None
    simplify_debts: bool
    created_at: datetime
    updated_at: datetime
    members: list[GroupMemberResponse] = []

    model_config = {"from_attributes": True}


class BalanceEntry(BaseModel):
    user_id: uuid.UUID
    balance: Decimal


class DebtEntry(BaseModel):
    from_user: uuid.UUID
    to_user: uuid.UUID
    amount: Decimal
    currency: str
