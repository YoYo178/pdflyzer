from beanie import PydanticObjectId

from backend.exceptions.user import UserNotFound
from backend.models.user import User
from backend.schemas.user import UserCreate, UserUpdate

### Helper function to safely get a user
async def get_user_safe(user_id: PydanticObjectId):
    user = await User.get(user_id)

    if not user:
        raise UserNotFound()

    return user

# Gets all users
async def get_users():
    return await User.find_all().to_list()

# Gets a specific user by ID
async def get_user(user_id: PydanticObjectId):
    return await get_user_safe(user_id)

# Creates a new user
async def create_user(user_data: UserCreate):
    user = User(
        email=user_data.email,
        name=user_data.name,
        username=user_data.username,
        password_hash=user_data.password
    )

    await user.save()

    return user

# Deletes a user by ID
async def delete_user(user_id: PydanticObjectId):
    user = await get_user_safe(user_id)

    await user.delete()

# Updates a user by ID
async def update_user(user_id: PydanticObjectId, user_data: UserUpdate):
    user = await get_user_safe(user_id)

    updates = user_data.model_dump(exclude_unset=True)

    for key, value in updates.items():
        setattr(user, key, value)

    await user.save()

    return user