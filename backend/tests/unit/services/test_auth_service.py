from datetime import datetime, timedelta, timezone

import pytest

from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
)


class TestPasswordHashing:
    def test_hash_and_verify_correct(self):
        password = "securePassword123"
        hashed = hash_password(password)
        assert verify_password(password, hashed) is True

    def test_verify_wrong_password(self):
        hashed = hash_password("correct_password")
        assert verify_password("wrong_password", hashed) is False

    def test_hash_is_different_each_time(self):
        password = "samePassword"
        hash1 = hash_password(password)
        hash2 = hash_password(password)
        assert hash1 != hash2  # bcrypt uses random salt


class TestJWT:
    def test_create_and_decode_access_token(self):
        data = {"sub": "user-123"}
        token = create_access_token(data)
        payload = decode_token(token)
        assert payload is not None
        assert payload["sub"] == "user-123"
        assert payload["type"] == "access"

    def test_create_and_decode_refresh_token(self):
        data = {"sub": "user-456"}
        token = create_refresh_token(data)
        payload = decode_token(token)
        assert payload is not None
        assert payload["sub"] == "user-456"
        assert payload["type"] == "refresh"

    def test_access_token_has_expiry(self):
        token = create_access_token({"sub": "user-789"})
        payload = decode_token(token)
        assert "exp" in payload

    def test_decode_invalid_token_returns_none(self):
        result = decode_token("this.is.not.a.valid.token")
        assert result is None

    def test_decode_tampered_token_returns_none(self):
        token = create_access_token({"sub": "user-123"})
        tampered = token[:-5] + "XXXXX"
        result = decode_token(tampered)
        assert result is None
