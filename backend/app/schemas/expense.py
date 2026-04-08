import uuid
from datetime import date, datetime
from decimal import Decimal

from pydantic import BaseModel, Field


class ExpenseSplitCreate(BaseModel):
    user_id: uuid.UUID
    owed_amount: Decimal | None = None  # Required for exact split
    percentage: Decimal | None = None  # Required for percentage split
    shares: int | None = None  # Required for shares split


class ExpenseCreate(BaseModel):
    description: str = Field(..., min_length=1, max_length=500)
    amount: Decimal = Field(..., gt=0)
    currency: str = Field(..., min_length=3, max_length=3)
    category: str = Field(default="general", max_length=50)
    split_method: str = Field(default="equal", pattern=r"^(equal|exact|percentage|shares)$")
    expense_date: date = Field(default_factory=date.today)
    notes: str | None = None
    splits: list[ExpenseSplitCreate] = []
    is_settlement: bool = False


class ExpenseUpdate(BaseModel):
    description: str | None = None
    amount: Decimal | None = Field(default=None, gt=0)
    currency: str | None = None
    category: str | None = None
    split_method: str | None = None
    expense_date: date | None = None
    notes: str | None = None
    splits: list[ExpenseSplitCreate] | None = None


class ExpenseSplitResponse(BaseModel):
    id: uuid.UUID
    expense_id: uuid.UUID
    user_id: uuid.UUID
    owed_amount: Decimal
    converted_owed_amount: Decimal | None
    paid_amount: Decimal

    model_config = {"from_attributes": True}


class ExpenseResponse(BaseModel):
    id: uuid.UUID
    group_id: uuid.UUID
    paid_by: uuid.UUID
    description: str
    amount: Decimal
    currency: str
    converted_amount: Decimal | None
    exchange_rate: Decimal | None
    rate_date: date | None
    category: str
    split_method: str
    expense_date: date
    receipt_url: str | None
    notes: str | None
    is_settlement: bool
    created_at: datetime
    updated_at: datetime
    splits: list[ExpenseSplitResponse] = []

    model_config = {"from_attributes": True}
