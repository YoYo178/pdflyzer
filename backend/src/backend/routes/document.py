from beanie import PydanticObjectId
from fastapi import APIRouter, Depends, status

from backend.models.user import User

from backend.dependencies.auth import get_current_user
from backend.dependencies.services import get_document_service
from backend.services.document import DocumentService

router = APIRouter(prefix="/documents", tags=["Documents"])

@router.get("/{document_id}")
async def handle_get_document(
    document_id: PydanticObjectId,
    service: DocumentService = Depends(get_document_service),
    current_user: User = Depends(get_current_user)
):
    return await service.get_document_by_id(PydanticObjectId(current_user.id), document_id)

@router.delete("/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
async def handle_delete_document(
    document_id: PydanticObjectId,
    service: DocumentService = Depends(get_document_service),
    current_user: User = Depends(get_current_user)
):
    return await service.delete_document(PydanticObjectId(current_user.id), document_id)