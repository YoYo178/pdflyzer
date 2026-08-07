from beanie import PydanticObjectId
from fastapi import APIRouter, Depends

from backend.models.user import User

from backend.dependencies.auth import get_current_user
from backend.dependencies.services import get_document_service
from backend.services.document import DocumentService

router = APIRouter(prefix="/documents", tags=["Documents"])

@router.delete("/{document_id}")
async def handle_documents_get(
    document_id: PydanticObjectId,
    service: DocumentService = Depends(get_document_service),
    current_user: User = Depends(get_current_user)
):
    return await service.delete_document(PydanticObjectId(current_user.id), document_id)