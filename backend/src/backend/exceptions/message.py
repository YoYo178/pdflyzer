from backend.exceptions.base import AppException

class MessageNotFound(AppException):
    status_code = 404 # Not Found
    detail = "The specified message was not found"

class NoDocumentFound(AppException):
    status_code = 400 # Bad request
    detail = "No documents have been uploaded to this chat, please upload one first"