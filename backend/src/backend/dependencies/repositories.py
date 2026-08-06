from backend.repositories.user import UserRepository

def get_user_repository() -> UserRepository:
    return UserRepository()