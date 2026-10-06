from beanie import PydanticObjectId

from backend.events.chat import (
    event_chat_stream_begin,
    event_chat_stream_chunk,
    event_chat_stream_end,
)
from backend.types.ws import WebSocketContext

async def handle_create_message(
    ctx: WebSocketContext,
    data: str,
):
    chat_id = str(ctx.chat_id)
    
    response_generator = ctx.message_service.create_message(
        PydanticObjectId(ctx.user.id),
        ctx.chat_id,
        data
    )
    
    await ctx.connection_manager.broadcast(
        chat_id,
        event_chat_stream_begin()
    )
    
    async for chunk in response_generator:
        await ctx.connection_manager.broadcast(
            chat_id,
            event_chat_stream_chunk(chunk)
        )
    
    await ctx.connection_manager.broadcast(
        chat_id,
        event_chat_stream_end()
    )