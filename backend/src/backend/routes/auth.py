from fastapi import APIRouter, Depends

from backend.services.auth import AuthService
from backend.schemas.user import UserSelf
from backend.schemas.auth import RegisterRequest, LoginRequest

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register", response_model=UserSelf)
async def create_user(register_data: RegisterRequest, service: AuthService = Depends()):
    return await service.create_user(register_data)

@router.post("/login", status_code=200)
async def handle_login(login_data: LoginRequest, service: AuthService = Depends()):
    return await service.handle_login(login_data)