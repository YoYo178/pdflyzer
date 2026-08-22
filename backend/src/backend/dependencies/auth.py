from fastapi import Request
from fastapi import Depends

from beanie import PydanticObjectId
from jwt.exceptions import ExpiredSignatureError

from backend.models.user import User

import backend.exceptions.auth as auth_exceptions

from backend.dependencies.repositories import get_user_repository
from backend.repositories.user import UserRepository
from backend.utils.jwt import decode_access_token

async def get_current_user(
    request: Request,
    repo: UserRepository = Depends(get_user_repository)
) -> User:
    try:
        access_token = request.cookies.get("access_token")
        
        if not access_token:
            raise auth_exceptions.UnauthorizedUser()
        
        payload = decode_access_token(access_token)

        user_id = payload.get("sub")

        if not user_id:
            raise auth_exceptions.UnauthorizedUser()

        user = await repo.find_by_id(PydanticObjectId(user_id))

        if not user:
            raise auth_exceptions.UnauthorizedUser()

        return user
    except ExpiredSignatureError:
        raise auth_exceptions.UnauthorizedUser()