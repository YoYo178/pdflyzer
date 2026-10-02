from beanie import PydanticObjectId

import backend.exceptions.chat as chat_exceptions

from backend.models.chat import Chat

class ChatRepository:
    async def find_all(self, user_id: PydanticObjectId) -> list[Chat]:
        chats = await Chat.find(Chat.owner_id == user_id).to_list()

        # Pinned chats float to the top, then most recently updated.
        chats.sort(key=lambda chat: (not chat.pinned, -chat.updated_at.timestamp()))

        return chats

    async def find_by_id(self, user_id: PydanticObjectId, chat_id: PydanticObjectId) -> Chat:
        chat = await Chat.find_one(
            Chat.id == chat_id,
            Chat.owner_id == user_id
        )

        if not chat:
            raise chat_exceptions.ChatNotFound()

        return chat

    async def create(self, chat: Chat) -> Chat:
        await chat.save()
        return chat

    async def update(self, user_id: PydanticObjectId, chat_id: PydanticObjectId, update_data: dict) -> Chat:
        chat = await self.find_by_id(user_id, chat_id)

        for key, value in update_data.items():
            setattr(chat, key, value)

        await chat.save()

        return chat

    async def delete(self, user_id: PydanticObjectId, chat_id: PydanticObjectId) -> Chat:
        chat = await self.find_by_id(user_id, chat_id)

        await chat.delete()

        return chat