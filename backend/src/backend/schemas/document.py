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