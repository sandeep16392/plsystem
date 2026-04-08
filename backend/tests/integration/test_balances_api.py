from decimal import Decimal

import pytest
from httpx import AsyncClient


class TestGetBalances:
    @pytest.mark.asyncio
    async def test_single_expense_equal_split_balances(
        self, client: AsyncClient, test_user, test_user2, auth_headers
    ):
        # Create group with 2 members
        group = await client.post("/api/groups", json={
            "name": "Balance Test",
        }, headers=auth_headers)
        gid = group.json()["id"]
        await client.post(f"/api/groups/{gid}/members", json={
            "user_id": str(test_user2.id),
        }, headers=auth_headers)

        # User1 pays $100, split equally
        await client.post(f"/api/groups/{gid}/expenses", json={
            "description": "Dinner",
            "amount": "100.00",
            "currency": "USD",
        }, headers=auth_headers)

        response = await client.get(f"/api/groups/{gid}/balances", headers=auth_headers)
        assert response.status_code == 200
        balances = {b["user_id"]: Decimal(b["balance"]) for b in response.json()}

        # User1: paid 100, owes 50 → +50
        assert balances[str(test_user.id)] == Decimal("50.0000")
        # User2: paid 0, owes 50 → -50
        assert balances[str(test_user2.id)] == Decimal("-50.0000")

    @pytest.mark.asyncio
    async def test_multiple_expenses_balance_netting(
        self, client: AsyncClient, test_user, test_user2, auth_headers, auth_headers2
    ):
        group = await client.post("/api/groups", json={"name": "Net Test"}, headers=auth_headers)
        gid = group.json()["id"]
        await client.post(f"/api/groups/{gid}/members", json={
            "user_id": str(test_user2.id),
        }, headers=auth_headers)

        # User1 pays $80, equal split
        await client.post(f"/api/groups/{gid}/expenses", json={
            "description": "Groceries",
            "amount": "80.00",
            "currency": "USD",
        }, headers=auth_headers)

        # User2 pays $40, equal split
        await client.post(f"/api/groups/{gid}/expenses", json={
            "description": "Drinks",
            "amount": "40.00",
            "currency": "USD",
        }, headers=auth_headers2)

        response = await client.get(f"/api/groups/{gid}/balances", headers=auth_headers)
        assert response.status_code == 200
        balances = {b["user_id"]: Decimal(b["balance"]) for b in response.json()}

        # User1: paid 80, owes 40+20=60 → +20
        assert balances[str(test_user.id)] == Decimal("20.0000")
        # User2: paid 40, owes 40+20=60 → -20
        assert balances[str(test_user2.id)] == Decimal("-20.0000")

    @pytest.mark.asyncio
    async def test_empty_group_no_balances(
        self, client: AsyncClient, test_user, auth_headers
    ):
        group = await client.post("/api/groups", json={"name": "Empty"}, headers=auth_headers)
        gid = group.json()["id"]

        response = await client.get(f"/api/groups/{gid}/balances", headers=auth_headers)
        assert response.status_code == 200
        assert response.json() == []

    @pytest.mark.asyncio
    async def test_non_member_cannot_view_balances(
        self, client: AsyncClient, test_user, test_user2, auth_headers, auth_headers2
    ):
        group = await client.post("/api/groups", json={"name": "Private"}, headers=auth_headers)
        gid = group.json()["id"]

        response = await client.get(f"/api/groups/{gid}/balances", headers=auth_headers2)
        assert response.status_code == 403

    @pytest.mark.asyncio
    async def test_three_people_balances_sum_to_zero(
        self, client: AsyncClient, test_user, test_user2, test_user3,
        auth_headers, auth_headers2
    ):
        group = await client.post("/api/groups", json={"name": "Three"}, headers=auth_headers)
        gid = group.json()["id"]
        await client.post(f"/api/groups/{gid}/members", json={"user_id": str(test_user2.id)}, headers=auth_headers)
        await client.post(f"/api/groups/{gid}/members", json={"user_id": str(test_user3.id)}, headers=auth_headers)

        # User1 pays $90 equally among 3
        await client.post(f"/api/groups/{gid}/expenses", json={
            "description": "Hotel",
            "amount": "90.00",
            "currency": "USD",
        }, headers=auth_headers)

        # User2 pays $30 equally among 3
        await client.post(f"/api/groups/{gid}/expenses", json={
            "description": "Taxi",
            "amount": "30.00",
            "currency": "USD",
        }, headers=auth_headers2)

        response = await client.get(f"/api/groups/{gid}/balances", headers=auth_headers)
        balances = {b["user_id"]: Decimal(b["balance"]) for b in response.json()}

        total = sum(balances.values())
        assert abs(total) < Decimal("0.01"), f"Balances should sum to zero, got {total}"

    @pytest.mark.asyncio
    async def test_exact_split_balances(
        self, client: AsyncClient, test_user, test_user2, auth_headers
    ):
        group = await client.post("/api/groups", json={"name": "Exact"}, headers=auth_headers)
        gid = group.json()["id"]
        await client.post(f"/api/groups/{gid}/members", json={"user_id": str(test_user2.id)}, headers=auth_headers)

        # User1 pays $100, user1 owes $70, user2 owes $30
        await client.post(f"/api/groups/{gid}/expenses", json={
            "description": "Dinner",
            "amount": "100.00",
            "currency": "USD",
            "split_method": "exact",
            "splits": [
                {"user_id": str(test_user.id), "owed_amount": "70.00"},
                {"user_id": str(test_user2.id), "owed_amount": "30.00"},
            ],
        }, headers=auth_headers)

        response = await client.get(f"/api/groups/{gid}/balances", headers=auth_headers)
        balances = {b["user_id"]: Decimal(b["balance"]) for b in response.json()}
        # User1: paid 100 - owes 70 = +30
        assert balances[str(test_user.id)] == Decimal("30.0000")
        # User2: paid 0 - owes 30 = -30
        assert balances[str(test_user2.id)] == Decimal("-30.0000")


class TestGetSimplifiedDebts:
    @pytest.mark.asyncio
    async def test_simplified_debts_two_people(
        self, client: AsyncClient, test_user, test_user2, auth_headers
    ):
        group = await client.post("/api/groups", json={"name": "Debt Test"}, headers=auth_headers)
        gid = group.json()["id"]
        await client.post(f"/api/groups/{gid}/members", json={"user_id": str(test_user2.id)}, headers=auth_headers)

        await client.post(f"/api/groups/{gid}/expenses", json={
            "description": "Dinner",
            "amount": "100.00",
            "currency": "USD",
        }, headers=auth_headers)

        response = await client.get(f"/api/groups/{gid}/debts", headers=auth_headers)
        assert response.status_code == 200
        debts = response.json()
        assert len(debts) == 1
        assert debts[0]["from_user"] == str(test_user2.id)
        assert debts[0]["to_user"] == str(test_user.id)
        assert Decimal(debts[0]["amount"]) == Decimal("50.0000")
        assert debts[0]["currency"] == "USD"

    @pytest.mark.asyncio
    async def test_no_debts_when_settled(
        self, client: AsyncClient, test_user, test_user2, auth_headers, auth_headers2
    ):
        group = await client.post("/api/groups", json={"name": "Even"}, headers=auth_headers)
        gid = group.json()["id"]
        await client.post(f"/api/groups/{gid}/members", json={"user_id": str(test_user2.id)}, headers=auth_headers)

        # User1 pays $50, User2 pays $50
        await client.post(f"/api/groups/{gid}/expenses", json={
            "description": "A", "amount": "50.00", "currency": "USD",
        }, headers=auth_headers)
        await client.post(f"/api/groups/{gid}/expenses", json={
            "description": "B", "amount": "50.00", "currency": "USD",
        }, headers=auth_headers2)

        response = await client.get(f"/api/groups/{gid}/debts", headers=auth_headers)
        assert response.status_code == 200
        assert response.json() == []

    @pytest.mark.asyncio
    async def test_three_people_simplified(
        self, client: AsyncClient, test_user, test_user2, test_user3,
        auth_headers, auth_headers2
    ):
        group = await client.post("/api/groups", json={"name": "Three Debts"}, headers=auth_headers)
        gid = group.json()["id"]
        await client.post(f"/api/groups/{gid}/members", json={"user_id": str(test_user2.id)}, headers=auth_headers)
        await client.post(f"/api/groups/{gid}/members", json={"user_id": str(test_user3.id)}, headers=auth_headers)

        # User1 pays $120 equally among 3
        await client.post(f"/api/groups/{gid}/expenses", json={
            "description": "Big dinner",
            "amount": "120.00",
            "currency": "USD",
        }, headers=auth_headers)

        response = await client.get(f"/api/groups/{gid}/debts", headers=auth_headers)
        debts = response.json()
        # User2 and User3 each owe User1 $40
        assert len(debts) == 2
        total_owed = sum(Decimal(d["amount"]) for d in debts)
        assert abs(total_owed - Decimal("80")) < Decimal("0.01")

    @pytest.mark.asyncio
    async def test_non_member_cannot_view_debts(
        self, client: AsyncClient, test_user, test_user2, auth_headers, auth_headers2
    ):
        group = await client.post("/api/groups", json={"name": "Secret"}, headers=auth_headers)
        gid = group.json()["id"]
        response = await client.get(f"/api/groups/{gid}/debts", headers=auth_headers2)
        assert response.status_code == 403
