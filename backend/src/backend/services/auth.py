from datetime import datetime, UTC
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
from arq import ArqRedis
from beanie import PydanticObjectId

import backend.exceptions.auth as auth_exceptions
from backend.models.user import User
from backend.repositories.user import UserRepository
from backend.schemas.auth import LoginRequest, RegisterRequest, TokensData, EmailVerificationRequest, ResendVerificationRequest
from backend.services.verification import VerificationService
from backend.types.auth import VerifiedEmailData
from backend.utils.jwt import generate_access_token, generate_refresh_token


class AuthService:
    def __init__(
        self,
        user_repository: UserRepository,
        hasher: PasswordHasher,
        verification_service: VerificationService,
        queue: ArqRedis,
    ):
        self.hasher = hasher
        self.user_repository = user_repository
        self.verification_service = verification_service
        self.queue = queue

    async def create_user(self, register_data: RegisterRequest) -> PydanticObjectId:
        email_exists = await self.user_repository.find_by_email(register_data.email)

        if email_exists:
            raise auth_exceptions.EmailExists()

        username_exists = await self.user_repository.find_by_username(
            register_data.username
        )

        if username_exists:
            raise auth_exceptions.UsernameExists()

        password_hash = self.hasher.hash(register_data.password)

        user = User(
            name=register_data.name,
            email=register_data.email,
            username=register_data.username,
            password_hash=password_hash,
        )
        
        await self.user_repository.create(user)
        
        verification_object = await self.verification_service.generate_object(
            PydanticObjectId(user.id)
        )

        await self.queue.enqueue_job(
            'send_verification_email',
            str(user.id),
            str(verification_object.code),
            verification_object.token,
        )

        return PydanticObjectId(user.id)

    async def handle_login(self, login_data: LoginRequest) -> TokensData:

        if '@' in login_data.login:
            user = await self.user_repository.find_by_email(login_data.login)
        else:
            user = await self.user_repository.find_by_username(login_data.login)

        if not user:
            raise auth_exceptions.InvalidLogin()
        
        if not user.is_verified:
            raise auth_exceptions.UnverifiedUser()

        try:
            self.hasher.verify(user.password_hash, login_data.password)

            access_token = generate_access_token(str(user.id))
            refresh_token = generate_refresh_token(str(user.id))

            return TokensData(
                access_token=access_token,
                refresh_token=refresh_token,
            )
        except VerifyMismatchError as err:
            raise auth_exceptions.InvalidLogin() from err

    async def verify_email(self, verification_data: EmailVerificationRequest) -> VerifiedEmailData:
        data = verification_data.data
        method = verification_data.method
        user_id = verification_data.user_id
        
        user = await self.user_repository.find_by_id(user_id)
        
        if user is None:
            raise auth_exceptions.UserNotFound()
        
        if user.is_verified:
            raise auth_exceptions.UserAlreadyVerified()
        
        verification_object = await self.verification_service.get_by_user_id(user_id)
        
        if verification_object is None:
            raise auth_exceptions.InvalidVerificationRequest()
        
        match(method):
            case 'code':
                if data != verification_object.code:
                    raise auth_exceptions.InvalidVerificationCode
                
                await self.user_repository.update(PydanticObjectId(user.id), {
                    "is_verified": True,
                    "verified_at": datetime.now(UTC)
                })
            case 'token':
                is_token_valid = self.hasher.verify(verification_object.token, data)
                if not is_token_valid:
                    raise auth_exceptions.InvalidVerificationToken
                
                await self.user_repository.update(PydanticObjectId(user.id), {
                    "is_verified": True,
                    "verified_at": datetime.now(UTC)
                })
            case _:
                raise auth_exceptions.UnknownVerificationMethod()
        
        await self.verification_service.cleanup(PydanticObjectId(user.id))

        access_token = generate_access_token(str(user.id))
        refresh_token = generate_refresh_token(str(user.id))

        return VerifiedEmailData(
            user,
            tokens = TokensData(
                access_token=access_token,
                refresh_token=refresh_token,
            )
        )
    
    async def resend_email(self, resend_data: ResendVerificationRequest) -> None:
        user_id = resend_data.user_id
        
        user = await self.user_repository.find_by_id(user_id)
        
        if user is None:
            raise auth_exceptions.UserNotFound()
        
        if user.is_verified:
            raise auth_exceptions.UserAlreadyVerified()
        
        verification_object = await self.verification_service.generate_object(
            PydanticObjectId(user.id)
        )

        await self.queue.enqueue_job(
            'send_verification_email',
            str(user.id),
            str(verification_object.code),
            verification_object.token,
        )