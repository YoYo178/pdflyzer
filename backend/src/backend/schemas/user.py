from datetime import datetime
from beanie import PydanticObjectId
from pydantic import BaseModel, EmailStr


# The base user schema
class UserBase(BaseModel):
    name: str
    username: str
    email: EmailStr


# The user schema received on a user update request
class UserUpdate(BaseModel):
    name: str | None = None
    username: str | None = None
    email: EmailStr | None = None


# The user schema provided to the user itself
class UserSelf(BaseModel):
    id: PydanticObjectId

    name: str
    username: str
    email: EmailStr
    
    created_at: datetime
    updated_at: datetime