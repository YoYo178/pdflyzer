from arq import ArqRedis, create_pool
from arq.connections import RedisSettings


async def create_queue() -> ArqRedis:
    return await create_pool(RedisSettings(host='localhost', port=6379))
