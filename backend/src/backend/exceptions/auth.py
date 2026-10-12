from backend.exceptions.base import AppException


class EmailExists(AppException):
    status_code = 409  # Conflict
    detail = 'An account already exists with the provided email!'


class UsernameExists(AppException):
    status_code = 409  # Conflict
    detail = 'That username is taken, please try another.'


class InvalidLogin(AppException):
    status_code = 400  # Bad request
    detail = 'Invalid login or Password'


class UnauthorizedUser(AppException):
    status_code = 401  # Unauthorized
    detail = 'User is not authorized to perform this action'
