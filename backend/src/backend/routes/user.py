from beanie import PydanticObjectId
from fastapi import APIRouter, status

from backend.schemas.user import UserCreate, UserUpdate, UserSelf, UserPublic
import backend.controllers.user as users_controller

# Create Router
router = APIRouter(prefix="/users", tags=["Users"])

# TODO: Authentication dependency, The logged in user must see their own user object
# Get self user
@router.get("/me", response_model=UserSelf)
async def get_me():
    return {}

# Get all users
@router.get("/", response_model=list[UserPublic])
async def get_users():
    return await users_controller.get_users()

# Get User by ID
@router.get("/{user_id}", response_model=UserPublic)
async def get_user(user_id: PydanticObjectId):
    return await users_controller.get_user(user_id)

# Create a new User
@router.post("/", status_code=status.HTTP_201_CREATED, response_model=UserSelf)
async def create_user(user_data: UserCreate):
    return await users_controller.create_user(user_data)

# TODO: Authentication dependency, A user must only be able to update themselves
# Update an existing user
@router.patch("/{user_id}", response_model=UserSelf)
async def update_user(user_id: PydanticObjectId, user_data: UserUpdate):
    return await users_controller.update_user(user_id, user_data)

# TODO: Authentication dependency, A user must only be able to delete themselves
# Delete a User
@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(user_id: PydanticObjectId):
    return await users_controller.delete_user(user_id)