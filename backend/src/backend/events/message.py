from typing import Literal, TypedDict

from backend.types.events import ServerToClientEvents

class MessageCreatedBody(TypedDict):
    sender_id: str
    sender_role: Literal['user', 'assistant', 'system']
    
    content: str
    
def event_message_created(data: MessageCreatedBody):
    return {
        "type": ServerToClientEvents.CHAT_MESSAGE_CREATED,
        "data": {
            "sender_id": data["sender_id"],
            "sender_role": data["sender_role"],
            
            "content": data["content"]
        }
    }