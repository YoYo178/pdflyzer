from beanie import PydanticObjectId

import backend.exceptions.document as document_exceptions
from backend.models.stored_document import StoredDocument


class StoredDocumentRepository:
    async def find_all(self, user_id: PydanticObjectId) -> list[StoredDocument]:
        return await StoredDocument.find(StoredDocument.owner == user_id).to_list()

    async def find_by_id(
        self, user_id: PydanticObjectId, document_id: PydanticObjectId
    ) -> StoredDocument:
        document = await StoredDocument.find_one(
            StoredDocument.id == document_id, StoredDocument.owner == user_id
        )

        if not document:
            raise document_exceptions.DocumentNotFound()

        return document

    async def find_by_hash(
        self, user_id: PydanticObjectId, file_hash: str
    ) -> StoredDocument | None:
        return await StoredDocument.find_one(
            StoredDocument.owner == user_id, StoredDocument.file_hash == file_hash
        )

    async def create(self, document: StoredDocument) -> StoredDocument:
        await document.save()
        return document

    async def update(
        self,
        user_id: PydanticObjectId,
        document_id: PydanticObjectId,
        update_data: dict,
    ) -> StoredDocument:
        document = await self.find_by_id(
            user_id,
            document_id,
        )

        for key, value in update_data.items():
            setattr(document, key, value)

        await document.save()

        return document

    async def delete(
        self, user_id: PydanticObjectId, document_id: PydanticObjectId
    ) -> StoredDocument:
        document = await self.find_by_id(
            user_id,
            document_id,
        )

        await document.delete()

        return document
