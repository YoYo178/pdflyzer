from arq import ArqRedis
from beanie import PydanticObjectId
from fastapi import UploadFile

import backend.exceptions.document as document_exceptions
from backend.core.storage import StorageService
from backend.models.chat_document import ChatDocument
from backend.models.stored_document import StoredDocument
from backend.repositories.document import DocumentRepository
from backend.repositories.document_chunk import DocumentChunkRepository
from backend.repositories.stored_document import StoredDocumentRepository
from backend.schemas.document import PopulatedChatDocument

MAX_UPLOADS = 5

class DocumentService:
    def __init__(
        self,
        repo: DocumentRepository,
        document_chunk_repository: DocumentChunkRepository,
        stored_document_repository: StoredDocumentRepository,
        storage: StorageService,
        queue: ArqRedis,
    ):
        self.repo = repo
        self.document_chunk_repository = document_chunk_repository
        self.stored_document_repository = stored_document_repository
        self.storage = storage
        self.queue = queue

    async def get_all_documents(self, user_id: PydanticObjectId, chat_id: PydanticObjectId) -> list[PopulatedChatDocument]:
        
        documents = await self.repo.find_all(user_id, chat_id)
        
        populated_documents = []
        
        for document in documents:
            populated_documents.append(
                PopulatedChatDocument(
                    id=PydanticObjectId(document.id),
                    
                    chat=document.chat,
                    stored_document=await self.stored_document_repository.find_by_id(user_id, document.stored_document),
                    
                    created_at=document.created_at,
                    updated_at=document.updated_at,
                )
            )
        
        return populated_documents

    async def get_document_by_id(self, user_id: PydanticObjectId, document_id: PydanticObjectId) -> PopulatedChatDocument:
        document = await self.repo.find_by_id(user_id, document_id)
        
        return PopulatedChatDocument(
            id=PydanticObjectId(document.id),
            
            chat=document.chat,
            stored_document=await self.stored_document_repository.find_by_id(user_id, document.stored_document),
            
            created_at=document.created_at,
            updated_at=document.updated_at,
        )
    
    async def get_document_in_chat(self, user_id: PydanticObjectId, chat_id: PydanticObjectId, document_id: PydanticObjectId) -> PopulatedChatDocument:
        document = await self.repo.find_by_id_in_chat(user_id, chat_id, document_id)
        
        return PopulatedChatDocument(
            id=PydanticObjectId(document.id),
            
            chat=document.chat,
            stored_document=await self.stored_document_repository.find_by_id(user_id, document.stored_document),
            
            created_at=document.created_at,
            updated_at=document.updated_at,
        )

    async def delete_document(self, user_id: PydanticObjectId, document_id: PydanticObjectId) -> None:
        document = await self.repo.find_by_id(user_id, document_id)
        
        # If document does not exist then return
        if not document:
            return
        
        # Find all references to this StoredDocument
        other_docs = await self.repo.find_by_stored_document_id(document.stored_document)
        
        # This might be the last reference to this StoredDocument (<= 1 reference(s)).
        # So we clear the chunks and its associated StoredDocument instance
        # Before deleting the actual ChatDocument object
        if len(other_docs) <= 1:
            # Delete chunks
            await self.document_chunk_repository.delete_document_chunks(document.stored_document)
            
            # Delete StoredDocument instance
            stored_document = await self.stored_document_repository.delete(user_id, document.stored_document)
            
            # Delete the file from our filesystem
            self.storage.reject_file(stored_document.file_path)
        
        # Delete the ChatDocument object
        await document.delete()

    async def delete_document_in_chat(self, user_id: PydanticObjectId, chat_id: PydanticObjectId, document_id: PydanticObjectId) -> None:
        # Checks if the document exists in this chat, and throws and exception if it doesn't
        await self.get_document_in_chat(user_id, chat_id, document_id)
        
        # Deletes the document and handles clearing of StoredDocument and DocumentChunk references
        await self.delete_document(user_id, document_id)

    async def upload_document(self, user_id: PydanticObjectId, chat_id: PydanticObjectId, files: list[UploadFile]) -> None:
        # Enforce max upload limit per chat
        existing_documents = await self.repo.find_all(user_id, chat_id)
        files_trimmed = files[:(MAX_UPLOADS - len(existing_documents))]
        
        if not files_trimmed:
            raise document_exceptions.DocumentLimitReached()

        for file in files_trimmed:
            if not file.filename or not file.content_type or not file.size:
                continue

            document_id = PydanticObjectId()

            temp_file = await self.storage.save_temp(
                file,
                str(document_id),
            )
            
            stored_document = await self.stored_document_repository.find_by_hash(user_id, temp_file.sha256)
            
            # The user has uploaded this exact file before
            if stored_document:
                docs_by_stored_id = await self.repo.find_by_stored_document_id(PydanticObjectId(stored_document.id))
                # Check whether it already exists in this specific chat.
                document_exists_in_same_chat = [
                    doc
                    for doc in
                    docs_by_stored_id
                    if doc.chat == chat_id
                ]
                
                if document_exists_in_same_chat:
                    self.storage.reject_file(temp_file.path)
                    raise document_exceptions.DocumentAlreadyExists()
                
                document = ChatDocument(
                    stored_document=PydanticObjectId(stored_document.id),
                    chat=chat_id
                )

                await self.repo.create(
                    user_id,
                    chat_id,
                    document,
                )
                
                # Since we already had a StoredDocument on this file, we reject this new file as we already have it
                self.storage.reject_file(temp_file.path)

                continue

            final_path = self.storage.finalize_file(
                temp_file.path,
                f"{document_id}.pdf",
            )

            stored_document = StoredDocument(
                file_hash=temp_file.sha256,
                file_path=final_path,
                filename=file.filename,
                mime_type=file.content_type,
                owner=user_id,
                pages=-1, # Populated later by the document processing job
                size=file.size,
                status='QUEUED'
            )

            await self.stored_document_repository.create(
                stored_document,
            )
            
            # Also create a ChatDocument while we're at it
            document = ChatDocument(
                stored_document=PydanticObjectId(stored_document.id),
                chat=chat_id,
            )

            await self.repo.create(
                user_id,
                chat_id,
                document,
            )

            await self.queue.enqueue_job(
                "process_document",
                str(user_id),
                str(stored_document.id),
                str(chat_id),
            )