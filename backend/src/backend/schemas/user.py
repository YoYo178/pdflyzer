from beanie import PydanticObjectId
from pydantic import BaseModel, EmailStr

# The base user schema
class UserBase(BaseModel):
    name: str
    username: str
    email: EmailStr

# The user schema for a new user creation
class UserCreate(UserBase):
    password: str

# The user schema received on a user update request
class UserUpdate(BaseModel):
    name: str | None = None
    username: str | None = None
    email: EmailStr | None = None

# The user schema provided to other users
class UserPublic(BaseModel):
    id: PydanticObjectId

    name: str
    username: str

# The user schema provided to the user itself
class UserSelf(UserPublic):
    email: EmailStr