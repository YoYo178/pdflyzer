from beanie import PydanticObjectId

from backend.core.storage import StorageService

from backend.models.stored_document import StoredDocument

from backend.repositories.chat import ChatRepository
from backend.repositories.document import DocumentRepository

async def prune_orphaned_documents():
    deleted_documents = 0
    
    storage_service = StorageService()
    
    chat_repository = ChatRepository()
    document_repository = DocumentRepository(chat_repository)
    
    stored_documents = await StoredDocument.find().to_list()
    
    for doc in stored_documents:
        chat_documents = await document_repository.find_by_stored_document_id(PydanticObjectId(doc.id))
        
        if len(chat_documents) > 0:
            continue
        
        storage_service.reject_file(doc.file_path)
        await doc.delete()
        deleted_documents += 1
        
    print(f"[Prune] Pruned {deleted_documents} documents from both storage and database.")
        
    
    