from arq.connections import RedisSettings

from backend.core.database import connect_db
from backend.jobs.document import process_document

class WorkerSettings:
    functions = [
        process_document
    ]

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