from beanie import PydanticObjectId
from backend.models.chat import Chat

class ChatRepository:
    async def find_all(self, user_id: PydanticObjectId) -> list[Chat]:
        return await Chat.find(Chat.owner_id == user_id).to_list()

    async def find_by_id(self, user_id: PydanticObjectId, chat_id: PydanticObjectId) -> Chat | None:
        return await Chat.find_one(
            Chat.id == chat_id,
            Chat.owner_id == user_id
        )

    async def create(self, chat: Chat) -> Chat:
        await chat.save()
        return chat

    async def update(self, user_id: PydanticObjectId, chat_id: PydanticObjectId, update_data: dict) -> Chat | None:
        chat = await self.find_by_id(user_id, chat_id)

        if not chat:
            return None

        for key, value in update_data.items():
            setattr(chat, key, value)

        await chat.save()

        return chat

    async def delete(self, user_id: PydanticObjectId, chat_id: PydanticObjectId) -> Chat | None:
        chat = await self.find_by_id(user_id, chat_id)

        if not chat:
            return None

        await chat.delete()

        return chat