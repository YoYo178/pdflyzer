from beanie import PydanticObjectId

from backend.events.message import event_message_created
from backend.types.ws import WebSocketContext

async def handle_create_message(
    ctx: WebSocketContext,
    data: str,
):
    messages = await ctx.message_service.get_all_messages(PydanticObjectId(ctx.user.id), ctx.chat_id)
    
    await ctx.connection_manager.broadcast(
        str(ctx.chat_id),
        event_message_created({
            "sender_id": str(ctx.user.id),
            "sender_role": "user",
            "content": "test"
        })
    )