from typing import Literal
from beanie import PydanticObjectId
from pydantic import model_validator

from backend.models.base import BaseTimestampDocument

class Message(BaseTimestampDocument):
    chat_id: PydanticObjectId
    
    sender_id: PydanticObjectId | None
    sender_role: Literal['user', 'system']
    
    content: str
    
    # Ensures relationship between sender_id and sender_role are maintained and enforced
    @model_validator(mode="after")
    def validate_sender(self):
        if self.sender_role == "system" and self.sender_id is not None:
            raise ValueError("System messages cannot have a sender_id")
        
        if self.sender_role == "user" and self.sender_id is None:
            raise ValueError("User messages must have a sender_id")
        
        return self
    
    class Settings:
        name = "messages"