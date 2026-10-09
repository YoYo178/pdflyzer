from typing import Literal

from beanie import PydanticObjectId
from pydantic import BaseModel, model_validator

from backend.models.base import BaseTimestampDocument


class MessageSource(BaseModel):
    filename: str
    
    page_start: int
    page_end: int
    
    paragraph_start: int
    paragraph_end: int
    
    section: str

class Message(BaseTimestampDocument):
    chat_id: PydanticObjectId
    
    sender_id: PydanticObjectId | None
    sender_role: Literal['user', 'assistant', 'system']
    
    content: str
    embeddings: list[float]
    
    rating: Literal['up', 'down'] | None = None
    
    sources: list[MessageSource] = []
    
    # Ensures relationship between sender_id and sender_role are maintained and enforced
    @model_validator(mode="after")
    def validate_sender(self):
        if (self.sender_role == "assistant" or self.sender_role == "system") and self.sender_id is not None:
            raise ValueError("System or Assistant messages cannot have a sender_id")
        
        if self.sender_role == "user" and self.sender_id is None:
            raise ValueError("User messages must have a sender_id")
        
        if(self.sender_role == "user" and len(self.sources)):
            raise ValueError("User messages cannot contain sources")
        
        return self
    
    class Settings:
        name = "messages"