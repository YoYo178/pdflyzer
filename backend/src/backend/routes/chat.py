from fastapi import APIRouter, Depends
from beanie import PydanticObjectId

from backend.dependencies.auth import get_current_user
from backend.dependencies.services import get_chat_service

from backend.models.user import User
from backend.services.chat import ChatService
from backend.schemas.chat import ChatMeta

router = APIRouter(prefix="/chats", tags=["Chats"])

# Chat Routes
@router.get("/")
async def get_all_chats(
    service: ChatService = Depends(get_chat_service),
    current_user: User = Depends(get_current_user)
):
    return await service.get_all_chats(PydanticObjectId(current_user.id))

@router.get("/{chat_id}")
async def get_chat_by_id(
    chat_id: PydanticObjectId,
    service: ChatService = Depends(get_chat_service),
    current_user: User = Depends(get_current_user)
):
    return await service.get_chat_by_id(
        PydanticObjectId(current_user.id),
        chat_id
    )

@router.post("/")
async def create_new_chat(
    chat_data: ChatMeta,
    service: ChatService = Depends(get_chat_service),
    current_user: User = Depends(get_current_user)
):
    return await service.create_new_chat(
        chat_data,
        PydanticObjectId(current_user.id)
    )

@router.patch("/{chat_id}")
async def update_chat(
    chat_id: PydanticObjectId,
    update_data: ChatMeta,
    service: ChatService = Depends(get_chat_service),
    current_user: User = Depends(get_current_user)
):
    return await service.update_chat(
        PydanticObjectId(current_user.id),
        chat_id,
        update_data
    )

@router.delete("/{chat_id}")
async def delete_chat(
    chat_id: PydanticObjectId,
    service: ChatService = Depends(get_chat_service),
    current_user: User = Depends(get_current_user)
):
    return await service.delete_chat(
        PydanticObjectId(current_user.id),
        chat_id
    )

# Chat Document routes
@router.post("/{chat_id}/documents")
async def upload_document(
    chat_id: PydanticObjectId,
    service: ChatService = Depends(get_chat_service),
    current_user: User = Depends(get_current_user)
):
    return await service.upload_document(PydanticObjectId(current_user.id), chat_id, {})

@router.get("/{chat_id}/documents")
async def get_all_documents(
    chat_id: PydanticObjectId,
    service: ChatService = Depends(get_chat_service),
    current_user: User = Depends(get_current_user)
):
    return await service.get_all_documents(PydanticObjectId(current_user.id), chat_id)