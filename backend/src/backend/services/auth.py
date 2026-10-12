from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError

import backend.exceptions.auth as auth_exceptions
from backend.models.user import User
from backend.repositories.user import UserRepository
from backend.schemas.auth import LoginRequest, RegisterRequest, TokensData
from backend.utils.jwt import generate_access_token, generate_refresh_token


class AuthService:
    def __init__(self, user_repository: UserRepository, hasher: PasswordHasher):
        self.hasher = hasher
        self.user_repository = user_repository

    async def create_user(self, register_data: RegisterRequest) -> User:
        email_exists = await self.user_repository.find_by_email(register_data.email)

        if email_exists:
            raise auth_exceptions.EmailExists()

        username_exists = await self.user_repository.find_by_username(
            register_data.username
        )

        if username_exists:
            raise auth_exceptions.UsernameExists()

        password_hash = self.hasher.hash(register_data.password)

        user = User(
            name=register_data.name,
            email=register_data.email,
            username=register_data.username,
            password_hash=password_hash,
        )

        return await self.user_repository.create(user)

    async def handle_login(self, login_data: LoginRequest) -> TokensData:

        if '@' in login_data.login:
            user = await self.user_repository.find_by_email(login_data.login)
        else:
            user = await self.user_repository.find_by_username(login_data.login)

        if not user:
            raise auth_exceptions.InvalidLogin()

        try:
            self.hasher.verify(user.password_hash, login_data.password)

            access_token = generate_access_token(str(user.id))
            refresh_token = generate_refresh_token(str(user.id))

            return TokensData(
                access_token=access_token,
                refresh_token=refresh_token,
            )
        except VerifyMismatchError as err:
            raise auth_exceptions.InvalidLogin() from err
