from beanie import PydanticObjectId

from backend.models.message import Message

from backend.schemas.message import PayloadMessage

from backend.repositories.message import MessageRepository

class MessageService:
    def __init__(
        self,
        message_repository: MessageRepository
    ):
        self.message_repository = message_repository
    
    async def get_all_messages(self, user_id: PydanticObjectId, chat_id: PydanticObjectId) -> list[Message]:
        return await self.message_repository.find_all(user_id, chat_id)
    
    async def get_message_by_id(self, user_id: PydanticObjectId, chat_id: PydanticObjectId, message_id: PydanticObjectId) -> Message:
        return await self.message_repository.find_by_id(user_id, chat_id, message_id)
    
    async def create_message(self, user_id: PydanticObjectId, chat_id: PydanticObjectId, message_data: PayloadMessage) -> Message:
        message = Message(
            sender_id=user_id,
            sender_role="user",

            chat_id=chat_id,
            
            content=message_data.content,
        )
        
        return await self.message_repository.create(message)
    
    async def delete_message(self, user_id: PydanticObjectId, chat_id: PydanticObjectId, message_id: PydanticObjectId) -> None:
        return await self.message_repository.delete(user_id, chat_id, message_id)