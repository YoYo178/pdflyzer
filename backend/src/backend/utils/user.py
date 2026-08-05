import backend.exceptions.user as user_exceptions

from backend.models.user import User
from beanie import PydanticObjectId

### Helper function to safely get a user
async def get_user_safe(user_id: PydanticObjectId):
    user = await User.get(user_id)

    if not user:
        raise user_exceptions.UserNotFound()

    return user