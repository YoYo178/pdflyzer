from beanie import PydanticObjectId
from backend.models.base import BaseTimestampDocument

class Chat(BaseTimestampDocument):
    owner_id: PydanticObjectId
    name: str

    class Settings:
        name = "chats"
