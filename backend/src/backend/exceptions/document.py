from backend.exceptions.base import AppException


class DocumentNotFound(AppException):
    status_code = 404  # Not found
    detail = 'The specified document was not found'


class DocumentAlreadyExists(AppException):
    status_code = 409  # Conflict
    detail = 'The document you are trying to upload already exists'


class DocumentLimitReached(AppException):
    status_code = 403  # Forbidden
    detail = 'Max limit has been reached for storing documents on this chat.'
