from pydantic import BaseModel
from datetime import datetime
from beanie import PydanticObjectId

from backend.models.stored_document import StoredDocument

class PopulatedChatDocument(BaseModel):
    id: PydanticObjectId
    
    chat: PydanticObjectId
    stored_document: StoredDocument
    
    created_at: datetime
    updated_at: datetime