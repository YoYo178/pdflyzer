from datetime import UTC, datetime, timedelta

import jwt

from backend.settings import settings


def generate_access_token(subject: str, expires_delta: timedelta | None = None):
    expire = datetime.now(UTC) + (
        expires_delta or timedelta(minutes=15)
    )

    payload = {
        "sub": subject,
        "exp": expire,
        "iat": datetime.now(UTC),
        "type": "access"
    }

    return jwt.encode(
        payload,
        settings.access_token_secret,
        algorithm="HS256"
    )

def generate_refresh_token(subject: str, expires_delta: timedelta | None = None):
    expire = datetime.now(UTC) + (
        expires_delta or timedelta(days=30)
    )

    payload = {
        "sub": subject,
        "exp": expire,
        "iat": datetime.now(UTC),
        "type": "refresh"
    }

    return jwt.encode(
        payload,
        settings.refresh_token_secret,
        algorithm="HS256"
    )

def decode_access_token(token: str):
    return jwt.decode(
        jwt=token,
        key=settings.access_token_secret,
        algorithms=["HS256"]
    )

def decode_refresh_token(token: str):
    return jwt.decode(
        jwt=token,
        key=settings.refresh_token_secret,
        algorithms=["HS256"]
    )
