from pydantic import BaseModel

class ChatMeta(BaseModel):
    name: str | None = None
    pinned: bool | None = None