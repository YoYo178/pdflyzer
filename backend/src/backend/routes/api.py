from fastapi import APIRouter

from backend.routes.auth import router as auth_router
from backend.routes.chat import router as chat_router
from backend.routes.document import documents_router, chat_documents_router
from backend.routes.user import router as users_router

# Create API Router
router = APIRouter(prefix="/api", tags=["API"])

# API Test route
@router.get("/")
def get_api_root():
    return { "message": "API route working!", "data": None }

# Attach Auth Router
router.include_router(auth_router)

# Attach Chat Router(s)
router.include_router(chat_router)
router.include_router(chat_documents_router)

# Attach Documents Router
router.include_router(documents_router)

# Attach Users Router
router.include_router(users_router)