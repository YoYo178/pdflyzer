from datetime import datetime

from backend.models.base import BaseTimestampDocument
from backend.schemas.user import UserBase


class User(UserBase, BaseTimestampDocument):
    password_hash: str
    
    is_verified: bool = False
    verified_at: datetime | None = None

    class Settings:
        name = 'users'
