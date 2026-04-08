import pytest
from httpx import AsyncClient


class TestRegister:
    @pytest.mark.asyncio
    async def test_register_success(self, client: AsyncClient):
        response = await client.post("/api/auth/register", json={
            "username": "newuser",
            "email": "new@example.com",
            "password": "password123",
            "display_name": "New User",
        })
        assert response.status_code == 201
        data = response.json()
        assert "access_token" in data
        assert "refresh_token" in data
        assert data["user"]["username"] == "newuser"
        assert data["user"]["email"] == "new@example.com"

    @pytest.mark.asyncio
    async def test_register_duplicate_username(self, client: AsyncClient, test_user):
        response = await client.post("/api/auth/register", json={
            "username": "testuser",
            "email": "different@example.com",
            "password": "password123",
            "display_name": "Another User",
        })
        assert response.status_code == 409

    @pytest.mark.asyncio
    async def test_register_duplicate_email(self, client: AsyncClient, test_user):
        response = await client.post("/api/auth/register", json={
            "username": "differentuser",
            "email": "test@example.com",
            "password": "password123",
            "display_name": "Another User",
        })
        assert response.status_code == 409

    @pytest.mark.asyncio
    async def test_register_invalid_username(self, client: AsyncClient):
        response = await client.post("/api/auth/register", json={
            "username": "ab",  # Too short
            "email": "short@example.com",
            "password": "password123",
            "display_name": "Short",
        })
        assert response.status_code == 422


class TestLogin:
    @pytest.mark.asyncio
    async def test_login_success(self, client: AsyncClient, test_user):
        response = await client.post("/api/auth/login", json={
            "username": "testuser",
            "password": "password123",
        })
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert "refresh_token" in data

    @pytest.mark.asyncio
    async def test_login_invalid_password(self, client: AsyncClient, test_user):
        response = await client.post("/api/auth/login", json={
            "username": "testuser",
            "password": "wrongpassword",
        })
        assert response.status_code == 401

    @pytest.mark.asyncio
    async def test_login_nonexistent_user(self, client: AsyncClient):
        response = await client.post("/api/auth/login", json={
            "username": "nosuchuser",
            "password": "password123",
        })
        assert response.status_code == 401


class TestProtectedEndpoints:
    @pytest.mark.asyncio
    async def test_no_token_returns_403(self, client: AsyncClient):
        response = await client.get("/api/users/me")
        assert response.status_code == 403

    @pytest.mark.asyncio
    async def test_invalid_token_returns_401(self, client: AsyncClient):
        response = await client.get(
            "/api/users/me",
            headers={"Authorization": "Bearer invalid.token.here"},
        )
        assert response.status_code == 401

    @pytest.mark.asyncio
    async def test_valid_token_returns_user(self, client: AsyncClient, test_user, auth_headers):
        response = await client.get("/api/users/me", headers=auth_headers)
        assert response.status_code == 200
        assert response.json()["username"] == "testuser"
