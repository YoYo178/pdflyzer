from beanie import PydanticObjectId

import backend.exceptions.user as user_exceptions
from backend.models.user import User
from backend.repositories.user import UserRepository
from backend.schemas.user import UserUpdate
from backend.services.chat import ChatService


class UserService:
    def __init__(
        self,
        user_repository: UserRepository,
        chat_service: ChatService
    ):
        self.user_repository = user_repository
        self.chat_service = chat_service

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
        
        # Delete this user's chats
        chats = await self.chat_service.get_all_chats(user_id)
        for chat in chats:
            await self.chat_service.delete_chat(user_id, PydanticObjectId(chat.id))

    # Updates a user by ID
    async def update_user(self, user_id: PydanticObjectId, user_data: UserUpdate) -> User:
        update_data = user_data.model_dump(exclude_unset=True)

        updated_user = await self.user_repository.update(user_id, update_data)

        if not updated_user:
            raise user_exceptions.UserNotFound()
            
        return updated_user