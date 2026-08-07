from beanie import PydanticObjectId
from backend.schemas.chat import ChatMeta

from backend.models.chat_document import ChatDocument
from backend.models.chat import Chat
from backend.repositories.chat import ChatRepository
from backend.repositories.document import DocumentRepository

class ChatService:
    def __init__(
        self,
        chat_repository: ChatRepository,
        chat_document_repository: DocumentRepository
    ):
        self.chat_repository = chat_repository
        self.chat_document_repository = chat_document_repository

    async def get_all_chats(self, user_id: PydanticObjectId) -> list[Chat]:
        return await self.chat_repository.find_all(user_id)

    async def get_chat_by_id(self, user_id: PydanticObjectId, chat_id: PydanticObjectId) -> Chat | None:
        return await self.chat_repository.find_by_id(user_id, chat_id)

    async def create_new_chat(self, chat_data: ChatMeta, user_id: PydanticObjectId) -> Chat:
        chat = Chat(
            owner_id=user_id,
            name=chat_data.name
        )

        return await self.chat_repository.create(chat)

    async def update_chat(self, user_id: PydanticObjectId, chat_id: PydanticObjectId, update_data: ChatMeta) -> Chat | None:
        return await self.chat_repository.update(
            user_id,
            chat_id,
            update_data=update_data.model_dump()
        )

    async def delete_chat(self, user_id: PydanticObjectId, chat_id: PydanticObjectId) -> Chat | None:
        return await self.chat_repository.delete(user_id, chat_id)

    async def upload_document(self, user_id: PydanticObjectId, chat_id: PydanticObjectId):
        return None # TODO

    async def get_all_documents(self, user_id: PydanticObjectId, chat_id: PydanticObjectId) -> list[ChatDocument]:
        return [] # TODO