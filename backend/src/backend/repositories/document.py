from beanie import PydanticObjectId

import backend.exceptions.chat as chat_exceptions
import backend.exceptions.document as document_exceptions
from backend.models.chat_document import ChatDocument
from backend.repositories.chat import ChatRepository


class DocumentRepository:
    def __init__(
        self,
        chat_repository: ChatRepository
    ):
        self.chat_repository = chat_repository

    async def _verify_chat_ownership(self, user_id: PydanticObjectId, chat_id: PydanticObjectId) -> None:
        await self.chat_repository.find_by_id(user_id, chat_id)

    async def find_all(self, user_id: PydanticObjectId, chat_id: PydanticObjectId) -> list[ChatDocument]:
        await self._verify_chat_ownership(
            user_id,
            chat_id,
        )

        return await ChatDocument.find(
            ChatDocument.chat == chat_id,
        ).to_list()

    async def find_by_id(self, user_id: PydanticObjectId, document_id: PydanticObjectId) -> ChatDocument:
        document = await ChatDocument.get(document_id)

        if not document:
            raise document_exceptions.DocumentNotFound()

        await self._verify_chat_ownership(
            user_id,
            document.chat,
        )

        return document

    async def find_by_id_in_chat(self, user_id: PydanticObjectId, chat_id: PydanticObjectId, document_id: PydanticObjectId) -> ChatDocument:
        await self._verify_chat_ownership(
            user_id,
            chat_id,
        )

        document = await ChatDocument.find_one(
            ChatDocument.id == document_id,
            ChatDocument.chat == chat_id,
        )

        if not document:
            raise document_exceptions.DocumentNotFound()

        return document
    
    async def find_by_stored_document_id(self, stored_document_id: PydanticObjectId) -> list[ChatDocument]:        
        return await ChatDocument.find(
            ChatDocument.stored_document == stored_document_id
        ).to_list()

    async def create(self, user_id: PydanticObjectId, chat_id: PydanticObjectId, document: ChatDocument) -> ChatDocument:
        await self._verify_chat_ownership(
            user_id,
            chat_id,
        )

        if document.chat != chat_id:
            raise chat_exceptions.ChatMismatch()

        await document.save()

        return document

    async def delete(self, user_id: PydanticObjectId, document_id: PydanticObjectId) -> ChatDocument:
        document = await self.find_by_id(
            user_id,
            document_id,
        )

        await document.delete()

        return document