from arq.connections import RedisSettings

from backend.core.database import connect_db

class WorkerSettings:
    functions = []

    redis_settings = RedisSettings(
        host="localhost",
        port=6379
    )

    @staticmethod
    async def on_startup(ctx):
        await connect_db()

    @staticmethod
    async def on_shutdown(ctx):
        pass