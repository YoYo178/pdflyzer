from fastapi import APIRouter, Depends, Response

from backend.services.auth import AuthService, get_auth_service
from backend.schemas.user import UserSelf
from backend.schemas.auth import RegisterRequest, LoginRequest

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register", response_model=UserSelf)
async def create_user(
    register_data: RegisterRequest,
    service: AuthService = Depends(get_auth_service)
):
    return await service.create_user(register_data)

@router.post("/login", status_code=200)
async def handle_login(
    login_data: LoginRequest,
    response: Response,
    service: AuthService = Depends(get_auth_service),
):
    tokens_data = await service.handle_login(login_data)

    response.set_cookie(
        key="refresh_token",
        value=tokens_data.refresh_token,
        httponly=True,
        secure=False,
        samesite="none",
        max_age=60 * 60 * 24 * 30
    )

    return {
        "message": "Logged in successfully!",
        "data": {
            "access_token": tokens_data.access_token
        }
    }