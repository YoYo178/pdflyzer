from beanie import PydanticObjectId

import backend.exceptions.chat as chat_exceptions
import backend.exceptions.message as message_exceptions
from backend.models.message import Message
from backend.repositories.chat import ChatRepository


class MessageRepository:
    def __init__(
        self,
        chat_repository: ChatRepository
    ):
        self.chat_repository = chat_repository
        
    async def _verify_chat_ownership(self, user_id: PydanticObjectId, chat_id: PydanticObjectId) -> None:
        chat = await self.chat_repository.find_by_id(user_id, chat_id)
        
        if not chat or chat.owner != user_id:
            raise chat_exceptions.ChatMismatch()
    
    async def find_all(self, user_id: PydanticObjectId, chat_id: PydanticObjectId) -> list[Message]:
        await self._verify_chat_ownership(user_id, chat_id)
        
        messages = await Message.find(
            Message.chat == chat_id
        ).to_list()
        
        return messages
    
    async def find_by_id(self, user_id: PydanticObjectId, chat_id: PydanticObjectId, message_id: PydanticObjectId) -> Message:
        await self._verify_chat_ownership(user_id, chat_id)
        
        message = await Message.find_one(
            Message.chat == chat_id,
            Message.id == message_id
        )
        
        if not message:
            raise message_exceptions.MessageNotFound()
        
        return message
    
    async def create(self, message: Message) -> Message:
        await message.save()
        return message
    
    async def update(self, user_id: PydanticObjectId, chat_id: PydanticObjectId, message_id: PydanticObjectId, update_data: dict) -> Message | None:
        message = await self.find_by_id(user_id, chat_id, message_id)

        if not message:
            return None

        for key, value in update_data.items():
            setattr(message, key, value)

        await message.save()

        return message
    
    async def delete(self, user_id: PydanticObjectId, chat_id: PydanticObjectId, message_id: PydanticObjectId) -> None:
        message = await self.find_by_id(user_id, chat_id, message_id)
        
        if not message:
            raise message_exceptions.MessageNotFound()
        
        await message.delete()