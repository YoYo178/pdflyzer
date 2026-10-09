from beanie import PydanticObjectId

from backend.models.base import BaseTimestampDocument


class Chat(BaseTimestampDocument):
    owner_id: PydanticObjectId
    name: str
    pinned: bool = False

    class Settings:
        name = "chats"
