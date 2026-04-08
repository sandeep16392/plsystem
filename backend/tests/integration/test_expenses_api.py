import uuid
from decimal import Decimal

import pytest
from httpx import AsyncClient


class TestExpenseCRUD:
    @pytest.mark.asyncio
    async def test_create_expense_equal_split(
        self, client: AsyncClient, test_user, test_user2, auth_headers
    ):
        # Create group with 2 members
        group_resp = await client.post("/api/groups", json={
            "name": "Expense Test Group",
        }, headers=auth_headers)
        group_id = group_resp.json()["id"]
        await client.post(f"/api/groups/{group_id}/members", json={
            "user_id": str(test_user2.id),
        }, headers=auth_headers)

        # Add expense
        response = await client.post(f"/api/groups/{group_id}/expenses", json={
            "description": "Dinner",
            "amount": "100.00",
            "currency": "USD",
            "split_method": "equal",
        }, headers=auth_headers)
        assert response.status_code == 201
        data = response.json()
        assert data["description"] == "Dinner"
        assert Decimal(data["amount"]) == Decimal("100.00")
        assert len(data["splits"]) == 2
        split_total = sum(Decimal(s["owed_amount"]) for s in data["splits"])
        assert split_total == Decimal("100.00")

    @pytest.mark.asyncio
    async def test_create_expense_exact_split(
        self, client: AsyncClient, test_user, test_user2, auth_headers
    ):
        group_resp = await client.post("/api/groups", json={
            "name": "Exact Split Group",
        }, headers=auth_headers)
        group_id = group_resp.json()["id"]
        await client.post(f"/api/groups/{group_id}/members", json={
            "user_id": str(test_user2.id),
        }, headers=auth_headers)

        response = await client.post(f"/api/groups/{group_id}/expenses", json={
            "description": "Taxi",
            "amount": "75.00",
            "currency": "EUR",
            "split_method": "exact",
            "splits": [
                {"user_id": str(test_user.id), "owed_amount": "50.00"},
                {"user_id": str(test_user2.id), "owed_amount": "25.00"},
            ],
        }, headers=auth_headers)
        assert response.status_code == 201
        splits = response.json()["splits"]
        assert len(splits) == 2

    @pytest.mark.asyncio
    async def test_create_expense_percentage_split(
        self, client: AsyncClient, test_user, test_user2, auth_headers
    ):
        group_resp = await client.post("/api/groups", json={
            "name": "Percentage Group",
        }, headers=auth_headers)
        group_id = group_resp.json()["id"]
        await client.post(f"/api/groups/{group_id}/members", json={
            "user_id": str(test_user2.id),
        }, headers=auth_headers)

        response = await client.post(f"/api/groups/{group_id}/expenses", json={
            "description": "Hotel",
            "amount": "200.00",
            "currency": "USD",
            "split_method": "percentage",
            "splits": [
                {"user_id": str(test_user.id), "percentage": "60.00"},
                {"user_id": str(test_user2.id), "percentage": "40.00"},
            ],
        }, headers=auth_headers)
        assert response.status_code == 201

    @pytest.mark.asyncio
    async def test_list_expenses_paginated(
        self, client: AsyncClient, test_user, auth_headers
    ):
        group_resp = await client.post("/api/groups", json={
            "name": "Paginated Group",
        }, headers=auth_headers)
        group_id = group_resp.json()["id"]

        # Add 3 expenses
        for i in range(3):
            await client.post(f"/api/groups/{group_id}/expenses", json={
                "description": f"Expense {i}",
                "amount": "10.00",
                "currency": "USD",
            }, headers=auth_headers)

        response = await client.get(
            f"/api/groups/{group_id}/expenses?limit=2&offset=0",
            headers=auth_headers,
        )
        assert response.status_code == 200
        assert len(response.json()) == 2

    @pytest.mark.asyncio
    async def test_get_expense_detail(
        self, client: AsyncClient, test_user, auth_headers
    ):
        group_resp = await client.post("/api/groups", json={
            "name": "Detail Group",
        }, headers=auth_headers)
        group_id = group_resp.json()["id"]

        exp_resp = await client.post(f"/api/groups/{group_id}/expenses", json={
            "description": "Coffee",
            "amount": "5.50",
            "currency": "USD",
        }, headers=auth_headers)
        expense_id = exp_resp.json()["id"]

        response = await client.get(f"/api/expenses/{expense_id}", headers=auth_headers)
        assert response.status_code == 200
        assert response.json()["description"] == "Coffee"

    @pytest.mark.asyncio
    async def test_delete_expense(
        self, client: AsyncClient, test_user, auth_headers
    ):
        group_resp = await client.post("/api/groups", json={
            "name": "Delete Group",
        }, headers=auth_headers)
        group_id = group_resp.json()["id"]

        exp_resp = await client.post(f"/api/groups/{group_id}/expenses", json={
            "description": "To Delete",
            "amount": "10.00",
            "currency": "USD",
        }, headers=auth_headers)
        expense_id = exp_resp.json()["id"]

        response = await client.delete(f"/api/expenses/{expense_id}", headers=auth_headers)
        assert response.status_code == 204

    @pytest.mark.asyncio
    async def test_non_member_cannot_add_expense(
        self, client: AsyncClient, test_user, test_user2, auth_headers, auth_headers2
    ):
        group_resp = await client.post("/api/groups", json={
            "name": "Members Only",
        }, headers=auth_headers)
        group_id = group_resp.json()["id"]

        response = await client.post(f"/api/groups/{group_id}/expenses", json={
            "description": "Unauthorized",
            "amount": "10.00",
            "currency": "USD",
        }, headers=auth_headers2)
        assert response.status_code == 403
