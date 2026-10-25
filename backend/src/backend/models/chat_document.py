from beanie import PydanticObjectId

from backend.models.base import BaseTimestampDocument


class ChatDocument(BaseTimestampDocument):
    chat: PydanticObjectId
    stored_document: PydanticObjectId

    class Settings:
        name = 'chat_documents'
