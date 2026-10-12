from beanie import PydanticObjectId

from backend.models.chat import Chat
from backend.repositories.chat import ChatRepository
from backend.repositories.document_chunk import DocumentChunkRepository
from backend.repositories.document import DocumentRepository
from backend.repositories.message import MessageRepository
from backend.repositories.stored_document import StoredDocumentRepository
from backend.schemas.chat import ChatMeta


class ChatService:
    def __init__(
        self,
        repo: ChatRepository,
        document_chunk_repository: DocumentChunkRepository,
        document_repository: DocumentRepository,
        message_repository: MessageRepository,
        stored_document_repository: StoredDocumentRepository
    ):
        self.repo = repo
        self.document_chunk_repository = document_chunk_repository
        self.document_repository = document_repository
        self.message_repository = message_repository
        self.stored_document_repository = stored_document_repository

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
        await self.message_repository.delete_in_chat(user_id, chat_id)
        
        # Deleting documents is not as straightforward...
        chat_documents = await self.document_repository.find_all(user_id, chat_id)
        
        for chat_document in chat_documents:
            # Get the documents which are pointing to this StoredDocument
            stored_doc_references = await self.document_repository.find_by_stored_document_id(chat_document.stored_document)
            
            # If the references are less than or equal to one, we should also delete its
            # corresponding StoredDocument and DocumentChunk objects
            if len(stored_doc_references) <= 1:
                # Delete document chunks
                await self.document_chunk_repository.delete_document_chunks(chat_document.stored_document)
                
                # Delete the StoredDocument object
                await self.stored_document_repository.delete(user_id, chat_document.stored_document)
            
            # Finally, delete this ChatDocument object
            await chat_document.delete()
        
        # Finally delete the chat
        await self.repo.delete(user_id, chat_id)