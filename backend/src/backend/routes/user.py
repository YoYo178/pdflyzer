from beanie import PydanticObjectId
from fastapi import APIRouter, status, Depends

from backend.schemas.user import UserCreate, UserUpdate, UserSelf, UserPublic
from backend.services.user import UserService

# Create Router
router = APIRouter(prefix="/users", tags=["Users"])

# TODO: Authentication dependency, The logged in user must see their own user object
# Get self user
@router.get("/me", response_model=UserSelf)
async def get_me():
    return {}

# Get all users
@router.get("/", response_model=list[UserPublic])
async def get_users(service: UserService = Depends()):
    return await service.get_users()

# Get User by ID
@router.get("/{user_id}", response_model=UserPublic)
async def get_user(user_id: PydanticObjectId, service: UserService = Depends()):
    return await service.get_user(user_id)

# TODO: Authentication dependency, A user must only be able to update themselves
# Update an existing user
@router.patch("/{user_id}", response_model=UserSelf)
async def update_user(user_id: PydanticObjectId, user_data: UserUpdate, service: UserService = Depends()):
    return await service.update_user(user_id, user_data)

# TODO: Authentication dependency, A user must only be able to delete themselves
# Delete a User
@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(user_id: PydanticObjectId, service: UserService = Depends()):
    return await service.delete_user(user_id)