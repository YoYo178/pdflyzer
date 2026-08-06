from fastapi import Depends
from argon2 import PasswordHasher

from backend.services.auth import AuthService
from backend.services.user import UserService

from backend.repositories.user import UserRepository

from backend.dependencies.repositories import get_user_repository
from backend.dependencies.providers import get_password_hasher

def get_auth_service(
    user_repository: UserRepository = Depends(get_user_repository),
    password_hasher: PasswordHasher = Depends(get_password_hasher)
) -> AuthService:
    return AuthService(
        user_repository=user_repository,
        hasher=password_hasher
    )

def get_user_service(
    user_repository: UserRepository = Depends(get_user_repository)
) -> UserService:
    return UserService(user_repository)