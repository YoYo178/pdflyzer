from typing import ClassVar

from arq.connections import RedisSettings

from backend.core.database import connect_db
from backend.jobs.document import process_document
from backend.jobs.llm import generate_chat_title
from backend.jobs.mail import send_verification_email
from backend.settings import settings


class WorkerSettings:
    functions: ClassVar[list] = [
        process_document,
        generate_chat_title,
        send_verification_email,
    ]

    redis_settings: ClassVar[RedisSettings] = RedisSettings(
        host=settings.redis_host,
        port=settings.redis_port,
    )

    @staticmethod
    async def on_startup(ctx):  # noqa: ARG004
        await connect_db()
