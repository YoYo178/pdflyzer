from beanie import PydanticObjectId
from fastapi import APIRouter, Depends, status

from backend.dependencies.auth import get_current_user
from backend.dependencies.services import get_chat_service
from backend.models.user import User
from backend.schemas.chat import ChatMeta
from backend.services.chat import ChatService

router = APIRouter(prefix="/chats", tags=["Chats"])

@router.get("/")
async def get_all_chats(
    current_user: User = Depends(get_current_user),
    service: ChatService = Depends(get_chat_service),
):
    return await service.get_all_chats(
        PydanticObjectId(current_user.id),
    )

@router.get("/{chat_id}")
async def get_chat_by_id(
    chat_id: PydanticObjectId,
    current_user: User = Depends(get_current_user),
    service: ChatService = Depends(get_chat_service),
):
    return await service.get_chat_by_id(
        PydanticObjectId(current_user.id),
        chat_id,
    )

@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_new_chat(
    current_user: User = Depends(get_current_user),
    service: ChatService = Depends(get_chat_service),
):
    return await service.create_new_chat(PydanticObjectId(current_user.id))

@router.patch("/{chat_id}")
async def update_chat(
    chat_id: PydanticObjectId,
    update_data: ChatMeta,
    current_user: User = Depends(get_current_user),
    service: ChatService = Depends(get_chat_service),
):
    return await service.update_chat(PydanticObjectId(current_user.id), chat_id, update_data)

@router.delete("/{chat_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_chat(
    chat_id: PydanticObjectId,
    current_user: User = Depends(get_current_user),
    service: ChatService = Depends(get_chat_service),
):
    await service.delete_chat(PydanticObjectId(current_user.id), chat_id)