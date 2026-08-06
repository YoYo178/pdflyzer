from fastapi import Depends
from beanie import PydanticObjectId

import backend.exceptions.user as user_exceptions

from backend.models.user import User
from backend.repositories.user import UserRepository, get_user_repository
from backend.schemas.user import UserUpdate

class UserService:
    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository

    # Gets all users
    async def get_users(self) -> list[User]:
        return await self.user_repository.find_all()

    # Gets a specific user by ID
    async def get_user(self, user_id: PydanticObjectId) -> User:
        user = await self.user_repository.find_by_id(user_id)

        if not user:
            raise user_exceptions.UserNotFound()

        return user

    # Deletes a user by ID
    async def delete_user(self, user_id: PydanticObjectId) -> None:
        deleted_user = await self.user_repository.delete(user_id)
        
        if not deleted_user:
            raise user_exceptions.UserNotFound()
        
        return None

    # Updates a user by ID
    async def update_user(self, user_id: PydanticObjectId, user_data: UserUpdate) -> User:
        update_data = user_data.model_dump(exclude_unset=True)

        updated_user = await self.user_repository.update(user_id, update_data)

        if not updated_user:
            raise user_exceptions.UserNotFound()
            
        return updated_user

def get_user_service(
    user_repository: UserRepository = Depends(get_user_repository)
) -> UserService:
    return UserService(user_repository)