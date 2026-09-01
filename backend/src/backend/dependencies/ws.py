from fastapi import WebSocket

from backend.core.ws.connection import WebSocketConnectionManager
from backend.core.ws.dispatcher import websocket_event_dispatcher, WebSocketEventDispatcher

def get_websocket_connection_manager(websocket: WebSocket) -> WebSocketConnectionManager:
    return websocket.app.state.websocket_connection_manager

def get_websocket_event_dispatcher() -> WebSocketEventDispatcher:
    return websocket_event_dispatcher