from fastapi import APIRouter, Depends, Response, status

from backend.dependencies.auth import get_current_user
from backend.dependencies.services import get_auth_service
from backend.schemas.api import APIResponse
from backend.schemas.auth import LoginRequest, RegisterRequest, EmailVerificationRequest
from backend.schemas.user import UserSelf
from backend.services.auth import AuthService

router = APIRouter(prefix='/auth', tags=['Auth'])


@router.post('/register')
async def create_user(
    register_data: RegisterRequest,
    service: AuthService = Depends(get_auth_service),
):
    user_id = await service.create_user(register_data)

    return APIResponse(
        status=True,
        message='User successfully registered, Please verify email to continue',
        data={
            'user_id': str(user_id)
        },
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

@router.post('/verify-email')
async def verify_email(
    response: Response,
    verification_data: EmailVerificationRequest,
    service: AuthService = Depends(get_auth_service),
):
    verified_data = await service.verify_email(verification_data)

    response.set_cookie(
        key='refresh_token',
        value=verified_data.tokens.refresh_token,
        httponly=True,
        secure=False,
        samesite='lax',
        max_age=60 * 60 * 24 * 30,  # 30 Days
    )

    response.set_cookie(
        key='access_token',
        value=verified_data.tokens.access_token,
        httponly=True,
        secure=False,
        samesite='lax',
        max_age=60 * 15,  # 15 Minutes
    )
    
    return APIResponse(
        status=True,
        message='User verified successfully',
        data={
            'user': UserSelf.model_validate_json(verified_data.user.model_dump_json())
        }
    )