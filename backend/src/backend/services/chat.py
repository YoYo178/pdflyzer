from beanie import PydanticObjectId

from backend.models.chat import Chat
from backend.repositories.chat import ChatRepository
from backend.schemas.chat import ChatMeta

class ChatService:
    def __init__(
        self,
        repo: ChatRepository,
    ):
        self.repo = repo

    async def get_all_chats(self, user_id: PydanticObjectId) -> list[Chat]:
        return await self.repo.find_all(user_id)

    async def get_chat_by_id(self, user_id: PydanticObjectId, chat_id: PydanticObjectId) -> Chat:
        return await self.repo.find_by_id(user_id, chat_id)

    async def create_new_chat(self, user_id: PydanticObjectId) -> Chat:
        chat = Chat(
            owner_id=user_id,
            name="New Chat"
        )

        return await self.repo.create(chat)

    async def update_chat(self, user_id: PydanticObjectId, chat_id: PydanticObjectId, update_data: ChatMeta) -> Chat:
        return await self.repo.update(user_id, chat_id, update_data.model_dump())

    async def delete_chat(self, user_id: PydanticObjectId, chat_id: PydanticObjectId) -> None:
        await self.repo.delete(user_id, chat_id)