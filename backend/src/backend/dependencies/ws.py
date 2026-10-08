from backend.core.ws.connection import websocket_connection_manager, WebSocketConnectionManager
from backend.core.ws.dispatcher import websocket_event_dispatcher, WebSocketEventDispatcher

def get_websocket_connection_manager() -> WebSocketConnectionManager:
    return websocket_connection_manager

def get_websocket_event_dispatcher() -> WebSocketEventDispatcher:
    return websocket_event_dispatcher