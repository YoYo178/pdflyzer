from fastapi import UploadFile

from beanie import PydanticObjectId
from backend.schemas.chat import ChatMeta

from backend.models.chat_document import ChatDocument
from backend.models.chat import Chat

from backend.repositories.chat import ChatRepository
from backend.repositories.document import DocumentRepository

MAX_UPLOADS = 5

class ChatService:
    def __init__(
        self,
        chat_repository: ChatRepository,
        document_repository: DocumentRepository
    ):
        self.chat_repository = chat_repository
        self.document_repository = document_repository

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
    
    async def upload_document(self, user_id: PydanticObjectId, chat_id: PydanticObjectId, files: list[UploadFile]) -> None:
        files_trimmed = files[0:MAX_UPLOADS]

        for file in files_trimmed:
            if not file.filename or not file.content_type or not file.size:
                continue

            document = ChatDocument(
                chat_id=chat_id,
                filename=file.filename,
                mime_type=file.content_type,
                size=file.size,
                status="Uploaded"
            )

            await self.document_repository.create(user_id, chat_id, document)

    async def get_all_documents(self, user_id: PydanticObjectId, chat_id: PydanticObjectId) -> list[ChatDocument]:
        return await self.document_repository.find_all(user_id, chat_id)