import hashlib
import hmac
import json
import base64
import time
from datetime import datetime, timedelta, timezone

from passlib.context import CryptContext

from app.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def _b64_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode()


def _b64_decode(data: str) -> bytes:
    padding = 4 - len(data) % 4
    if padding != 4:
        data += "=" * padding
    return base64.urlsafe_b64decode(data)


def _sign(header_payload: str) -> str:
    sig = hmac.new(
        settings.jwt_secret_key.encode(),
        header_payload.encode(),
        hashlib.sha256,
    ).digest()
    return _b64_encode(sig)


def _encode_jwt(payload: dict) -> str:
    header = {"alg": "HS256", "typ": "JWT"}
    header_b64 = _b64_encode(json.dumps(header, separators=(",", ":")).encode())
    # Convert datetime to timestamp
    encoded_payload = {}
    for k, v in payload.items():
        if isinstance(v, datetime):
            encoded_payload[k] = int(v.timestamp())
        else:
            encoded_payload[k] = v
    payload_b64 = _b64_encode(json.dumps(encoded_payload, separators=(",", ":")).encode())
    header_payload = f"{header_b64}.{payload_b64}"
    signature = _sign(header_payload)
    return f"{header_payload}.{signature}"


def _decode_jwt(token: str) -> dict | None:
    try:
        parts = token.split(".")
        if len(parts) != 3:
            return None
        header_payload = f"{parts[0]}.{parts[1]}"
        expected_sig = _sign(header_payload)
        if not hmac.compare_digest(expected_sig, parts[2]):
            return None
        payload_json = _b64_decode(parts[1])
        payload = json.loads(payload_json)
        # Check expiry
        if "exp" in payload:
            if time.time() > payload["exp"]:
                return None
        return payload
    except Exception:
        return None


def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.access_token_expire_minutes)
    to_encode.update({"exp": expire, "type": "access"})
    return _encode_jwt(to_encode)


def create_refresh_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(days=settings.refresh_token_expire_days)
    to_encode.update({"exp": expire, "type": "refresh"})
    return _encode_jwt(to_encode)


def decode_token(token: str) -> dict | None:
    return _decode_jwt(token)
