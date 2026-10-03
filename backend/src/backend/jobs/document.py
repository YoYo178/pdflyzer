from beanie import PydanticObjectId

from backend.core.chunk import ChunkService
from backend.core.embedding import EmbeddingService
from backend.core.text import TextService
from backend.core.pdf import PDFService

from backend.models.document_chunk import DocumentChunk

from backend.repositories.document_chunk import DocumentChunkRepository
from backend.repositories.chat import ChatRepository
from backend.repositories.document import DocumentRepository

async def process_document(
    ctx,
    user_id: str,
    document_id: str,
):
    chat_repository = ChatRepository()
    document_repository = DocumentRepository(chat_repository)
    document_chunk_repository = DocumentChunkRepository()
    
    text_service = TextService()
    pdf_service = PDFService(text_service)
    chunk_service = ChunkService()
    embedding_service = EmbeddingService()

    document = await document_repository.find_by_id(
        PydanticObjectId(user_id), PydanticObjectId(document_id)
    )

    if not document:
        return

    document.status = "PROCESSING"
    await document.save()

    file_path = document.file_path

    try:
        print(f"Processing {document.filename}")
        
        parsed_pages = pdf_service.extract_pages(file_path)
        
        document.pages = len(parsed_pages)
        
        paragraphs = pdf_service.prepare_paragraphs(parsed_pages)

        chunks = chunk_service.prepare_chunks(paragraphs)
        
        embeddings = embedding_service.generate(
            [chunk.text for chunk in chunks]
        )
        
        chunk_documents = [
            DocumentChunk(
                id=PydanticObjectId(),
                
                document_id=PydanticObjectId(document.id),
                chunk_index=chunk.chunk_index,
                text=chunk.text,
                embeddings=embedding,
                
                page_start=chunk.page_start,
                page_end=chunk.page_end,
                
                paragraph_start=chunk.paragraph_start,
                paragraph_end=chunk.paragraph_end
            ) for chunk, embedding in zip(chunks, embeddings)
        ]
        
        await document_chunk_repository.create_many(chunk_documents)

        document.status = "READY"
        await document.save()
    except Exception:
        print(f"Failed to process {document.filename}")
        
        document.status = "FAILED"
        await document.save()

        raise
