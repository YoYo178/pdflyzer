from backend.exceptions.base import AppException

class UserNotFound(AppException):
    status_code = 404 # Not Found
    detail = "User not found"

class UserConflict(AppException):
    status_code = 409 # Conflict
    detail = "User exists already"