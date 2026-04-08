from decimal import Decimal

import pytest
from httpx import AsyncClient


class TestSettleUp:
    @pytest.mark.asyncio
    async def test_settle_up_creates_settlement_expense(
        self, client: AsyncClient, test_user, test_user2, auth_headers
    ):
        group = await client.post("/api/groups", json={"name": "Settle Test"}, headers=auth_headers)
        gid = group.json()["id"]
        await client.post(f"/api/groups/{gid}/members", json={
            "user_id": str(test_user2.id),
        }, headers=auth_headers)

        # User1 pays 100, equal split → User2 owes User1 $50
        await client.post(f"/api/groups/{gid}/expenses", json={
            "description": "Dinner",
            "amount": "100.00",
            "currency": "USD",
        }, headers=auth_headers)

        # User2 settles with User1
        response = await client.post(f"/api/groups/{gid}/settle", json={
            "to_user_id": str(test_user.id),
            "amount": "50.00",
            "currency": "USD",
        }, headers=auth_headers)
        assert response.status_code == 201
        data = response.json()
        assert data["is_settlement"] is True
        assert Decimal(data["amount"]) == Decimal("50.00")
        assert data["paid_by"] == str(test_user.id)

    @pytest.mark.asyncio
    async def test_settlement_zeroes_balances(
        self, client: AsyncClient, test_user, test_user2, auth_headers
    ):
        group = await client.post("/api/groups", json={"name": "Zero Test"}, headers=auth_headers)
        gid = group.json()["id"]
        await client.post(f"/api/groups/{gid}/members", json={
            "user_id": str(test_user2.id),
        }, headers=auth_headers)

        # User1 pays 80, equal split → each owes 40
        await client.post(f"/api/groups/{gid}/expenses", json={
            "description": "Lunch",
            "amount": "80.00",
            "currency": "USD",
        }, headers=auth_headers)

        # Check balance before settlement
        bal_before = await client.get(f"/api/groups/{gid}/balances", headers=auth_headers)
        balances = {b["user_id"]: Decimal(b["balance"]) for b in bal_before.json()}
        assert balances[str(test_user.id)] == Decimal("40.0000")
        assert balances[str(test_user2.id)] == Decimal("-40.0000")

        # User2 settles $40 with User1 (User1 is the payer of settlement, User2 is split)
        # Actually: settlement = User2 pays User1. In our model:
        #   paid_by=user2, split=[user1 owes full amount]
        # But the settle endpoint uses current user as payer.
        # Let's use user2's perspective:
        from app.core.security import create_access_token
        headers2 = {"Authorization": f"Bearer {create_access_token({'sub': str(test_user2.id)})}" }

        await client.post(f"/api/groups/{gid}/settle", json={
            "to_user_id": str(test_user.id),
            "amount": "40.00",
            "currency": "USD",
        }, headers=headers2)

        # Check balance after settlement
        bal_after = await client.get(f"/api/groups/{gid}/balances", headers=auth_headers)
        balances = {b["user_id"]: Decimal(b["balance"]) for b in bal_after.json()}

        for uid, bal in balances.items():
            assert abs(bal) < Decimal("0.01"), f"User {uid} should have ~0 balance, got {bal}"

    @pytest.mark.asyncio
    async def test_settle_non_member_recipient_fails(
        self, client: AsyncClient, test_user, test_user2, test_user3, auth_headers
    ):
        group = await client.post("/api/groups", json={"name": "Non-member"}, headers=auth_headers)
        gid = group.json()["id"]
        await client.post(f"/api/groups/{gid}/members", json={
            "user_id": str(test_user2.id),
        }, headers=auth_headers)

        # Try to settle with user3 who is NOT a member
        response = await client.post(f"/api/groups/{gid}/settle", json={
            "to_user_id": str(test_user3.id),
            "amount": "50.00",
            "currency": "USD",
        }, headers=auth_headers)
        assert response.status_code == 403

    @pytest.mark.asyncio
    async def test_settle_as_non_member_fails(
        self, client: AsyncClient, test_user, test_user2, auth_headers, auth_headers2
    ):
        group = await client.post("/api/groups", json={"name": "Non-member settle"}, headers=auth_headers)
        gid = group.json()["id"]

        response = await client.post(f"/api/groups/{gid}/settle", json={
            "to_user_id": str(test_user.id),
            "amount": "50.00",
            "currency": "USD",
        }, headers=auth_headers2)
        assert response.status_code == 403

    @pytest.mark.asyncio
    async def test_partial_settlement(
        self, client: AsyncClient, test_user, test_user2, auth_headers
    ):
        group = await client.post("/api/groups", json={"name": "Partial"}, headers=auth_headers)
        gid = group.json()["id"]
        await client.post(f"/api/groups/{gid}/members", json={
            "user_id": str(test_user2.id),
        }, headers=auth_headers)

        # User1 pays $100, equal split → User2 owes $50
        await client.post(f"/api/groups/{gid}/expenses", json={
            "description": "Expense",
            "amount": "100.00",
            "currency": "USD",
        }, headers=auth_headers)

        # Partial settlement: $20 only
        from app.core.security import create_access_token
        headers2 = {"Authorization": f"Bearer {create_access_token({'sub': str(test_user2.id)})}" }
        await client.post(f"/api/groups/{gid}/settle", json={
            "to_user_id": str(test_user.id),
            "amount": "20.00",
            "currency": "USD",
        }, headers=headers2)

        # Balance should be $30 remaining
        bal = await client.get(f"/api/groups/{gid}/balances", headers=auth_headers)
        balances = {b["user_id"]: Decimal(b["balance"]) for b in bal.json()}
        assert abs(balances[str(test_user.id)] - Decimal("30")) < Decimal("0.01")
        assert abs(balances[str(test_user2.id)] + Decimal("30")) < Decimal("0.01")
