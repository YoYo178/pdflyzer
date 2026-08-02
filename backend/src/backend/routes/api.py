from fastapi import APIRouter
from backend.routes.users import router as users_router

# Create API Router
router = APIRouter(prefix="/api", tags=["API"])

# Define /api/ controller
@router.get("/")
def get_api_root():
    return { "message": "API route working!", "data": None }

# Attach Users Controller
router.include_router(users_router)
