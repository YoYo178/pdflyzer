from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.responses import JSONResponse

from backend.core.database import connect_db
from backend.exceptions.base import AppException
from backend.routes.api import router as api_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Connect to MongoDB
    await connect_db()

    yield

# Create the FastAPI App instance
app = FastAPI(lifespan=lifespan)

# Attach API router
app.include_router(api_router)

# Add an exception handler
@app.exception_handler(AppException)
async def app_exception_handler(_, exc: AppException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": exc.detail
        }
    )