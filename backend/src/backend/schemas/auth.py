from pydantic import BaseModel

from backend.schemas.user import UserBase

class RegisterRequest(UserBase):
    password: str

class LoginRequest(BaseModel):
    login: str
    password: str