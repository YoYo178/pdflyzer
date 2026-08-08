from beanie import PydanticObjectId
from fastapi import APIRouter, status, Depends

from backend.dependencies.auth import get_current_user
from backend.models.user import User

from backend.dependencies.services import get_user_service
from backend.schemas.user import UserUpdate, UserSelf
from backend.services.user import UserService

# Create Router
router = APIRouter(prefix="/users", tags=["Users"])

# Get self user
@router.get("/me", response_model=UserSelf)
async def get_me(
    current_user: User = Depends(get_current_user)
):
    return current_user

# Update self user
@router.patch("/me", response_model=UserSelf)
async def update_user(
    user_data: UserUpdate,
    service: UserService = Depends(get_user_service),
    current_user: User = Depends(get_current_user)
):
    return await service.update_user(PydanticObjectId(current_user.id), user_data)

# Delete self User
@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    service: UserService = Depends(get_user_service),
    current_user: User = Depends(get_current_user)
):
    return await service.delete_user(PydanticObjectId(current_user.id))