from backend.core.ws.dispatcher import websocket_event_dispatcher
from backend.sockets.message import handle_create_message
from backend.types.events import ClientToServerEvents


def register_socket_handlers():
    websocket_event_dispatcher.register_handler(
        event=ClientToServerEvents.CHAT_MESSAGE_SEND, handler=handle_create_message
    )
