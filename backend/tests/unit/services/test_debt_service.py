import uuid
from decimal import Decimal

import pytest

from app.services.debt_service import DebtService


class TestSimplifyDebts:
    def test_two_people_one_owes_other(self):
        a, b = uuid.uuid4(), uuid.uuid4()
        balances = {a: Decimal("50"), b: Decimal("-50")}
        result = DebtService.simplify_debts(balances)
        assert len(result) == 1
        assert result[0]["from_user"] == b
        assert result[0]["to_user"] == a
        assert result[0]["amount"] == Decimal("50")

    def test_three_people_circular_debts(self):
        a, b, c = uuid.uuid4(), uuid.uuid4(), uuid.uuid4()
        # A is owed 30, B is owed 10, C owes 40
        balances = {a: Decimal("30"), b: Decimal("10"), c: Decimal("-40")}
        result = DebtService.simplify_debts(balances)
        # Should be simplified to at most 2 transactions
        assert len(result) <= 2
        # Total paid by C should be 40
        total_from_c = sum(t["amount"] for t in result if t["from_user"] == c)
        assert total_from_c == Decimal("40")

    def test_five_people_mixed(self):
        ids = [uuid.uuid4() for _ in range(5)]
        balances = {
            ids[0]: Decimal("100"),
            ids[1]: Decimal("-30"),
            ids[2]: Decimal("-20"),
            ids[3]: Decimal("10"),
            ids[4]: Decimal("-60"),
        }
        result = DebtService.simplify_debts(balances)
        # Net should be zero
        net = {}
        for t in result:
            net[t["from_user"]] = net.get(t["from_user"], Decimal("0")) - t["amount"]
            net[t["to_user"]] = net.get(t["to_user"], Decimal("0")) + t["amount"]
        for uid, balance in balances.items():
            actual = net.get(uid, Decimal("0"))
            assert abs(actual - balance) < Decimal("0.01"), f"User {uid}: expected {balance}, got {actual}"

    def test_all_balances_zero(self):
        a, b, c = uuid.uuid4(), uuid.uuid4(), uuid.uuid4()
        balances = {a: Decimal("0"), b: Decimal("0"), c: Decimal("0")}
        result = DebtService.simplify_debts(balances)
        assert result == []

    def test_single_person_nonzero(self):
        a = uuid.uuid4()
        balances = {a: Decimal("100")}
        result = DebtService.simplify_debts(balances)
        assert result == []

    def test_large_group_20_people(self):
        ids = [uuid.uuid4() for _ in range(20)]
        # Alternate positive and negative
        balances = {}
        for i, uid in enumerate(ids):
            if i % 2 == 0:
                balances[uid] = Decimal(str((i + 1) * 10))
            else:
                balances[uid] = Decimal(str(-(i + 1) * 10))

        # Adjust to make net zero
        total = sum(balances.values())
        balances[ids[0]] -= total

        result = DebtService.simplify_debts(balances)
        # Verify net zero after all transactions
        net = {}
        for t in result:
            net[t["from_user"]] = net.get(t["from_user"], Decimal("0")) - t["amount"]
            net[t["to_user"]] = net.get(t["to_user"], Decimal("0")) + t["amount"]

        for uid, balance in balances.items():
            actual = net.get(uid, Decimal("0"))
            assert abs(actual - balance) < Decimal("0.01")

        # Should have fewer transactions than n-1
        assert len(result) < 20
