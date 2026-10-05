from arq import ArqRedis
from fastapi import Depends
from starlette.requests import HTTPConnection

from backend.core.chunk import ChunkService
from backend.core.embedding import EmbeddingService, embedding_service
from backend.core.llm import LLMService
from backend.core.pdf import PDFService
from backend.core.retrieval import RetrievalService
from backend.core.storage import StorageService
from backend.core.text import TextService

from backend.dependencies.repositories import get_document_chunk_repository

from backend.repositories.document_chunk import DocumentChunkRepository

def get_queue(connection: HTTPConnection) -> ArqRedis:
    return connection.app.state.queue

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
    return embedding_service

def get_retrieval_service(
    document_chunk_repository: DocumentChunkRepository = Depends(get_document_chunk_repository)
) -> RetrievalService:
    return RetrievalService(
        document_chunk_repository
    )

def get_llm_service() -> LLMService:
    return LLMService()