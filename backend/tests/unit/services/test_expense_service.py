import uuid
from decimal import Decimal

import pytest

from app.services.expense_service import ExpenseService
from app.schemas.expense import ExpenseSplitCreate


class TestEqualSplit:
    def setup_method(self):
        self.service = ExpenseService(expense_repo=None)

    def test_equal_split_even(self):
        ids = [uuid.uuid4() for _ in range(4)]
        splits = self.service.calculate_equal_splits(Decimal("100"), ids)
        assert len(splits) == 4
        total = sum(s.owed_amount for s in splits)
        assert total == Decimal("100")
        assert all(s.owed_amount == Decimal("25") for s in splits)

    def test_equal_split_uneven_3_people(self):
        ids = [uuid.uuid4() for _ in range(3)]
        splits = self.service.calculate_equal_splits(Decimal("100"), ids)
        total = sum(s.owed_amount for s in splits)
        assert total == Decimal("100")
        # First person gets remainder
        assert splits[0].owed_amount != splits[1].owed_amount or splits[0].owed_amount != splits[2].owed_amount

    def test_equal_split_single_person(self):
        ids = [uuid.uuid4()]
        splits = self.service.calculate_equal_splits(Decimal("50"), ids)
        assert len(splits) == 1
        assert splits[0].owed_amount == Decimal("50")

    def test_equal_split_zero_members_raises(self):
        with pytest.raises(Exception):
            self.service.calculate_equal_splits(Decimal("100"), [])


class TestExactSplit:
    def setup_method(self):
        self.service = ExpenseService(expense_repo=None)

    def test_exact_split_valid(self):
        split_data = [
            ExpenseSplitCreate(user_id=uuid.uuid4(), owed_amount=Decimal("60")),
            ExpenseSplitCreate(user_id=uuid.uuid4(), owed_amount=Decimal("40")),
        ]
        splits = self.service.calculate_exact_splits(Decimal("100"), split_data)
        assert len(splits) == 2
        assert sum(s.owed_amount for s in splits) == Decimal("100")

    def test_exact_split_mismatch_raises(self):
        split_data = [
            ExpenseSplitCreate(user_id=uuid.uuid4(), owed_amount=Decimal("60")),
            ExpenseSplitCreate(user_id=uuid.uuid4(), owed_amount=Decimal("30")),
        ]
        with pytest.raises(Exception, match="do not match"):
            self.service.calculate_exact_splits(Decimal("100"), split_data)


class TestPercentageSplit:
    def setup_method(self):
        self.service = ExpenseService(expense_repo=None)

    def test_percentage_split_valid(self):
        split_data = [
            ExpenseSplitCreate(user_id=uuid.uuid4(), percentage=Decimal("50")),
            ExpenseSplitCreate(user_id=uuid.uuid4(), percentage=Decimal("30")),
            ExpenseSplitCreate(user_id=uuid.uuid4(), percentage=Decimal("20")),
        ]
        splits = self.service.calculate_percentage_splits(Decimal("200"), split_data)
        assert len(splits) == 3
        assert sum(s.owed_amount for s in splits) == Decimal("200")
        assert splits[0].owed_amount == Decimal("100")

    def test_percentage_not_100_raises(self):
        split_data = [
            ExpenseSplitCreate(user_id=uuid.uuid4(), percentage=Decimal("50")),
            ExpenseSplitCreate(user_id=uuid.uuid4(), percentage=Decimal("30")),
        ]
        with pytest.raises(Exception, match="100%"):
            self.service.calculate_percentage_splits(Decimal("200"), split_data)


class TestSharesSplit:
    def setup_method(self):
        self.service = ExpenseService(expense_repo=None)

    def test_shares_split_valid(self):
        split_data = [
            ExpenseSplitCreate(user_id=uuid.uuid4(), shares=2),
            ExpenseSplitCreate(user_id=uuid.uuid4(), shares=1),
            ExpenseSplitCreate(user_id=uuid.uuid4(), shares=1),
        ]
        splits = self.service.calculate_shares_splits(Decimal("400"), split_data)
        assert len(splits) == 3
        assert sum(s.owed_amount for s in splits) == Decimal("400")
        assert splits[0].owed_amount == Decimal("200")

    def test_shares_zero_total_raises(self):
        split_data = [
            ExpenseSplitCreate(user_id=uuid.uuid4(), shares=0),
            ExpenseSplitCreate(user_id=uuid.uuid4(), shares=0),
        ]
        with pytest.raises(Exception, match="zero"):
            self.service.calculate_shares_splits(Decimal("100"), split_data)


class TestCalculateSplitsDispatch:
    def setup_method(self):
        self.service = ExpenseService(expense_repo=None)

    def test_unknown_method_raises(self):
        with pytest.raises(Exception, match="Unknown split method"):
            self.service.calculate_splits(Decimal("100"), "unknown", [uuid.uuid4()])

    def test_exact_without_data_raises(self):
        with pytest.raises(Exception, match="Split data required"):
            self.service.calculate_splits(Decimal("100"), "exact", [uuid.uuid4()])
