from typing import Literal

from beanie import PydanticObjectId

from backend.models.base import BaseTimestampDocument


class StoredDocument(BaseTimestampDocument):
    owner: PydanticObjectId
    
    file_hash: str
    file_path: str
    
    filename: str
    mime_type: str
    pages: int
    size: int
    
    status: Literal['QUEUED', 'PROCESSING', 'READY', 'FAILED']

    class Settings:
        name = "stored_documents"