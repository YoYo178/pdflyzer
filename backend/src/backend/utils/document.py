from beanie import PydanticObjectId

from backend.core.storage import StorageService
from backend.models.stored_document import StoredDocument
from backend.repositories.chat import ChatRepository
from backend.repositories.document import DocumentRepository
from backend.repositories.document_chunk import DocumentChunkRepository


async def prune_orphaned_documents():
    deleted_documents = 0
    
    storage_service = StorageService()
    
    chat_repository = ChatRepository()
    document_repository = DocumentRepository(chat_repository)
    document_chunk_repository = DocumentChunkRepository()
    
    stored_documents = await StoredDocument.find().to_list()
    
    for doc in stored_documents:
        chat_documents = await document_repository.find_by_stored_document_id(PydanticObjectId(doc.id))
        
        if len(chat_documents) > 0:
            continue
        
        await document_chunk_repository.delete_document_chunks(PydanticObjectId(doc.id))
        
        storage_service.reject_file(doc.file_path)
        await doc.delete()
        
        deleted_documents += 1
        
        
        
    print(f"[Prune] Pruned {deleted_documents} documents from both storage and database.")
        
    
    