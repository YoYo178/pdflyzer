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

class UnverifiedUser(AppException):
    status_code = 401 # Unauthorized
    detail = 'User is not verified, Please verify to continue.'

class UserNotFound(AppException):
    status_code = 400 # Bad request
    detail = 'Unable to process requests at the moment, please try again later.'

class InvalidVerificationRequest(AppException):
    status_code = 400 # Bad request
    detail = 'Invalid or expired request'

class UserAlreadyVerified(AppException):
    status_code = 403 # Forbidden
    detail = 'User is already verified'

class InvalidVerificationCode(AppException):
    status_code = 400 # Bad request
    detail = 'Invalid verification code'

class InvalidVerificationToken(AppException):
    status_code = 400 # Bad request
    detail = 'Invalid verification token'

class UnknownVerificationMethod(AppException):
    status_code = 400 # Bad request
    detail = 'Unknown verification method'