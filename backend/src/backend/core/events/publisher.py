import json

from arq.connections import ArqRedis

from backend.config.events import EVENT_CHANNEL


async def publish_event(
    redis: ArqRedis,
    event: dict,
) -> None:
    await redis.publish(
        EVENT_CHANNEL,
        json.dumps(event),
    )
