from fastapi import APIRouter, Depends, Response, status

from backend.dependencies.auth import get_current_user
from backend.dependencies.services import get_auth_service
from backend.schemas.api import APIResponse
from backend.schemas.auth import LoginRequest, RegisterRequest
from backend.schemas.user import UserSelf
from backend.services.auth import AuthService

router = APIRouter(prefix='/auth', tags=['Auth'])


@router.post('/register', response_model=APIResponse[UserSelf])
async def create_user(
    register_data: RegisterRequest,
    response: Response,
    service: AuthService = Depends(get_auth_service),
):
    user = await service.create_user(register_data)

    tokens_data = await service.handle_login(
        LoginRequest(login=user.email, password=register_data.password)
    )

    response.set_cookie(
        key='refresh_token',
        value=tokens_data.refresh_token,
        httponly=True,
        secure=False,
        samesite='lax',
        max_age=60 * 60 * 24 * 30,  # 30 Days
    )

    response.set_cookie(
        key='access_token',
        value=tokens_data.access_token,
        httponly=True,
        secure=False,
        samesite='lax',
        max_age=60 * 15,  # 15 Minutes
    )

    return APIResponse(
        status=True,
        message='User created sucessfully',
        data=UserSelf.model_validate_json(user.model_dump_json()),
    )


@router.post('/login', status_code=200, response_model=APIResponse[None])
async def handle_login(
    login_data: LoginRequest,
    response: Response,
    service: AuthService = Depends(get_auth_service),
):
    tokens_data = await service.handle_login(login_data)

    response.set_cookie(
        key='refresh_token',
        value=tokens_data.refresh_token,
        httponly=True,
        secure=False,
        samesite='lax',
        max_age=60 * 60 * 24 * 30,  # 30 Days
    )

    response.set_cookie(
        key='access_token',
        value=tokens_data.access_token,
        httponly=True,
        secure=False,
        max_age=60 * 15,  # 15 Minutes
        samesite='lax',
    )

    return APIResponse(status=True, message='Logged in successfully!', data=None)


@router.post(
    path='/logout',
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(get_current_user)],
)
def handle_logout(
    res: Response,
):
    res.delete_cookie('access_token')
    res.delete_cookie('refresh_token')
