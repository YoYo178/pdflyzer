from typing import Literal

from beanie import PydanticObjectId
from pydantic import BaseModel

from backend.models.message import MessageSource


class MessagePayload(BaseModel):
    content: str

class MessageUpdatePayload(BaseModel):
    rating: Literal['up', 'down'] | None

class MessageView(BaseModel):
    id: PydanticObjectId
    chat_id: PydanticObjectId
    
    sender_id: PydanticObjectId | None
    sender_role: Literal['user', 'assistant', 'system']
    
    content: str
    rating: Literal['up', 'down'] | None
    
    sources: list[MessageSource]