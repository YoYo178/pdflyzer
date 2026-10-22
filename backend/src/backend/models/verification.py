from beanie import PydanticObjectId
from pymongo import ASCENDING, IndexModel

from backend.models.base import BaseTimestampDocument

class Verification(BaseTimestampDocument):
    code: str
    user: PydanticObjectId
    token: str
    
    class Settings:
        name = 'verifications'
        
        # TTL config per document
        indexes = [
            IndexModel(
                [('created_at', ASCENDING)],
                expireAfterSeconds=600 # 10 minutes
            )
        ]