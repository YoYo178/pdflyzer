from pydantic import BaseModel

class PayloadMessage(BaseModel):
    content: str