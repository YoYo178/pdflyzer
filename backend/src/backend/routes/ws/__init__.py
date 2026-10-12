from fastapi import APIRouter, Depends

from backend.dependencies.auth import get_current_websocket_user
from backend.routes.ws.chat import router as chat_websockets_router

router = APIRouter(prefix='/ws', dependencies=[Depends(get_current_websocket_user)])

router.include_router(chat_websockets_router)
