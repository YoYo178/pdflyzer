from contextlib import asynccontextmanager
from fastapi import FastAPI

from backend.routes.api import router as api_router
from backend.config.db import connect_db

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Connect to MongoDB
    await connect_db()

    yield

# Create the FastAPI App instance
app = FastAPI(lifespan=lifespan)

# Attach API router
app.include_router(api_router)
