import asyncio
import contextlib

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from redis.asyncio import Redis

from backend.config.cors import CORS_CONFIG
from backend.core.database import connect_db
from backend.core.events.subscriber import redis_event_listener
from backend.core.queue import create_queue
from backend.exceptions.base import AppException
from backend.routes.api import router as api_router
from backend.routes.ws import router as ws_router
from backend.settings import settings
from backend.sockets import register_socket_handlers
from backend.utils.document import prune_orphaned_documents


@contextlib.asynccontextmanager
async def lifespan(app: FastAPI):
    # Setup a redis instance of pub/sub managing
    redis = Redis(
        host=settings.redis_host, port=settings.redis_port, decode_responses=True
    )

    # Attach the subscriber for listening to published events
    listener_task = asyncio.create_task(redis_event_listener(redis))

    # Connect to MongoDB
    await connect_db()

    # Prune orphaned documents if any (StoredDocument objects that no longer have any ChatDocument pointing to them)
    # Usually this shouldn't be the case, but who knows
    await prune_orphaned_documents()

    # Create another redis instance through ARQ for queueing jobs and attach it to the application
    app.state.queue = await create_queue()

    register_socket_handlers()

    # Proceed with handling requests
    yield

    # Cleanup redis pub/sub subscriber
    listener_task.cancel()

    with contextlib.suppress(asyncio.CancelledError):
        await listener_task

    # Close redis pub/sub connection
    await redis.aclose()

    # Close the ARQ redis connection
    await app.state.queue.close()


# Create the FastAPI App instance
app = FastAPI(lifespan=lifespan)

# Attach CORS Middleware
app.add_middleware(CORSMiddleware, **CORS_CONFIG)

# Attach API router
app.include_router(api_router)

# Attach WebSocket router
app.include_router(ws_router)


# Add an exception handler
@app.exception_handler(AppException)
async def app_exception_handler(_, exc: AppException):
    return JSONResponse(
        status_code=exc.status_code,
        content={'status': False, 'message': exc.detail, 'data': None},
    )
