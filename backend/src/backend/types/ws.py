from dataclasses import dataclass
from fastapi import WebSocket
from beanie import PydanticObjectId

from backend.core.ws.connection import WebSocketConnectionManager

from backend.models.user import User

@dataclass
class WebSocketContext:
    websocket: WebSocket
    
    user: User
    chat_id: PydanticObjectId
    
    connection_manager: WebSocketConnectionManager