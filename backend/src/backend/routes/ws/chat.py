from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from beanie import PydanticObjectId

from backend.core.ws.connection import WebSocketConnectionManager
from backend.core.ws.dispatcher import WebSocketEventDispatcher

from backend.dependencies.auth import get_current_websocket_user
from backend.dependencies.services import get_chat_service
from backend.dependencies.ws import get_websocket_connection_manager, get_websocket_event_dispatcher

from backend.models.user import User

from backend.services.chat import ChatService

from backend.types.ws import WebSocketContext

router = APIRouter(prefix="/chats", tags=["Chat WebSockets"])

@router.websocket("/{chat_id}")
async def handle_websocket_connection(
    websocket: WebSocket,
    
    chat_id: PydanticObjectId,
    chat_service: ChatService = Depends(get_chat_service),
    
    connection_manager: WebSocketConnectionManager = Depends(get_websocket_connection_manager),
    event_dispatcher: WebSocketEventDispatcher = Depends(get_websocket_event_dispatcher),
    
    current_user: User = Depends(get_current_websocket_user),
):
    # To verify chat ownership, raises an exception otherwise
    await chat_service.get_chat_by_id(PydanticObjectId(current_user.id), chat_id)
    
    # Add this socket client to our list of tracked socket connections
    await connection_manager.connect(str(chat_id), websocket)
    
    print(f"Client connected to chat '{chat_id}'")

    try:
        # Maintain a loop to keep the socket alive and listen for data
        while True:
            event = await websocket.receive_json()
            
            await event_dispatcher.dispatch(
                event=event["type"],
                ctx=WebSocketContext(
                    websocket=websocket,
                    chat_id=chat_id,
                    connection_manager=connection_manager,
                    user=current_user
                ),
                data=event["data"] or {}
            )

    except WebSocketDisconnect:
        print(f"Client disconnected from chat '{chat_id}'")
        
        connection_manager.disconnect(
            str(chat_id),
            websocket,
        )