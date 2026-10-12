from backend.core.ws.connection import (
    WebSocketConnectionManager,
    websocket_connection_manager,
)
from backend.core.ws.dispatcher import (
    WebSocketEventDispatcher,
    websocket_event_dispatcher,
)


def get_websocket_connection_manager() -> WebSocketConnectionManager:
    return websocket_connection_manager


def get_websocket_event_dispatcher() -> WebSocketEventDispatcher:
    return websocket_event_dispatcher
