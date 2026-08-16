from arq import ArqRedis
from fastapi import Request

from backend.core.storage import StorageService
from backend.core.pdf import PDFService

def get_queue(request: Request) -> ArqRedis:
    return request.app.state.queue

def get_storage_service() -> StorageService:
    return StorageService()

def get_pdf_service() -> PDFService:
    return PDFService()