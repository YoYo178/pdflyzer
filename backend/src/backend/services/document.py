from beanie import PydanticObjectId

from backend.repositories.document import DocumentRepository

class DocumentService:
    def __init__(
        self,
        repo: DocumentRepository
    ):
        self.repo = repo

    async def get_all_documents(self, user_id: PydanticObjectId, chat_id: PydanticObjectId):
        return await self.repo.find_all(user_id, chat_id)

    async def get_document_by_id(self, user_id: PydanticObjectId, document_id: PydanticObjectId):
        return await self.repo.find_by_id(user_id, document_id)

    async def delete_document(self, user_id: PydanticObjectId, document_id: PydanticObjectId):
        # TODO: make it depend on chats later, any depending chats must be deleted before the document
        return await self.repo.delete(user_id, document_id)