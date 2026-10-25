from typing import Literal

from beanie import PydanticObjectId
from pydantic import BaseModel, Field, model_validator

from backend.models.base import BaseTimestampDocument


class MessageSource(BaseModel):
    stored_document: PydanticObjectId

    page_start: int
    page_end: int

    paragraph_start: int
    paragraph_end: int

    section: str


class Message(BaseTimestampDocument):
    chat: PydanticObjectId
    content: str
    rating: Literal['up', 'down'] | None = None

    sender: PydanticObjectId | None
    sender_role: Literal['user', 'assistant', 'system']

    sources: list[MessageSource] | None = Field(default_factory=list)
    status: Literal['streaming', 'done', 'error'] | None

    embeddings: list[float] | None

    # Ensure schema shapes from different role perspectives
    @model_validator(mode='after')
    def validate_sender(self):
        # System role message shape enforcements
        if self.sender_role == 'system':
            if self.sender is not None:
                raise ValueError('System messages cannot have a sender')
            
            if self.rating is not None:
                raise ValueError('System messages cannot have ratings')
        
        # Assistant role message shape enforcements
        if self.sender_role == 'assistant':
            if self.sender is not None:
                raise ValueError('Assistant messages cannot have a sender')
            
            if self.sources is None:
                raise ValueError('Assistant messages must have sources')
            
            if self.embeddings is not None:
                raise ValueError('Assistant messages must not contain embeddings')
            
            if self.status is None:
                raise ValueError('Assistant messages must have a status value')
        
        
        # User role message shape enforcements
        if self.sender_role == 'user':
            if self.sender is None:
                raise ValueError('User messages must have a sender')
            
            if self.sources is not None:
                raise ValueError('User messages must contain have sources')
            
            if self.rating is not None:
                raise ValueError('User messages cannot have ratings')
            
            if self.status is not None:
                raise ValueError('User messages must have a status value')

        return self

    class Settings:
        name = 'messages'
