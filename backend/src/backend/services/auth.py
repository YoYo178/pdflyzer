from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError

import backend.exceptions.auth as auth_exceptions
import backend.exceptions.user as user_exceptions

from backend.models.user import User
from backend.schemas.auth import RegisterRequest, LoginRequest, TokensData

from backend.utils.jwt import generate_access_token, generate_refresh_token
class AuthService:
    def __init__(self):
        self.hasher = PasswordHasher()

    async def create_user(self, register_data: RegisterRequest):
        email_exists = await User.find_one({ "email": register_data.email })

        if email_exists:
            raise auth_exceptions.EmailExists()

        username_exists = await User.find_one({ "username": register_data.username })

        if(username_exists):
            raise auth_exceptions.UsernameExists()

        password_hash = self.hasher.hash(register_data.password)

        user = User(
            name=register_data.name,
            email=register_data.email,
            username=register_data.username,
            password_hash=password_hash
        )

        await user.save()

        return user

    async def handle_login(self, login_data: LoginRequest):
        method = "email" if "@" in login_data.login else "username"
        user = await User.find_one({ method: login_data.login })

        if not user:
            raise user_exceptions.UserNotFound()

        try:
            self.hasher.verify(user.password_hash, login_data.password)

            access_token = generate_access_token(str(user.id))
            refresh_token = generate_refresh_token(str(user.id))

            return TokensData(
                access_token=access_token,
                refresh_token=refresh_token,
            )
        except VerifyMismatchError:
            raise auth_exceptions.InvalidLogin()

def get_auth_service():
    return AuthService()