from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.responses import JSONResponse

from backend.core.database import connect_db
from backend.core.queue import create_queue
from backend.core.embedding import EmbeddingService

from backend.core.ws.connection import WebSocketConnectionManager

from backend.exceptions.base import AppException

from backend.routes.api import router as api_router
from backend.routes.ws import router as ws_router

from backend.sockets import register_socket_handlers

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Connect to MongoDB
    await connect_db()

    # Create a redis queue instance and attach it to the application
    app.state.queue = await create_queue()

    # Create a WebSocket connection manager instance and attach it to the application
    app.state.websocket_connection_manager = WebSocketConnectionManager()
    
    # Create the embedding service instance and attach it to the application
    app.state.embedding_service = EmbeddingService()
    
    register_socket_handlers()

    # Proceed with handling requests
    yield

    # Close the redis connection for cleanup
    await app.state.queue.close()

# Create the FastAPI App instance
app = FastAPI(lifespan=lifespan)

# Attach API router
app.include_router(api_router)

# Attach WebSocket router
app.include_router(ws_router)

# Add an exception handler
@app.exception_handler(AppException)
async def app_exception_handler(_, exc: AppException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": exc.detail
        }
    )