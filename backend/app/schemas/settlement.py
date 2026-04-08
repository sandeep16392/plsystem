import uuid
from decimal import Decimal

from pydantic import BaseModel, Field


class SettleCreate(BaseModel):
    to_user_id: uuid.UUID
    amount: Decimal = Field(..., gt=0)
    currency: str = Field(..., min_length=3, max_length=3)
