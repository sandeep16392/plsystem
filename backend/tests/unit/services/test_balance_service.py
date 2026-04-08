import uuid
from datetime import date
from decimal import Decimal

import pytest

from app.services.balance_service import BalanceService


class FakeExpenseRepo:
    """Mock expense repo for unit testing balance computation."""

    def __init__(self, expenses_with_splits):
        self._data = expenses_with_splits

    async def get_group_expenses_with_splits(self, group_id):
        return self._data


class FakeExpense:
    def __init__(self, paid_by, amount, currency="USD"):
        self.paid_by = paid_by
        self.amount = Decimal(str(amount))
        self.currency = currency


class FakeSplit:
    def __init__(self, user_id, owed_amount):
        self.user_id = user_id
        self.owed_amount = Decimal(str(owed_amount))


async def dummy_rate_fn(from_curr, to_curr, date_):
    return Decimal("1")


class TestComputeGroupBalances:
    @pytest.mark.asyncio
    async def test_single_expense_equal_split_same_currency(self):
        """A pays 100, split equally among A and B. A is owed 50."""
        a, b = uuid.uuid4(), uuid.uuid4()
        expenses = [
            (FakeExpense(a, 100), [FakeSplit(a, 50), FakeSplit(b, 50)]),
        ]
        service = BalanceService(FakeExpenseRepo(expenses))
        balances = await service.compute_group_balances(
            uuid.uuid4(), "USD", dummy_rate_fn, date.today()
        )
        # A paid 100, owes 50 → net +50
        assert balances[a] == Decimal("50")
        # B paid 0, owes 50 → net -50
        assert balances[b] == Decimal("-50")

    @pytest.mark.asyncio
    async def test_multiple_expenses_different_payers(self):
        """A pays 60, B pays 40, split equally among A and B."""
        a, b = uuid.uuid4(), uuid.uuid4()
        expenses = [
            (FakeExpense(a, 60), [FakeSplit(a, 30), FakeSplit(b, 30)]),
            (FakeExpense(b, 40), [FakeSplit(a, 20), FakeSplit(b, 20)]),
        ]
        service = BalanceService(FakeExpenseRepo(expenses))
        balances = await service.compute_group_balances(
            uuid.uuid4(), "USD", dummy_rate_fn, date.today()
        )
        # A: paid 60, owes 30+20=50 → net +10
        assert balances[a] == Decimal("10")
        # B: paid 40, owes 30+20=50 → net -10
        assert balances[b] == Decimal("-10")

    @pytest.mark.asyncio
    async def test_no_expenses_all_zero(self):
        service = BalanceService(FakeExpenseRepo([]))
        balances = await service.compute_group_balances(
            uuid.uuid4(), "USD", dummy_rate_fn, date.today()
        )
        assert balances == {}

    @pytest.mark.asyncio
    async def test_three_people_various_expenses(self):
        """A pays 90, B pays 60, split equally among A, B, C."""
        a, b, c = uuid.uuid4(), uuid.uuid4(), uuid.uuid4()
        expenses = [
            (FakeExpense(a, 90), [FakeSplit(a, 30), FakeSplit(b, 30), FakeSplit(c, 30)]),
            (FakeExpense(b, 60), [FakeSplit(a, 20), FakeSplit(b, 20), FakeSplit(c, 20)]),
        ]
        service = BalanceService(FakeExpenseRepo(expenses))
        balances = await service.compute_group_balances(
            uuid.uuid4(), "USD", dummy_rate_fn, date.today()
        )
        # A: paid 90, owes 30+20=50 → net +40
        assert balances[a] == Decimal("40")
        # B: paid 60, owes 30+20=50 → net +10
        assert balances[b] == Decimal("10")
        # C: paid 0, owes 30+20=50 → net -50
        assert balances[c] == Decimal("-50")
        # Net should sum to zero
        assert sum(balances.values()) == Decimal("0")

    @pytest.mark.asyncio
    async def test_self_expense_single_person(self):
        """A pays 100, only A in split → net 0."""
        a = uuid.uuid4()
        expenses = [
            (FakeExpense(a, 100), [FakeSplit(a, 100)]),
        ]
        service = BalanceService(FakeExpenseRepo(expenses))
        balances = await service.compute_group_balances(
            uuid.uuid4(), "USD", dummy_rate_fn, date.today()
        )
        assert balances[a] == Decimal("0")

    @pytest.mark.asyncio
    async def test_multi_currency_with_conversion(self):
        """A pays 100 EUR, group target USD, rate 1.1 → converted to 110 USD."""
        a, b = uuid.uuid4(), uuid.uuid4()
        expenses = [
            (FakeExpense(a, 100, "EUR"), [FakeSplit(a, 50), FakeSplit(b, 50)]),
        ]

        async def rate_fn(from_curr, to_curr, date_):
            if from_curr == "EUR" and to_curr == "USD":
                return Decimal("1.1")
            return Decimal("1")

        service = BalanceService(FakeExpenseRepo(expenses))
        balances = await service.compute_group_balances(
            uuid.uuid4(), "USD", rate_fn, date.today()
        )
        # A paid 100 EUR * 1.1 = 110 USD. Owes 50 * 1.1 = 55. Net = +55
        assert balances[a] == Decimal("55.0")
        # B owes 50 * 1.1 = 55. Net = -55
        assert balances[b] == Decimal("-55.0")

    @pytest.mark.asyncio
    async def test_settlement_reduces_balances(self):
        """After expense and settlement payment, balances should reflect settlement."""
        a, b = uuid.uuid4(), uuid.uuid4()
        expenses = [
            # Real expense: A pays 100, split equally
            (FakeExpense(a, 100), [FakeSplit(a, 50), FakeSplit(b, 50)]),
            # Settlement: B pays A 50 (is_settlement but same in balance calc)
            (FakeExpense(b, 50), [FakeSplit(a, 50)]),
        ]
        service = BalanceService(FakeExpenseRepo(expenses))
        balances = await service.compute_group_balances(
            uuid.uuid4(), "USD", dummy_rate_fn, date.today()
        )
        # A: paid 100 - owed(50+50) + received_settlement(0) = 0
        # B: paid 50 - owed(50) = 0
        assert abs(balances.get(a, 0)) < Decimal("0.01")
        assert abs(balances.get(b, 0)) < Decimal("0.01")

    @pytest.mark.asyncio
    async def test_five_people_net_zero(self):
        """Verify net balances always sum to zero regardless of complexity."""
        ids = [uuid.uuid4() for _ in range(5)]
        expenses = [
            (FakeExpense(ids[0], 200), [FakeSplit(uid, 40) for uid in ids]),
            (FakeExpense(ids[1], 150), [FakeSplit(uid, 30) for uid in ids]),
            (FakeExpense(ids[2], 75), [FakeSplit(ids[0], 25), FakeSplit(ids[3], 25), FakeSplit(ids[4], 25)]),
        ]
        service = BalanceService(FakeExpenseRepo(expenses))
        balances = await service.compute_group_balances(
            uuid.uuid4(), "USD", dummy_rate_fn, date.today()
        )
        assert abs(sum(balances.values())) < Decimal("0.01")
