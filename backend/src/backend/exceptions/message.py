from backend.exceptions.base import AppException

class MessageNotFound(AppException):
    status_code = 404 # Not Found
    detail = "The specified message was not found"