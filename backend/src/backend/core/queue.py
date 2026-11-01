from arq import ArqRedis, create_pool
from arq.connections import RedisSettings

from backend.settings import settings

async def create_queue() -> ArqRedis:
    return await create_pool(RedisSettings.from_dsn(settings.redis_url))
