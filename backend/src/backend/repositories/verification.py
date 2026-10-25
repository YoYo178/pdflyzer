from beanie import PydanticObjectId

from backend.models.verification import Verification

class VerificationRepository:
    async def find_one(self, user_id: PydanticObjectId) -> Verification | None:
        return await Verification.find_one(
            Verification.user == user_id
        )
        
    async def create(self, document: Verification) -> Verification:
        await document.save()
        return document
    
    async def delete_many(self, user_id: PydanticObjectId) -> None:
        await Verification.find(
            Verification.user == user_id
        ).delete()