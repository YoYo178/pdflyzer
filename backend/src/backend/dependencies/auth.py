from beanie import PydanticObjectId
from fastapi import Depends, Request, Response, WebSocket
from jwt.exceptions import ExpiredSignatureError

from backend.dependencies.repositories import get_user_repository
import backend.exceptions.auth as auth_exceptions
from backend.models.user import User
from backend.repositories.user import UserRepository
from backend.utils.jwt import (
    decode_access_token,
    decode_refresh_token,
    generate_access_token,
)


async def verify_refresh_token(refresh_token: str, repo: UserRepository) -> User:
    try:
        payload = decode_refresh_token(refresh_token)

        user_id = payload.get('sub')

        if not user_id:
            raise auth_exceptions.UnauthorizedUser()

        user = await repo.find_by_id(PydanticObjectId(user_id))

        if not user:
            raise auth_exceptions.UnauthorizedUser()

        return user
    except ExpiredSignatureError as err:
        raise auth_exceptions.UnauthorizedUser() from err


async def issue_new_access_token(
    refresh_token: str, repo: UserRepository, response: Response
):
    user = await verify_refresh_token(refresh_token, repo)

    access_token = generate_access_token(str(user.id))

    response.set_cookie(
        key='access_token',
        value=access_token,
        httponly=True,
        secure=False,
        max_age=60 * 15,  # 15 Minutes
        samesite='lax',
    )

    return user


async def verify_access_token(
    access_token: str | None,
    refresh_token: str,
    repo: UserRepository,
    response: Response | None,
    isWebSocket: bool = False,
) -> User:
    try:
        if not access_token and response is not None:
            return await issue_new_access_token(refresh_token, repo, response)

        if not access_token:
            raise auth_exceptions.UnauthorizedUser()

        payload = decode_access_token(access_token)

        user_id = payload.get('sub')

        if not user_id:
            raise auth_exceptions.UnauthorizedUser()

        user = await repo.find_by_id(PydanticObjectId(user_id))

        if not user:
            raise auth_exceptions.UnauthorizedUser()

        return user
    except ExpiredSignatureError as err:
        # WebSocket cannot set cookies
        if not isWebSocket and response is not None:
            return await issue_new_access_token(refresh_token, repo, response)

        raise auth_exceptions.UnauthorizedUser() from err


async def get_current_user(
    request: Request,
    response: Response,
    repo: UserRepository = Depends(get_user_repository),
) -> User:
    access_token = request.cookies.get('access_token')
    refresh_token = request.cookies.get('refresh_token')

    if not refresh_token:
        raise auth_exceptions.UnauthorizedUser()

    return await verify_access_token(access_token, refresh_token, repo, response)


async def get_current_websocket_user(
    websocket: WebSocket, repo: UserRepository = Depends(get_user_repository)
) -> User:
    access_token = websocket.cookies.get('access_token')
    refresh_token = websocket.cookies.get('refresh_token')

    if not refresh_token:
        raise auth_exceptions.UnauthorizedUser()

    return await verify_access_token(access_token, refresh_token, repo, None, True)
