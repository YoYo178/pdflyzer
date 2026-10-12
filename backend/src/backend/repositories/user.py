from beanie import PydanticObjectId

from backend.models.user import User


class UserRepository:
    async def find_all(self) -> list[User]:
        return await User.find_all().to_list()

    async def find_by_id(self, user_id: PydanticObjectId) -> User | None:
        return await User.get(user_id)

    async def find_by_email(self, email: str) -> User | None:
        return await User.find_one({'email': email})

    async def find_by_username(self, username: str) -> User | None:
        return await User.find_one({'username': username})

    async def create(self, user: User) -> User:
        await user.save()

        return user

    async def update(self, user_id: PydanticObjectId, update_data: dict) -> User | None:
        user = await self.find_by_id(user_id)

        if not user:
            return None

        for key, value in update_data.items():
            setattr(user, key, value)

        await user.save()

        return user

    async def delete(self, user_id: PydanticObjectId) -> User | None:
        user = await self.find_by_id(user_id)

        if not user:
            return None

        await user.delete()

        return user
