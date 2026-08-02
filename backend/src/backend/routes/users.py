from fastapi import APIRouter
import backend.controllers.users as users_controller

# Create Router
router = APIRouter(prefix="/users", tags=["Users"])

# Define root endpoint
@router.get("/")
def get_users():
    return users_controller.get_users()

@router.get("/{user_id}")
def get_user(user_id: str):
    return users_controller.get_user(user_id)
