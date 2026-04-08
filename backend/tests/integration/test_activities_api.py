import pytest
from httpx import AsyncClient


class TestActivityFeed:
    @pytest.mark.asyncio
    async def test_activity_created_on_group_creation(
        self, client: AsyncClient, test_user, auth_headers
    ):
        await client.post("/api/groups", json={"name": "Activity Group"}, headers=auth_headers)

        response = await client.get("/api/activities", headers=auth_headers)
        assert response.status_code == 200
        activities = response.json()
        assert len(activities) >= 1
        assert any(a["activity_type"] == "group_created" for a in activities)

    @pytest.mark.asyncio
    async def test_activity_created_on_expense_add(
        self, client: AsyncClient, test_user, auth_headers
    ):
        group = await client.post("/api/groups", json={"name": "Expense Activity"}, headers=auth_headers)
        gid = group.json()["id"]

        await client.post(f"/api/groups/{gid}/expenses", json={
            "description": "Test Expense",
            "amount": "42.00",
            "currency": "USD",
        }, headers=auth_headers)

        response = await client.get(f"/api/groups/{gid}/activities", headers=auth_headers)
        assert response.status_code == 200
        activities = response.json()
        expense_activities = [a for a in activities if a["activity_type"] == "expense_created"]
        assert len(expense_activities) >= 1
        assert "42" in expense_activities[0]["description"]

    @pytest.mark.asyncio
    async def test_activity_created_on_member_add(
        self, client: AsyncClient, test_user, test_user2, auth_headers
    ):
        group = await client.post("/api/groups", json={"name": "Member Activity"}, headers=auth_headers)
        gid = group.json()["id"]
        await client.post(f"/api/groups/{gid}/members", json={
            "user_id": str(test_user2.id),
        }, headers=auth_headers)

        response = await client.get(f"/api/groups/{gid}/activities", headers=auth_headers)
        activities = response.json()
        member_activities = [a for a in activities if a["activity_type"] == "member_added"]
        assert len(member_activities) >= 1

    @pytest.mark.asyncio
    async def test_activity_created_on_settlement(
        self, client: AsyncClient, test_user, test_user2, auth_headers
    ):
        group = await client.post("/api/groups", json={"name": "Settle Activity"}, headers=auth_headers)
        gid = group.json()["id"]
        await client.post(f"/api/groups/{gid}/members", json={
            "user_id": str(test_user2.id),
        }, headers=auth_headers)

        await client.post(f"/api/groups/{gid}/settle", json={
            "to_user_id": str(test_user2.id),
            "amount": "25.00",
            "currency": "USD",
        }, headers=auth_headers)

        response = await client.get(f"/api/groups/{gid}/activities", headers=auth_headers)
        activities = response.json()
        settlement_activities = [a for a in activities if a["activity_type"] == "settlement_recorded"]
        assert len(settlement_activities) >= 1

    @pytest.mark.asyncio
    async def test_activity_created_on_expense_delete(
        self, client: AsyncClient, test_user, auth_headers
    ):
        group = await client.post("/api/groups", json={"name": "Delete Activity"}, headers=auth_headers)
        gid = group.json()["id"]

        exp = await client.post(f"/api/groups/{gid}/expenses", json={
            "description": "To Delete",
            "amount": "10.00",
            "currency": "USD",
        }, headers=auth_headers)
        eid = exp.json()["id"]

        await client.delete(f"/api/expenses/{eid}", headers=auth_headers)

        response = await client.get(f"/api/groups/{gid}/activities", headers=auth_headers)
        activities = response.json()
        delete_activities = [a for a in activities if a["activity_type"] == "expense_deleted"]
        assert len(delete_activities) >= 1

    @pytest.mark.asyncio
    async def test_activity_feed_paginated(
        self, client: AsyncClient, test_user, auth_headers
    ):
        # Create multiple groups to generate activities
        for i in range(5):
            await client.post("/api/groups", json={"name": f"Group {i}"}, headers=auth_headers)

        response = await client.get("/api/activities?limit=3&offset=0", headers=auth_headers)
        assert response.status_code == 200
        assert len(response.json()) == 3

        response2 = await client.get("/api/activities?limit=3&offset=3", headers=auth_headers)
        assert response2.status_code == 200
        assert len(response2.json()) >= 1

    @pytest.mark.asyncio
    async def test_group_activities_scoped(
        self, client: AsyncClient, test_user, auth_headers
    ):
        # Create 2 groups, add expense to each
        g1 = await client.post("/api/groups", json={"name": "Group A"}, headers=auth_headers)
        g2 = await client.post("/api/groups", json={"name": "Group B"}, headers=auth_headers)
        gid1, gid2 = g1.json()["id"], g2.json()["id"]

        await client.post(f"/api/groups/{gid1}/expenses", json={
            "description": "Expense A",
            "amount": "10.00",
            "currency": "USD",
        }, headers=auth_headers)
        await client.post(f"/api/groups/{gid2}/expenses", json={
            "description": "Expense B",
            "amount": "20.00",
            "currency": "USD",
        }, headers=auth_headers)

        # Group A activities should not include Group B's expense
        response = await client.get(f"/api/groups/{gid1}/activities", headers=auth_headers)
        activities = response.json()
        for a in activities:
            if a["group_id"] is not None:
                assert a["group_id"] == gid1

    @pytest.mark.asyncio
    async def test_non_member_cannot_view_group_activities(
        self, client: AsyncClient, test_user, test_user2, auth_headers, auth_headers2
    ):
        group = await client.post("/api/groups", json={"name": "Private Act"}, headers=auth_headers)
        gid = group.json()["id"]

        response = await client.get(f"/api/groups/{gid}/activities", headers=auth_headers2)
        assert response.status_code == 403

    @pytest.mark.asyncio
    async def test_activities_ordered_most_recent_first(
        self, client: AsyncClient, test_user, auth_headers
    ):
        group = await client.post("/api/groups", json={"name": "Order Test"}, headers=auth_headers)
        gid = group.json()["id"]

        await client.post(f"/api/groups/{gid}/expenses", json={
            "description": "First",
            "amount": "10.00",
            "currency": "USD",
        }, headers=auth_headers)
        await client.post(f"/api/groups/{gid}/expenses", json={
            "description": "Second",
            "amount": "20.00",
            "currency": "USD",
        }, headers=auth_headers)

        response = await client.get(f"/api/groups/{gid}/activities", headers=auth_headers)
        activities = response.json()
        # Most recent should be first
        if len(activities) >= 2:
            assert activities[0]["created_at"] >= activities[1]["created_at"]
