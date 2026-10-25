from typing import Literal

from beanie import PydanticObjectId

from backend.core.chunk import ChunkService
from backend.core.embedding import EmbeddingService
from backend.core.events.publisher import publish_event
from backend.core.pdf import PDFService
from backend.core.text import TextService
from backend.events.chat import event_chat_document_update
from backend.events.redis import redis_pub_event
from backend.models.document_chunk import DocumentChunk
from backend.repositories.document_chunk import DocumentChunkRepository
from backend.repositories.stored_document import StoredDocumentRepository


async def process_document(ctx, user_id: str, document_id: str, chat_id: str):
    stored_document_repository = StoredDocumentRepository()
    document_chunk_repository = DocumentChunkRepository()

    text_service = TextService()
    pdf_service = PDFService(text_service)
    chunk_service = ChunkService()
    embedding_service = EmbeddingService()

    document = await stored_document_repository.find_by_id(
        PydanticObjectId(user_id), PydanticObjectId(document_id)
    )

    if not document:
        return

    async def update_status(status: Literal['QUEUED', 'PROCESSING', 'READY', 'FAILED']):
        document.status = status
        await document.save()

        await publish_event(
            ctx['redis'],
            redis_pub_event(
                chat_id, event_chat_document_update(chat_id, document_id, status)
            ),
        )

    await update_status('PROCESSING')

    file_path = document.file_path

    try:
        print(f'Processing {document.filename}')

        parsed_pages = pdf_service.extract_pages(file_path)

        document.pages = len(parsed_pages)

        paragraphs = pdf_service.prepare_paragraphs(parsed_pages)

        chunks = chunk_service.prepare_chunks(paragraphs)

        embeddings = embedding_service.generate([chunk.text for chunk in chunks])

        chunk_documents = [
            DocumentChunk(
                stored_document=PydanticObjectId(document.id),
                chunk_index=chunk.chunk_index,
                embeddings=embedding,
                page_start=chunk.page_start,
                page_end=chunk.page_end,
                paragraph_start=chunk.paragraph_start,
                paragraph_end=chunk.paragraph_end,
                text=chunk.text,
            )
            for chunk, embedding in zip(chunks, embeddings, strict=False)
        ]

        await document_chunk_repository.create_many(chunk_documents)

        await update_status('READY')

    except Exception:
        print(f'Failed to process {document.filename}')

        await update_status('FAILED')

        raise
