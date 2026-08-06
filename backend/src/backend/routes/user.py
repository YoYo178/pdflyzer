from beanie import PydanticObjectId
from fastapi import APIRouter, status, Depends

from backend.dependencies.auth import get_current_user
from backend.models.user import User

from backend.dependencies.services import get_user_service
from backend.schemas.user import UserUpdate, UserSelf, UserPublic
from backend.services.user import UserService

# Create Router
router = APIRouter(prefix="/users", tags=["Users"])

# Get self user
@router.get("/me", response_model=UserSelf)
async def get_me(
    current_user: User = Depends(get_current_user)
):
    return current_user

# Get all users
@router.get("/", response_model=list[UserPublic])
async def get_users(service: UserService = Depends(get_user_service)):
    return await service.get_users()

# Get User by ID
@router.get("/{user_id}", response_model=UserPublic)
async def get_user(user_id: PydanticObjectId, service: UserService = Depends(get_user_service)):
    return await service.get_user(user_id)

# Update an existing user
@router.patch("/{user_id}", response_model=UserSelf)
async def update_user(
    user_id: PydanticObjectId,
    user_data: UserUpdate,
    service: UserService = Depends(get_user_service),
    current_user: User = Depends(get_current_user)
):
    return await service.update_user(current_user.id, user_data)

# Delete a User
@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    user_id: PydanticObjectId,
    service: UserService = Depends(get_user_service),
    current_user: User = Depends(get_current_user)
):
    return await service.delete_user(current_user.id)