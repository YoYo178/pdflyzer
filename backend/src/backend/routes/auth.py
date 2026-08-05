from fastapi import APIRouter

import backend.controllers.auth as auth_controller

from backend.schemas.user import UserSelf
from backend.schemas.auth import RegisterRequest, LoginRequest

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register", response_model=UserSelf)
async def create_user(register_data: RegisterRequest):
    return await auth_controller.handle_create_user(register_data)

@router.post("/login", status_code=200)
async def handle_login(login_data: LoginRequest):
    return await auth_controller.handle_login(login_data)