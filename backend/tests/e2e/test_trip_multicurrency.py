"""
E2E test: Full trip lifecycle with multi-currency expenses.

Mocking strategy: ONLY the lowest external layer is mocked:
  - httpx.AsyncClient.get → mocked to return fake Frankfurter API responses
  - Everything else (SQLAlchemy/SQLite, repositories, services, routers) runs for real.

This tests the entire application stack end-to-end.
"""
from decimal import Decimal
from unittest.mock import AsyncMock, patch, MagicMock

import pytest
from httpx import AsyncClient


def _make_frankfurter_response(from_currency: str, to_currency: str, rate: float):
    """Build a mock httpx.Response mimicking Frankfurter API."""
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.raise_for_status = MagicMock()
    mock_response.json.return_value = {
        "amount": 1.0,
        "base": from_currency,
        "date": "2024-06-15",
        "rates": {to_currency: rate},
    }
    return mock_response


# Map of (from, to) → rate for the mock
MOCK_RATES = {
    ("USD", "EUR"): 0.92,
    ("EUR", "USD"): 1.087,
    ("GBP", "EUR"): 1.17,
    ("GBP", "USD"): 1.27,
    ("JPY", "EUR"): 0.0059,
    ("JPY", "USD"): 0.0064,
    ("USD", "USD"): 1.0,
    ("EUR", "EUR"): 1.0,
}


async def _mock_httpx_get(url, params=None, timeout=None):
    """Mock httpx.AsyncClient.get to return fake exchange rates."""
    from_c = params.get("from", "USD") if params else "USD"
    to_c = params.get("to", "EUR") if params else "EUR"
    rate = MOCK_RATES.get((from_c, to_c), 1.0)
    return _make_frankfurter_response(from_c, to_c, rate)


class TestFullTripLifecycle:
    """
    Complete trip E2E:
    1. Register 3 users
    2. Create a trip group with EUR target currency
    3. User A adds $50 USD expense (equal split)
    4. User B adds £30 GBP expense (equal split)
    5. User C adds ¥5000 JPY expense (equal split)
    6. Check balances → all converted to EUR
    7. Check simplified debts → minimal transactions
    8. Record settlement
    9. Verify balances update
    10. Check activity feed has all events
    """

    @pytest.mark.asyncio
    @patch("app.services.currency_service.httpx.AsyncClient")
    async def test_full_trip_with_multicurrency(self, mock_httpx_class, client: AsyncClient):
        # Set up the mock: httpx.AsyncClient() returns a context manager with mocked .get()
        mock_client_instance = AsyncMock()
        mock_client_instance.get = AsyncMock(side_effect=_mock_httpx_get)
        mock_client_instance.__aenter__ = AsyncMock(return_value=mock_client_instance)
        mock_client_instance.__aexit__ = AsyncMock(return_value=False)
        mock_httpx_class.return_value = mock_client_instance

        # ── Step 1: Register 3 users ──
        r1 = await client.post("/api/auth/register", json={
            "username": "alice_trip", "email": "alice_trip@test.com",
            "password": "pass123456", "display_name": "Alice",
        })
        assert r1.status_code == 201
        alice_token = r1.json()["access_token"]
        alice_id = r1.json()["user"]["id"]
        alice_h = {"Authorization": f"Bearer {alice_token}"}

        r2 = await client.post("/api/auth/register", json={
            "username": "bob_trip", "email": "bob_trip@test.com",
            "password": "pass123456", "display_name": "Bob",
        })
        bob_token = r2.json()["access_token"]
        bob_id = r2.json()["user"]["id"]
        bob_h = {"Authorization": f"Bearer {bob_token}"}

        r3 = await client.post("/api/auth/register", json={
            "username": "charlie_trip", "email": "charlie_trip@test.com",
            "password": "pass123456", "display_name": "Charlie",
        })
        charlie_token = r3.json()["access_token"]
        charlie_id = r3.json()["user"]["id"]
        charlie_h = {"Authorization": f"Bearer {charlie_token}"}

        # ── Step 2: Alice creates a trip group (target: EUR) ──
        group_resp = await client.post("/api/groups", json={
            "name": "Europe Trip 2024",
            "group_type": "trip",
            "target_currency": "EUR",
            "trip_start_date": "2024-06-01",
            "trip_end_date": "2024-06-15",
        }, headers=alice_h)
        assert group_resp.status_code == 201
        group_id = group_resp.json()["id"]
        assert group_resp.json()["target_currency"] == "EUR"

        # Add Bob and Charlie
        await client.post(f"/api/groups/{group_id}/members", json={"user_id": bob_id}, headers=alice_h)
        await client.post(f"/api/groups/{group_id}/members", json={"user_id": charlie_id}, headers=alice_h)

        # Verify 3 members
        group_detail = await client.get(f"/api/groups/{group_id}", headers=alice_h)
        assert len(group_detail.json()["members"]) == 3

        # ── Step 3: Alice adds $50 USD expense (equal split among 3) ──
        exp1 = await client.post(f"/api/groups/{group_id}/expenses", json={
            "description": "Airport taxi",
            "amount": "50.00",
            "currency": "USD",
        }, headers=alice_h)
        assert exp1.status_code == 201
        assert exp1.json()["currency"] == "USD"
        assert len(exp1.json()["splits"]) == 3

        # ── Step 4: Bob adds £30 GBP expense (equal split) ──
        exp2 = await client.post(f"/api/groups/{group_id}/expenses", json={
            "description": "Museum tickets",
            "amount": "30.00",
            "currency": "GBP",
        }, headers=bob_h)
        assert exp2.status_code == 201

        # ── Step 5: Charlie adds ¥5000 JPY expense (equal split) ──
        exp3 = await client.post(f"/api/groups/{group_id}/expenses", json={
            "description": "Sushi dinner",
            "amount": "5000",
            "currency": "JPY",
        }, headers=charlie_h)
        assert exp3.status_code == 201

        # ── Step 6: Check balances (all converted to EUR) ──
        bal_resp = await client.get(f"/api/groups/{group_id}/balances", headers=alice_h)
        assert bal_resp.status_code == 200
        balances = {b["user_id"]: Decimal(b["balance"]) for b in bal_resp.json()}

        # Verify net zero: all balances should sum to approximately 0
        total = sum(balances.values())
        assert abs(total) < Decimal("0.1"), f"Balances should net to ~0, got {total}"

        # At least one person should be positive (creditor) and one negative (debtor)
        assert any(v > 0 for v in balances.values()), "Should have at least one creditor"
        assert any(v < 0 for v in balances.values()), "Should have at least one debtor"

        # ── Step 7: Check simplified debts ──
        debts_resp = await client.get(f"/api/groups/{group_id}/debts", headers=alice_h)
        assert debts_resp.status_code == 200
        debts = debts_resp.json()
        # With 3 people, simplified debts should be at most 2 transactions
        assert len(debts) <= 2
        assert all(d["currency"] == "EUR" for d in debts)

        # ── Step 8: List expenses ──
        expenses_resp = await client.get(f"/api/groups/{group_id}/expenses", headers=alice_h)
        assert expenses_resp.status_code == 200
        expenses = expenses_resp.json()
        assert len(expenses) == 3
        descriptions = {e["description"] for e in expenses}
        assert descriptions == {"Airport taxi", "Museum tickets", "Sushi dinner"}

        # ── Step 9: Record a settlement (highest debtor pays highest creditor) ──
        if debts:
            debt = debts[0]
            user_tokens = [
                (alice_id, alice_token), (bob_id, bob_token), (charlie_id, charlie_token)
            ]
            debtor_token = self._get_token_for(debt["from_user"], user_tokens)
            debtor_headers = {"Authorization": f"Bearer {debtor_token}"}
            settle_resp = await client.post(f"/api/groups/{group_id}/settle", json={
                "to_user_id": debt["to_user"],
                "amount": debt["amount"],
                "currency": "EUR",
            }, headers=debtor_headers)
            assert settle_resp.status_code == 201
            assert settle_resp.json()["is_settlement"] is True

        # ── Step 10: Check activity feed ──
        activity_resp = await client.get(f"/api/groups/{group_id}/activities", headers=alice_h)
        assert activity_resp.status_code == 200
        activities = activity_resp.json()
        activity_types = {a["activity_type"] for a in activities}
        # Should have: group_created, member_added (x2), expense_created (x3), settlement
        assert "group_created" in activity_types
        assert "member_added" in activity_types
        assert "expense_created" in activity_types
        if debts:
            assert "settlement_recorded" in activity_types

    @staticmethod
    def _get_token_for(user_id: str, users: list[tuple[str, str]]) -> str:
        for uid, token in users:
            if uid == user_id:
                return token
        return users[0][1]


class TestFullSettlementFlow:
    """E2E: Two users, multiple expenses, settle up, verify zero balance."""

    @pytest.mark.asyncio
    async def test_two_users_full_settle_cycle(self, client: AsyncClient):
        # Register
        r1 = await client.post("/api/auth/register", json={
            "username": "settle_a", "email": "settle_a@test.com",
            "password": "pass123456", "display_name": "Settle A",
        })
        r2 = await client.post("/api/auth/register", json={
            "username": "settle_b", "email": "settle_b@test.com",
            "password": "pass123456", "display_name": "Settle B",
        })
        a_h = {"Authorization": f"Bearer {r1.json()['access_token']}"}
        b_h = {"Authorization": f"Bearer {r2.json()['access_token']}"}
        b_id = r2.json()["user"]["id"]

        # Create group
        g = await client.post("/api/groups", json={"name": "Settle Flow"}, headers=a_h)
        gid = g.json()["id"]
        await client.post(f"/api/groups/{gid}/members", json={"user_id": b_id}, headers=a_h)

        # A pays $120 (equal split → each owes $60)
        await client.post(f"/api/groups/{gid}/expenses", json={
            "description": "Dinner", "amount": "120.00", "currency": "USD",
        }, headers=a_h)

        # B pays $40 (equal split → each owes $20)
        await client.post(f"/api/groups/{gid}/expenses", json={
            "description": "Drinks", "amount": "40.00", "currency": "USD",
        }, headers=b_h)

        # Check debts: A paid 120 - owes 80 = +40. B paid 40 - owes 80 = -40. B owes A $40 net.
        debts = await client.get(f"/api/groups/{gid}/debts", headers=a_h)
        assert len(debts.json()) == 1
        assert Decimal(debts.json()[0]["amount"]) == Decimal("40.0000")

        # B settles $40
        await client.post(f"/api/groups/{gid}/settle", json={
            "to_user_id": debts.json()[0]["to_user"],
            "amount": "40.00",
            "currency": "USD",
        }, headers=b_h)

        # Verify zero balance
        bal = await client.get(f"/api/groups/{gid}/balances", headers=a_h)
        for b in bal.json():
            assert abs(Decimal(b["balance"])) < Decimal("0.01")

        # Verify debts are now empty
        debts_after = await client.get(f"/api/groups/{gid}/debts", headers=a_h)
        assert debts_after.json() == []


class TestAppHealthAndStartup:
    """Verify the app serves basic requests correctly."""

    @pytest.mark.asyncio
    async def test_health_endpoint(self, client: AsyncClient):
        response = await client.get("/api/health")
        assert response.status_code == 200
        assert response.json() == {"status": "ok"}

    @pytest.mark.asyncio
    async def test_openapi_docs_accessible(self, client: AsyncClient):
        response = await client.get("/api/openapi.json")
        assert response.status_code == 200
        schema = response.json()
        assert schema["info"]["title"] == "Splitwise Multi-Currency API"
        # Verify all route groups are present
        paths = list(schema["paths"].keys())
        assert "/api/auth/register" in paths
        assert "/api/auth/login" in paths
        assert "/api/groups" in paths
        assert "/api/health" in paths
        assert "/api/activities" in paths

    @pytest.mark.asyncio
    async def test_unauthenticated_requests_rejected(self, client: AsyncClient):
        response = await client.get("/api/groups")
        assert response.status_code == 403

    @pytest.mark.asyncio
    async def test_invalid_route_returns_404(self, client: AsyncClient):
        response = await client.get("/api/nonexistent")
        assert response.status_code in (404, 405)


class TestMultiUserPermissions:
    """E2E: verify permission boundaries across users and groups."""

    @pytest.mark.asyncio
    async def test_user_cannot_access_other_users_group(self, client: AsyncClient):
        # Register 2 users
        r1 = await client.post("/api/auth/register", json={
            "username": "perm_a", "email": "perm_a@test.com",
            "password": "pass123456", "display_name": "Perm A",
        })
        r2 = await client.post("/api/auth/register", json={
            "username": "perm_b", "email": "perm_b@test.com",
            "password": "pass123456", "display_name": "Perm B",
        })
        a_h = {"Authorization": f"Bearer {r1.json()['access_token']}"}
        b_h = {"Authorization": f"Bearer {r2.json()['access_token']}"}

        # A creates a group
        g = await client.post("/api/groups", json={"name": "A's Group"}, headers=a_h)
        gid = g.json()["id"]

        # B cannot view the group
        assert (await client.get(f"/api/groups/{gid}", headers=b_h)).status_code == 403

        # B cannot add expenses
        assert (await client.post(f"/api/groups/{gid}/expenses", json={
            "description": "Hack", "amount": "100", "currency": "USD",
        }, headers=b_h)).status_code == 403

        # B cannot view balances
        assert (await client.get(f"/api/groups/{gid}/balances", headers=b_h)).status_code == 403

        # B cannot view debts
        assert (await client.get(f"/api/groups/{gid}/debts", headers=b_h)).status_code == 403

        # B cannot settle
        assert (await client.post(f"/api/groups/{gid}/settle", json={
            "to_user_id": r1.json()["user"]["id"], "amount": "10", "currency": "USD",
        }, headers=b_h)).status_code == 403

        # B cannot view activities
        assert (await client.get(f"/api/groups/{gid}/activities", headers=b_h)).status_code == 403

    @pytest.mark.asyncio
    async def test_user_only_sees_own_groups(self, client: AsyncClient):
        r1 = await client.post("/api/auth/register", json={
            "username": "iso_a", "email": "iso_a@test.com",
            "password": "pass123456", "display_name": "Iso A",
        })
        r2 = await client.post("/api/auth/register", json={
            "username": "iso_b", "email": "iso_b@test.com",
            "password": "pass123456", "display_name": "Iso B",
        })
        a_h = {"Authorization": f"Bearer {r1.json()['access_token']}"}
        b_h = {"Authorization": f"Bearer {r2.json()['access_token']}"}

        await client.post("/api/groups", json={"name": "A Group 1"}, headers=a_h)
        await client.post("/api/groups", json={"name": "A Group 2"}, headers=a_h)
        await client.post("/api/groups", json={"name": "B Group 1"}, headers=b_h)

        a_groups = await client.get("/api/groups", headers=a_h)
        b_groups = await client.get("/api/groups", headers=b_h)

        a_names = {g["name"] for g in a_groups.json()}
        b_names = {g["name"] for g in b_groups.json()}

        assert "A Group 1" in a_names
        assert "A Group 2" in a_names
        assert "B Group 1" not in a_names

        assert "B Group 1" in b_names
        assert "A Group 1" not in b_names
