import asyncio
import json

from backend.config.events import EVENT_CHANNEL
from backend.dependencies.ws import get_websocket_connection_manager
from redis.asyncio import Redis


async def redis_event_listener(redis: Redis):
    manager = get_websocket_connection_manager()
    
    pubsub = redis.pubsub()
    
    await pubsub.subscribe(EVENT_CHANNEL)
    
    try:
        async for message in pubsub.listen():
            if message['type'] != 'message':
                continue
            
            event = json.loads(message['data'])
            
            destination = event.get('destination')
            payload = event.get('payload')

            if not destination:
                continue
            
            await manager.broadcast(
                destination,
                payload
            )

    except asyncio.CancelledError:
        raise

    finally:
        await pubsub.unsubscribe(EVENT_CHANNEL)
        await pubsub.close()