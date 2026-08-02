from beanie import PydanticObjectId

import backend.services.user as user_service
from backend.schemas.user import UserCreate, UserUpdate

async def get_users():
    return await user_service.get_users()

async def get_user(user_id: PydanticObjectId):
    return await user_service.get_user(user_id)

async def create_user(user_data: UserCreate):
    return await user_service.create_user(user_data)

async def update_user(user_id: PydanticObjectId, user_data: UserUpdate):
    return await user_service.update_user(user_id, user_data)

async def delete_user(user_id: PydanticObjectId):
    return await user_service.delete_user(user_id)