from arq import ArqRedis
from fastapi import Request

from backend.core.storage import StorageService

def get_queue(request: Request) -> ArqRedis:
    return request.app.state.queue

def get_storage_service() -> StorageService:
    return StorageService()