from fastapi import APIRouter

from backend.routes.auth import router as auth_router
from backend.routes.chat import router as chat_router
from backend.routes.document import router as documents_router
from backend.routes.user import router as users_router

# Create API Router
router = APIRouter(prefix="/api", tags=["API"])

# API Test route
@router.get("/")
def get_api_root():
    return { "message": "API route working!", "data": None }

# Attach Auth Controller
router.include_router(auth_router)

# Attach Chat Controller
router.include_router(chat_router)

# Attach Documents Controller
router.include_router(documents_router)

# Attach Users Controller
router.include_router(users_router)