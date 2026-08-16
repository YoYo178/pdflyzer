from beanie import PydanticObjectId

from backend.repositories.chat import ChatRepository
from backend.repositories.document import DocumentRepository

async def process_document(
    ctx,
    user_id: str,
    document_id: str,
):
    chat_repository = ChatRepository()
    document_repository = DocumentRepository(chat_repository)
    
    document = await document_repository.find_by_id(
        PydanticObjectId(user_id), PydanticObjectId(document_id)
    )

    if not document:
        return

    document.status = "processing"
    await document.save()

    try:
        print(f"Processing {document.filename}")
        
        # TODO: actually process the document

        document.status = "ready"
        await document.save()
    except Exception:
        print(f"Failed to process {document.filename}")
        
        document.status = "failed"
        await document.save()

        raise
