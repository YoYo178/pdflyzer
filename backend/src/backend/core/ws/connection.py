from collections import defaultdict
from fastapi import WebSocket

class WebSocketConnectionManager:
    def __init__(self) -> None:
        self.connections: dict[str, set[WebSocket]] = defaultdict(set)
    
    async def connect(self, chat_id: str, websocket: WebSocket) -> None:
        await websocket.accept()
        
        self.connections[chat_id].add(websocket)
    
    def disconnect(self, chat_id: str, websocket: WebSocket) -> None:
        connections = self.connections.get(chat_id)
        
        if not connections:
            return

        connections.discard(websocket)
        
        if not connections:
            del self.connections[chat_id]
    
    async def send(self, websocket: WebSocket, data: dict) -> None:
        await websocket.send_json(data)
    
    async def broadcast(self, chat_id: str, data: dict) -> None:
        connections = self.connections.get(chat_id, set())
        
        for websocket in connections.copy():
            try:
                await websocket.send_json(data)
            except Exception:
                self.disconnect(chat_id, websocket)