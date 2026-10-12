from beanie import PydanticObjectId
from fastapi import APIRouter, Depends
from fastapi.sse import EventSourceResponse

from backend.dependencies.auth import get_current_user
from backend.dependencies.services import get_message_service
from backend.models.user import User
from backend.schemas.message import MessagePayload, MessageUpdatePayload, MessageView
from backend.services.message import MessageService

chat_messages_router = APIRouter(prefix='/chats', tags=['Messages'])


@chat_messages_router.get('/{chat_id}/messages', response_model=list[MessageView])
async def get_all_messages(
    chat_id: PydanticObjectId,
    current_user: User = Depends(get_current_user),
    service: MessageService = Depends(get_message_service),
):
    return await service.get_all_messages(PydanticObjectId(current_user.id), chat_id)


@chat_messages_router.get(
    '/{chat_id}/messages/{message_id}', response_model=MessageView
)
async def get_message(
    chat_id: PydanticObjectId,
    message_id: PydanticObjectId,
    current_user: User = Depends(get_current_user),
    service: MessageService = Depends(get_message_service),
):
    return await service.get_message_by_id(
        PydanticObjectId(current_user.id), chat_id, message_id
    )


@chat_messages_router.post('/{chat_id}/messages', response_class=EventSourceResponse)
async def create_message(
    chat_id: PydanticObjectId,
    message_data: MessagePayload,
    current_user: User = Depends(get_current_user),
    service: MessageService = Depends(get_message_service),
):
    async for chunk in service.create_message(
        PydanticObjectId(current_user.id), chat_id, message_data.content
    ):
        yield chunk


@chat_messages_router.patch(
    '/{chat_id}/messages/{message_id}', response_model=MessageView
)
async def update_message(
    chat_id: PydanticObjectId,
    message_id: PydanticObjectId,
    message_data: MessageUpdatePayload,
    current_user: User = Depends(get_current_user),
    service: MessageService = Depends(get_message_service),
):
    return await service.update_mesage(
        PydanticObjectId(current_user.id), chat_id, message_id, message_data
    )


@chat_messages_router.delete('/{chat_id}/messages/{message_id}')
async def delete_message(
    chat_id: PydanticObjectId,
    message_id: PydanticObjectId,
    current_user: User = Depends(get_current_user),
    service: MessageService = Depends(get_message_service),
):
    return await service.delete_message(
        PydanticObjectId(current_user.id), chat_id, message_id
    )
