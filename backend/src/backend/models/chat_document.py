from beanie import PydanticObjectId
from backend.models.base import BaseTimestampDocument

class ChatDocument(BaseTimestampDocument):
    chat_id: PydanticObjectId
    filename: str
    size: int
    mime_type: str

    status: str

    class Settings:
        name = "documents"