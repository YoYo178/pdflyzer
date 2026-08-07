from beanie import PydanticObjectId

from backend.repositories.document import DocumentRepository

class DocumentService:
    def __init__(
        self,
        repo: DocumentRepository
    ):
        self.repo = repo

    # TODO: implement
    # TODO: make it depend on chats later, any depending chats must be deleted before the document
    async def delete_document(self, user_id: PydanticObjectId, document_id: PydanticObjectId):
        pass