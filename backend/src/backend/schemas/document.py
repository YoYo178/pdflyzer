from typing import Literal
from datetime import datetime

from beanie import PydanticObjectId
from pydantic import BaseModel

from backend.models.stored_document import StoredDocument


class PopulatedChatDocument(BaseModel):
    id: PydanticObjectId

    chat: PydanticObjectId
    stored_document: StoredDocument

    created_at: datetime
    updated_at: datetime

class StoredDocumentView(BaseModel):
    id: PydanticObjectId
    owner: PydanticObjectId

    filename: str
    pages: int
    size: int

    status: Literal['QUEUED', 'PROCESSING', 'READY', 'FAILED']

    created_at: datetime
    updated_at: datetime

class PopulatedDocumentView(BaseModel):
    id: PydanticObjectId

    chat: PydanticObjectId
    stored_document: StoredDocumentView

    created_at: datetime
    updated_at: datetime