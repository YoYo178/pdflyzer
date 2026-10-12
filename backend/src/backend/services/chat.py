from beanie import PydanticObjectId

from backend.models.chat import Chat
from backend.repositories.chat import ChatRepository
from backend.schemas.chat import ChatMeta
from backend.services.document import DocumentService
from backend.services.message import MessageService


class ChatService:
    def __init__(
        self,
        repo: ChatRepository,
        document_service: DocumentService,
        message_service: MessageService
    ):
        self.repo = repo
        self.document_service = document_service
        self.message_service = message_service

    async def get_all_chats(self, user_id: PydanticObjectId) -> list[Chat]:
        return await self.repo.find_all(user_id)

    async def get_chat_by_id(self, user_id: PydanticObjectId, chat_id: PydanticObjectId) -> Chat:
        return await self.repo.find_by_id(user_id, chat_id)

    async def create_new_chat(self, user_id: PydanticObjectId) -> Chat:
        chat = Chat(
            owner=user_id,
            name="New Chat"
        )

        return await self.repo.create(chat)

    async def update_chat(self, user_id: PydanticObjectId, chat_id: PydanticObjectId, update_data: ChatMeta) -> Chat:
        return await self.repo.update(user_id, chat_id, update_data.model_dump(exclude_none=True))

    async def delete_chat(self, user_id: PydanticObjectId, chat_id: PydanticObjectId) -> None:
        # Delete messages of this chat
        messages = await self.message_service.get_all_messages(user_id, chat_id)
        for message in messages:
            await self.message_service.delete_message(user_id, chat_id, PydanticObjectId(message.id))
        
        # Delete documents of this chat
        documents = await self.document_service.get_all_documents(user_id, chat_id)
        for document in documents:
            await self.document_service.delete_document(user_id, PydanticObjectId(document.id))
        
        # Finally delete the chat
        await self.repo.delete(user_id, chat_id)