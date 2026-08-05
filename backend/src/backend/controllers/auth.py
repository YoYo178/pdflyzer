import backend.services.auth as auth_service
from backend.schemas.auth import RegisterRequest, LoginRequest

async def handle_create_user(register_data: RegisterRequest):
    return await auth_service.create_user(register_data)

async def handle_login(login_data: LoginRequest):
    return await auth_service.handle_login(login_data)