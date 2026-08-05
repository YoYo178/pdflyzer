from beanie import PydanticObjectId

from backend.models.user import User
from backend.schemas.user import UserUpdate
from backend.utils.user import get_user_safe

class UserService:
    def __init__(self):
        pass

    # Gets all users
    async def get_users(self):
        return await User.find_all().to_list()

    # Gets a specific user by ID
    async def get_user(self, user_id: PydanticObjectId):
        return await get_user_safe(user_id)

    # Deletes a user by ID
    async def delete_user(self, user_id: PydanticObjectId):
        user = await get_user_safe(user_id)

        await user.delete()

    # Updates a user by ID
    async def update_user(self, user_id: PydanticObjectId, user_data: UserUpdate):
        user = await get_user_safe(user_id)

        updates = user_data.model_dump(exclude_unset=True)

        for key, value in updates.items():
            setattr(user, key, value)

        await user.save()

        return user

def get_user_service():
    return UserService()