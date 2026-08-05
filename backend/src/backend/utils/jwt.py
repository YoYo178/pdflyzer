from datetime import datetime, timezone, timedelta
import jwt

from backend.settings import settings

def generate_access_token(subject: str, expires_delta: timedelta | None = None):
    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(minutes=15)
    )

    payload = {
        "sub": subject,
        "exp": expire,
        "iat": datetime.now(timezone.utc),
        "type": "access"
    }

    return jwt.encode(
        payload,
        settings.access_token_secret,
        algorithm="HS256"
    )

def generate_refresh_token(subject: str, expires_delta: timedelta | None = None):
    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(days=30)
    )

    payload = {
        "sub": subject,
        "exp": expire,
        "iat": datetime.now(timezone.utc),
        "type": "refresh"
    }

    return jwt.encode(
        payload,
        settings.refresh_token_secret,
        algorithm="HS256"
    )