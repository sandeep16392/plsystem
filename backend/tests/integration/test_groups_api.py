import pytest
from httpx import AsyncClient


class TestGroupCRUD:
    @pytest.mark.asyncio
    async def test_create_group(self, client: AsyncClient, test_user, auth_headers):
        response = await client.post("/api/groups", json={
            "name": "Europe Trip",
            "group_type": "trip",
            "target_currency": "EUR",
            "trip_start_date": "2024-06-01",
            "trip_end_date": "2024-06-15",
        }, headers=auth_headers)
        assert response.status_code == 201
        data = response.json()
        assert data["name"] == "Europe Trip"
        assert data["group_type"] == "trip"
        assert data["target_currency"] == "EUR"
        assert len(data["members"]) == 1
        assert data["members"][0]["role"] == "admin"

    @pytest.mark.asyncio
    async def test_list_groups_returns_only_user_groups(
        self, client: AsyncClient, test_user, test_user2, auth_headers, auth_headers2
    ):
        # User 1 creates group
        await client.post("/api/groups", json={
            "name": "Group A",
        }, headers=auth_headers)
        # User 2 creates group
        await client.post("/api/groups", json={
            "name": "Group B",
        }, headers=auth_headers2)
        # User 1 should only see Group A
        response = await client.get("/api/groups", headers=auth_headers)
        assert response.status_code == 200
        groups = response.json()
        assert all(g["name"] != "Group B" for g in groups)

    @pytest.mark.asyncio
    async def test_get_group_as_member(self, client: AsyncClient, test_user, auth_headers):
        create_resp = await client.post("/api/groups", json={
            "name": "Test Group",
        }, headers=auth_headers)
        group_id = create_resp.json()["id"]
        response = await client.get(f"/api/groups/{group_id}", headers=auth_headers)
        assert response.status_code == 200
        assert response.json()["name"] == "Test Group"

    @pytest.mark.asyncio
    async def test_get_group_as_non_member_forbidden(
        self, client: AsyncClient, test_user, test_user2, auth_headers, auth_headers2
    ):
        create_resp = await client.post("/api/groups", json={
            "name": "Private Group",
        }, headers=auth_headers)
        group_id = create_resp.json()["id"]
        response = await client.get(f"/api/groups/{group_id}", headers=auth_headers2)
        assert response.status_code == 403

    @pytest.mark.asyncio
    async def test_update_group(self, client: AsyncClient, test_user, auth_headers):
        create_resp = await client.post("/api/groups", json={
            "name": "Old Name",
            "target_currency": "USD",
        }, headers=auth_headers)
        group_id = create_resp.json()["id"]
        response = await client.patch(f"/api/groups/{group_id}", json={
            "name": "New Name",
            "target_currency": "EUR",
        }, headers=auth_headers)
        assert response.status_code == 200
        assert response.json()["name"] == "New Name"
        assert response.json()["target_currency"] == "EUR"

    @pytest.mark.asyncio
    async def test_delete_group_as_admin(self, client: AsyncClient, test_user, auth_headers):
        create_resp = await client.post("/api/groups", json={
            "name": "To Delete",
        }, headers=auth_headers)
        group_id = create_resp.json()["id"]
        response = await client.delete(f"/api/groups/{group_id}", headers=auth_headers)
        assert response.status_code == 204

    @pytest.mark.asyncio
    async def test_delete_group_as_non_admin_forbidden(
        self, client: AsyncClient, test_user, test_user2, auth_headers, auth_headers2
    ):
        create_resp = await client.post("/api/groups", json={
            "name": "Admin Only",
        }, headers=auth_headers)
        group_id = create_resp.json()["id"]
        # Add user2 as member
        await client.post(f"/api/groups/{group_id}/members", json={
            "user_id": str(test_user2.id),
        }, headers=auth_headers)
        # User2 tries to delete
        response = await client.delete(f"/api/groups/{group_id}", headers=auth_headers2)
        assert response.status_code == 403


class TestGroupMembers:
    @pytest.mark.asyncio
    async def test_add_member(
        self, client: AsyncClient, test_user, test_user2, auth_headers
    ):
        create_resp = await client.post("/api/groups", json={
            "name": "With Members",
        }, headers=auth_headers)
        group_id = create_resp.json()["id"]
        response = await client.post(f"/api/groups/{group_id}/members", json={
            "user_id": str(test_user2.id),
        }, headers=auth_headers)
        assert response.status_code == 201
        assert response.json()["role"] == "member"

    @pytest.mark.asyncio
    async def test_remove_member(
        self, client: AsyncClient, test_user, test_user2, auth_headers
    ):
        create_resp = await client.post("/api/groups", json={
            "name": "Remove Test",
        }, headers=auth_headers)
        group_id = create_resp.json()["id"]
        await client.post(f"/api/groups/{group_id}/members", json={
            "user_id": str(test_user2.id),
        }, headers=auth_headers)
        response = await client.delete(
            f"/api/groups/{group_id}/members/{test_user2.id}",
            headers=auth_headers,
        )
        assert response.status_code == 204
