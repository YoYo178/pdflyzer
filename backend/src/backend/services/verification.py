import secrets
from argon2 import PasswordHasher
from beanie import PydanticObjectId

from backend.models.verification import Verification

from backend.repositories.verification import VerificationRepository

from backend.types.verification import VerificationMeta

class VerificationService:
    def __init__(
        self,
        verification_repository: VerificationRepository,
        password_hasher: PasswordHasher
    ):
        self.repo = verification_repository
        self.hasher = password_hasher
    
    async def get_by_user_id(self, user_id: PydanticObjectId) -> Verification | None:
        return await self.repo.find_one(user_id)
    
    async def generate_object(self, user_id: PydanticObjectId) -> VerificationMeta:
        token = secrets.token_hex(32)
        hashed_token = self.hasher.hash(token)
        
        code = ''.join(secrets.choice('0123456789') for _ in range(6))
        
        verification_object = Verification(
            code=code,
            token=hashed_token,
            user=user_id
        )
        
        await self.repo.create(verification_object)
        
        return VerificationMeta(
            code,
            token
        )
    
    async def cleanup(self, user_id: PydanticObjectId):
        await self.repo.delete_many(user_id)