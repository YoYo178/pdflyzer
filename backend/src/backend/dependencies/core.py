from arq import ArqRedis
from fastapi import Request, Depends

from backend.core.chunk import ChunkService
from backend.core.embedding import EmbeddingService
from backend.core.pdf import PDFService
from backend.core.storage import StorageService
from backend.core.text import TextService

def get_queue(request: Request) -> ArqRedis:
    return request.app.state.queue

def get_storage_service() -> StorageService:
    return StorageService()

def get_text_service() -> TextService:
    return TextService()

def get_pdf_service(
    text_service: TextService = Depends(get_text_service)
) -> PDFService:
    return PDFService(text_service)

def get_chunk_service() -> ChunkService:
    return ChunkService()

def get_embedding_service() -> EmbeddingService:
    return EmbeddingService()