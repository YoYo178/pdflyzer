from dataclasses import dataclass

from beanie import PydanticObjectId
from fastapi import WebSocket

from backend.models.user import User
from backend.services.chat import ChatService
from backend.services.message import MessageService


@dataclass
class WebSocketContext:
    websocket: WebSocket
    
    user: User
    chat_id: PydanticObjectId
    
    chat_service: ChatService
    message_service: MessageService