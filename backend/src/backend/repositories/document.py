from fastapi import Depends
from beanie import PydanticObjectId

import backend.exceptions.document as document_exceptions

from backend.models.chat_document import ChatDocument
from backend.repositories.chat import ChatRepository

class DocumentRepository:
    def __init__(
        self,
        chat_repository: ChatRepository
    ):
        self.chat_repository = chat_repository

    async def _verify_chat_ownership(self, user_id: PydanticObjectId, chat_id: PydanticObjectId):
        return bool(await self.chat_repository.find_by_id(user_id, chat_id))

    async def find_all(self, user_id: PydanticObjectId, chat_id: PydanticObjectId) -> list[ChatDocument]:
            return []
        if not await self._verify_chat_ownership(user_id, chat_id):

        return await ChatDocument.find(ChatDocument.chat_id == chat_id).to_list()

    async def find_by_id(self, user_id: PydanticObjectId, document_id: PydanticObjectId) -> ChatDocument | None:
        document = await ChatDocument.get(document_id)

        if not document or not await self._verify_chat_ownership(user_id, document.chat_id):
            raise document_exceptions.DocumentNotFound()
            
        return document

    async def create(self, user_id: PydanticObjectId, chat_id: PydanticObjectId, document: ChatDocument) -> ChatDocument | None:
        if not await self._verify_chat_ownership(user_id, chat_id):
            return None

        await document.save()
        return document

    async def update(self, user_id: PydanticObjectId, document_id: PydanticObjectId, update_data: dict) -> ChatDocument | None:
        document = await self.find_by_id(user_id, document_id)

        if not document:
            raise document_exceptions.DocumentNotFound()

        for key, value in update_data.items():
            setattr(document, key, value)

        await document.save()

        return document

    async def delete(self, user_id: PydanticObjectId, document_id: PydanticObjectId) -> ChatDocument | None:
        document = await self.find_by_id(user_id, document_id)

        if not document:
            raise document_exceptions.DocumentNotFound()

        await document.delete()

        return document