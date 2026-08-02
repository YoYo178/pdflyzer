from beanie import Document

from backend.schemas.user import UserBase

class User(UserBase, Document):
    password_hash: str

    class Settings:
        name = "users"
