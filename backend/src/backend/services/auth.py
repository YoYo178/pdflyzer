from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError

import backend.exceptions.auth as auth_exceptions
import backend.exceptions.user as user_exceptions

from backend.models.user import User
from backend.schemas.auth import RegisterRequest, LoginRequest

ph = PasswordHasher()

async def create_user(register_data: RegisterRequest):
    email_exists = await User.find_one({ "email": register_data.email })

    if email_exists:
        raise auth_exceptions.EmailExists()

    username_exists = await User.find_one({ "username": register_data.username })

    if(username_exists):
        raise auth_exceptions.UsernameExists()

    password_hash = ph.hash(register_data.password)

    user = User(
        name=register_data.name,
        email=register_data.email,
        username=register_data.username,
        password_hash=password_hash
    )

    await user.save()

    return user

async def handle_login(login_data: LoginRequest):
    method = "email" if "@" in login_data.login else "username"
    user = await User.find_one({ method: login_data.login })

    if not user:
        raise user_exceptions.UserNotFound()

    try:
        hash_matches = ph.verify(user.password_hash, login_data.password)
    except VerifyMismatchError:
        raise auth_exceptions.InvalidLogin()