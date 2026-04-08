import uuid
from datetime import date, datetime, timezone
from decimal import Decimal

from sqlalchemy import String, Boolean, Date, DateTime, ForeignKey, Numeric, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Expense(Base):
    __tablename__ = "expenses"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    group_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("groups.id", ondelete="CASCADE"), nullable=False, index=True
    )
    paid_by: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True
    )
    description: Mapped[str] = mapped_column(String(500), nullable=False)

    # Original amount in original currency (NEVER modified after creation)
    amount: Mapped[Decimal] = mapped_column(Numeric(15, 4), nullable=False)
    currency: Mapped[str] = mapped_column(String(3), nullable=False)

    # Cached conversion to group target currency
    converted_amount: Mapped[Decimal | None] = mapped_column(Numeric(15, 4), nullable=True)
    exchange_rate: Mapped[Decimal | None] = mapped_column(Numeric(15, 8), nullable=True)
    rate_date: Mapped[date | None] = mapped_column(Date, nullable=True)

    category: Mapped[str] = mapped_column(String(50), default="general")
    split_method: Mapped[str] = mapped_column(String(20), nullable=False, default="equal")
    expense_date: Mapped[date] = mapped_column(Date, nullable=False, default=date.today)
    receipt_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    is_settlement: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )


class ExpenseSplit(Base):
    __tablename__ = "expense_splits"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    expense_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("expenses.id", ondelete="CASCADE"), nullable=False, index=True
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True
    )
    owed_amount: Mapped[Decimal] = mapped_column(Numeric(15, 4), nullable=False)
    converted_owed_amount: Mapped[Decimal | None] = mapped_column(Numeric(15, 4), nullable=True)
    paid_amount: Mapped[Decimal] = mapped_column(Numeric(15, 4), default=Decimal("0"))
