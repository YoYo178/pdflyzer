from beanie import PydanticObjectId

from backend.core.pdf import PDFService

from backend.repositories.chat import ChatRepository
from backend.repositories.document import DocumentRepository

async def process_document(
    ctx,
    user_id: str,
    document_id: str,
):
    chat_repository = ChatRepository()
    document_repository = DocumentRepository(chat_repository)
    
    pdf_service = PDFService()

    document = await document_repository.find_by_id(
        PydanticObjectId(user_id), PydanticObjectId(document_id)
    )

    if not document:
        return

    document.status = "processing"
    await document.save()

    file_path = document.file_path

    try:
        print(f"Processing {document.filename}")
        
        parsed_pages = pdf_service.extract_pages(file_path)
        paragraphs = pdf_service.prepare_paragraphs(parsed_pages)

        document.status = "ready"
        await document.save()
    except Exception:
        print(f"Failed to process {document.filename}")
        
        document.status = "failed"
        await document.save()

        raise
