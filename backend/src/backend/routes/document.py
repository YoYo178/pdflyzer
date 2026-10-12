from beanie import PydanticObjectId
from fastapi import APIRouter, Depends, UploadFile, status

from backend.dependencies.auth import get_current_user
from backend.dependencies.services import get_document_service
from backend.models.user import User
from backend.services.document import DocumentService

# Document router
documents_router = APIRouter(prefix='/documents', tags=['Documents'])


@documents_router.get('/{document_id}')
async def handle_get_document(
    document_id: PydanticObjectId,
    current_user: User = Depends(get_current_user),
    service: DocumentService = Depends(get_document_service),
):
    return await service.get_document_by_id(
        PydanticObjectId(current_user.id), document_id
    )


@documents_router.delete('/{document_id}', status_code=status.HTTP_204_NO_CONTENT)
async def handle_delete_document(
    document_id: PydanticObjectId,
    current_user: User = Depends(get_current_user),
    service: DocumentService = Depends(get_document_service),
):
    await service.delete_document(PydanticObjectId(current_user.id), document_id)


# Chat document router
chat_documents_router = APIRouter(prefix='/chats', tags=['Documents'])


@chat_documents_router.post('/{chat_id}/documents', status_code=status.HTTP_201_CREATED)
async def upload_document(
    chat_id: PydanticObjectId,
    files: list[UploadFile],
    current_user: User = Depends(get_current_user),
    service: DocumentService = Depends(get_document_service),
):
    return await service.upload_document(
        PydanticObjectId(current_user.id), chat_id, files
    )


@chat_documents_router.get('/{chat_id}/documents')
async def get_all_documents(
    chat_id: PydanticObjectId,
    current_user: User = Depends(get_current_user),
    service: DocumentService = Depends(get_document_service),
):
    return await service.get_all_documents(PydanticObjectId(current_user.id), chat_id)


@chat_documents_router.get('/{chat_id}/documents/{document_id}')
async def get_document_in_chat(
    chat_id: PydanticObjectId,
    document_id: PydanticObjectId,
    current_user: User = Depends(get_current_user),
    service: DocumentService = Depends(get_document_service),
):
    return await service.get_document_in_chat(
        PydanticObjectId(current_user.id), chat_id, document_id
    )


@chat_documents_router.delete(
    '/{chat_id}/documents/{document_id}', status_code=status.HTTP_204_NO_CONTENT
)
async def delete_document_in_chat(
    chat_id: PydanticObjectId,
    document_id: PydanticObjectId,
    current_user: User = Depends(get_current_user),
    service: DocumentService = Depends(get_document_service),
):
    await service.delete_document_in_chat(
        PydanticObjectId(current_user.id), chat_id, document_id
    )
