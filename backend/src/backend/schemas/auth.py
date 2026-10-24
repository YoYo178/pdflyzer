from typing import Literal
from beanie import PydanticObjectId
from pydantic import BaseModel

from backend.schemas.user import UserBase


class RegisterRequest(UserBase):
    password: str


class LoginRequest(BaseModel):
    login: str
    password: str


class AccessTokenPayload(BaseModel):
    sub: PydanticObjectId
    exp: int
    iat: int


class TokensData(BaseModel):
    access_token: str
    refresh_token: str


class EmailVerificationRequest(BaseModel):
    user_id: PydanticObjectId
    method: Literal['token', 'code']
    data: str

class ResendVerificationRequest(BaseModel):
    user_id: PydanticObjectId