from backend.exceptions.base import AppException

class ChatNotFound(AppException):
    status_code = 404 # Not found
    detail = "The specified chat was not found"