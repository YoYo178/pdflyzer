from collections.abc import Callable
from typing import Awaitable, Any

from backend.types.events import ClientToServerEvents
from backend.types.ws import WebSocketContext

SocketHandler = Callable[..., Awaitable[None]]

class WebSocketEventDispatcher:
    def __init__(self):
        self.handlers: dict[ClientToServerEvents, SocketHandler] = {}

    def register_handler(self, event: ClientToServerEvents, handler: SocketHandler):
        if event in self.handlers:
            raise ValueError(f"Handler already registered for '{event}'")
        
        self.handlers[event] = handler

    async def dispatch(self, event: ClientToServerEvents, ctx: WebSocketContext, data: Any):
        handler = self.handlers.get(event)
        
        if not handler:
            raise ValueError(f"Unknown websocket event: '{event}'")
        
        await handler(ctx, data)
        
websocket_event_dispatcher = WebSocketEventDispatcher()