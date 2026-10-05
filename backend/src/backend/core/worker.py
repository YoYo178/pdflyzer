from arq.connections import RedisSettings

from backend.settings import settings

from backend.core.database import connect_db

from backend.jobs.document import process_document
from backend.jobs.llm import generate_chat_title

class WorkerSettings:
    functions = [
        process_document,
        generate_chat_title
    ]

    redis_settings = RedisSettings(
        host=settings.redis_host,
        port=settings.redis_port,
    )

    @staticmethod
    async def on_startup(ctx):
        await connect_db()

    @staticmethod
    async def on_shutdown(ctx):
        pass