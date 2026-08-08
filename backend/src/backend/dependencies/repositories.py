from fastapi import Depends

from backend.repositories.chat import ChatRepository
from backend.repositories.document import DocumentRepository
from backend.repositories.user import UserRepository

def get_user_repository() -> UserRepository:
    return UserRepository()

def get_chat_repository() -> ChatRepository:
    return ChatRepository()

def get_document_repository(
    chat_repository: ChatRepository = Depends(get_chat_repository)
) -> DocumentRepository:
    return DocumentRepository(chat_repository)