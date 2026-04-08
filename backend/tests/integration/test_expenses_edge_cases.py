"""Comprehensive edge-case tests for expense CRUD and split methods."""
import uuid
from decimal import Decimal

import pytest
from httpx import AsyncClient


class TestSharesSplitAPI:
    @pytest.mark.asyncio
    async def test_shares_split_creates_correct_amounts(
        self, client: AsyncClient, test_user, test_user2, test_user3, auth_headers
    ):
        group = await client.post("/api/groups", json={"name": "Shares"}, headers=auth_headers)
        gid = group.json()["id"]
        await client.post(f"/api/groups/{gid}/members", json={"user_id": str(test_user2.id)}, headers=auth_headers)
        await client.post(f"/api/groups/{gid}/members", json={"user_id": str(test_user3.id)}, headers=auth_headers)

        response = await client.post(f"/api/groups/{gid}/expenses", json={
            "description": "Hotel",
            "amount": "400.00",
            "currency": "USD",
            "split_method": "shares",
            "splits": [
                {"user_id": str(test_user.id), "shares": 2},
                {"user_id": str(test_user2.id), "shares": 1},
                {"user_id": str(test_user3.id), "shares": 1},
            ],
        }, headers=auth_headers)
        assert response.status_code == 201
        splits = response.json()["splits"]
        amounts = sorted([Decimal(s["owed_amount"]) for s in splits], reverse=True)
        assert amounts[0] == Decimal("200.0000")  # 2/4 of 400
        assert amounts[1] == Decimal("100.0000")  # 1/4 of 400
        assert amounts[2] == Decimal("100.0000")  # 1/4 of 400
        assert sum(amounts) == Decimal("400.0000")


class TestExactSplitMismatch:
    @pytest.mark.asyncio
    async def test_exact_split_sum_mismatch_returns_400(
        self, client: AsyncClient, test_user, test_user2, auth_headers
    ):
        group = await client.post("/api/groups", json={"name": "Mismatch"}, headers=auth_headers)
        gid = group.json()["id"]
        await client.post(f"/api/groups/{gid}/members", json={"user_id": str(test_user2.id)}, headers=auth_headers)

        response = await client.post(f"/api/groups/{gid}/expenses", json={
            "description": "Bad Split",
            "amount": "100.00",
            "currency": "USD",
            "split_method": "exact",
            "splits": [
                {"user_id": str(test_user.id), "owed_amount": "60.00"},
                {"user_id": str(test_user2.id), "owed_amount": "30.00"},  # Only 90, not 100
            ],
        }, headers=auth_headers)
        assert response.status_code == 400

    @pytest.mark.asyncio
    async def test_percentage_not_100_returns_400(
        self, client: AsyncClient, test_user, test_user2, auth_headers
    ):
        group = await client.post("/api/groups", json={"name": "Bad Pct"}, headers=auth_headers)
        gid = group.json()["id"]
        await client.post(f"/api/groups/{gid}/members", json={"user_id": str(test_user2.id)}, headers=auth_headers)

        response = await client.post(f"/api/groups/{gid}/expenses", json={
            "description": "Bad Pct",
            "amount": "100.00",
            "currency": "USD",
            "split_method": "percentage",
            "splits": [
                {"user_id": str(test_user.id), "percentage": "50.00"},
                {"user_id": str(test_user2.id), "percentage": "40.00"},  # 90%, not 100%
            ],
        }, headers=auth_headers)
        assert response.status_code == 400


class TestExpenseUpdate:
    @pytest.mark.asyncio
    async def test_update_expense_description(
        self, client: AsyncClient, test_user, auth_headers
    ):
        group = await client.post("/api/groups", json={"name": "Update"}, headers=auth_headers)
        gid = group.json()["id"]

        exp = await client.post(f"/api/groups/{gid}/expenses", json={
            "description": "Old Name",
            "amount": "50.00",
            "currency": "USD",
        }, headers=auth_headers)
        eid = exp.json()["id"]

        response = await client.patch(f"/api/expenses/{eid}", json={
            "description": "New Name",
        }, headers=auth_headers)
        assert response.status_code == 200
        assert response.json()["description"] == "New Name"
        # Amount unchanged
        assert Decimal(response.json()["amount"]) == Decimal("50.00")

    @pytest.mark.asyncio
    async def test_update_expense_amount(
        self, client: AsyncClient, test_user, auth_headers
    ):
        group = await client.post("/api/groups", json={"name": "Amount Update"}, headers=auth_headers)
        gid = group.json()["id"]

        exp = await client.post(f"/api/groups/{gid}/expenses", json={
            "description": "Coffee",
            "amount": "5.00",
            "currency": "USD",
        }, headers=auth_headers)
        eid = exp.json()["id"]

        response = await client.patch(f"/api/expenses/{eid}", json={
            "amount": "7.50",
        }, headers=auth_headers)
        assert response.status_code == 200
        assert Decimal(response.json()["amount"]) == Decimal("7.50")

    @pytest.mark.asyncio
    async def test_update_nonexistent_expense_returns_404(
        self, client: AsyncClient, test_user, auth_headers
    ):
        fake_id = str(uuid.uuid4())
        response = await client.patch(f"/api/expenses/{fake_id}", json={
            "description": "Ghost",
        }, headers=auth_headers)
        assert response.status_code == 404


class TestExpenseEdgeCases:
    @pytest.mark.asyncio
    async def test_get_nonexistent_expense_returns_404(
        self, client: AsyncClient, test_user, auth_headers
    ):
        fake_id = str(uuid.uuid4())
        response = await client.get(f"/api/expenses/{fake_id}", headers=auth_headers)
        assert response.status_code == 404

    @pytest.mark.asyncio
    async def test_delete_nonexistent_expense_returns_404(
        self, client: AsyncClient, test_user, auth_headers
    ):
        fake_id = str(uuid.uuid4())
        response = await client.delete(f"/api/expenses/{fake_id}", headers=auth_headers)
        assert response.status_code == 404

    @pytest.mark.asyncio
    async def test_expense_with_notes_and_category(
        self, client: AsyncClient, test_user, auth_headers
    ):
        group = await client.post("/api/groups", json={"name": "Notes"}, headers=auth_headers)
        gid = group.json()["id"]

        response = await client.post(f"/api/groups/{gid}/expenses", json={
            "description": "Flight",
            "amount": "350.00",
            "currency": "EUR",
            "category": "travel",
            "notes": "Round trip to Paris",
        }, headers=auth_headers)
        assert response.status_code == 201
        assert response.json()["category"] == "travel"
        assert response.json()["notes"] == "Round trip to Paris"

    @pytest.mark.asyncio
    async def test_expense_with_custom_date(
        self, client: AsyncClient, test_user, auth_headers
    ):
        group = await client.post("/api/groups", json={"name": "Dated"}, headers=auth_headers)
        gid = group.json()["id"]

        response = await client.post(f"/api/groups/{gid}/expenses", json={
            "description": "Old Expense",
            "amount": "25.00",
            "currency": "USD",
            "expense_date": "2024-01-15",
        }, headers=auth_headers)
        assert response.status_code == 201
        assert response.json()["expense_date"] == "2024-01-15"

    @pytest.mark.asyncio
    async def test_zero_amount_rejected(
        self, client: AsyncClient, test_user, auth_headers
    ):
        group = await client.post("/api/groups", json={"name": "Zero"}, headers=auth_headers)
        gid = group.json()["id"]

        response = await client.post(f"/api/groups/{gid}/expenses", json={
            "description": "Free?",
            "amount": "0",
            "currency": "USD",
        }, headers=auth_headers)
        assert response.status_code == 422  # Pydantic validation: amount > 0

    @pytest.mark.asyncio
    async def test_negative_amount_rejected(
        self, client: AsyncClient, test_user, auth_headers
    ):
        group = await client.post("/api/groups", json={"name": "Negative"}, headers=auth_headers)
        gid = group.json()["id"]

        response = await client.post(f"/api/groups/{gid}/expenses", json={
            "description": "Refund?",
            "amount": "-10.00",
            "currency": "USD",
        }, headers=auth_headers)
        assert response.status_code == 422

    @pytest.mark.asyncio
    async def test_trip_group_with_dates(
        self, client: AsyncClient, test_user, auth_headers
    ):
        response = await client.post("/api/groups", json={
            "name": "Japan Trip",
            "group_type": "trip",
            "target_currency": "JPY",
            "trip_start_date": "2024-03-01",
            "trip_end_date": "2024-03-15",
        }, headers=auth_headers)
        assert response.status_code == 201
        data = response.json()
        assert data["group_type"] == "trip"
        assert data["target_currency"] == "JPY"
        assert data["trip_start_date"] == "2024-03-01"
        assert data["trip_end_date"] == "2024-03-15"
