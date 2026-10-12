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

    sources: list[MessageSource] = Field(default_factory=list)

    embeddings: list[float]

    # Ensures relationship between sender and sender_role are maintained and enforced
    @model_validator(mode='after')
    def validate_sender(self):
        if (
            self.sender_role == 'assistant' or self.sender_role == 'system'
        ) and self.sender is not None:
            raise ValueError('System or Assistant messages cannot have a sender')

        if self.sender_role == 'user' and self.sender is None:
            raise ValueError('User messages must have a sender')

        if self.sender_role == 'user' and len(self.sources):
            raise ValueError('User messages cannot contain sources')

        return self

    class Settings:
        name = 'messages'
