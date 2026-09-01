from dataclasses import dataclass
from fastapi import WebSocket
from beanie import PydanticObjectId

from backend.core.ws.connection import WebSocketConnectionManager

from backend.services.chat import ChatService
from backend.services.message import MessageService

from backend.models.user import User

@dataclass
class WebSocketContext:
    websocket: WebSocket
    
    user: User
    chat_id: PydanticObjectId
    
    connection_manager: WebSocketConnectionManager
    
    chat_service: ChatService
    message_service: MessageService