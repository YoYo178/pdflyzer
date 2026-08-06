from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer

from beanie import PydanticObjectId
from jwt.exceptions import ExpiredSignatureError

from backend.models.user import User

import backend.exceptions.auth as auth_exceptions

from backend.dependencies.repositories import get_user_repository
from backend.repositories.user import UserRepository
from backend.utils.jwt import decode_access_token

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/auth/login"
)

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    repo: UserRepository = Depends(get_user_repository)
) -> User:
    try:
        payload = decode_access_token(token)

        user_id = payload.get("sub")

        if not user_id:
            raise auth_exceptions.UnauthorizedUser()

        user = await repo.find_by_id(PydanticObjectId(user_id))

        if not user:
            raise auth_exceptions.UnauthorizedUser()

        return user
    except ExpiredSignatureError:
        raise auth_exceptions.UnauthorizedUser()