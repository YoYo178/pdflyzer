from arq import ArqRedis
from fastapi import Depends
from argon2 import PasswordHasher

from backend.core.storage import StorageService

from backend.services.auth import AuthService
from backend.services.chat import ChatService
from backend.services.document import DocumentService
from backend.services.user import UserService

from backend.repositories.chat import ChatRepository
from backend.repositories.document import DocumentRepository
from backend.repositories.user import UserRepository

from backend.dependencies.core import get_storage_service, get_queue
from backend.dependencies.repositories import get_user_repository, get_document_repository, get_chat_repository
from backend.dependencies.hasher import get_password_hasher

def get_auth_service(
    user_repository: UserRepository = Depends(get_user_repository),
    password_hasher: PasswordHasher = Depends(get_password_hasher)
) -> AuthService:
    return AuthService(
        user_repository=user_repository,
        hasher=password_hasher
    )

def get_user_service(
    user_repository: UserRepository = Depends(get_user_repository)
) -> UserService:
    return UserService(user_repository)

def get_document_service(
    document_repository: DocumentRepository = Depends(get_document_repository)
) -> DocumentService:
    return DocumentService(document_repository)

def get_chat_service(
    chat_repository: ChatRepository = Depends(get_chat_repository),
    document_repository: DocumentRepository = Depends(get_document_repository),
    storage: StorageService = Depends(get_storage_service),
    queue: ArqRedis = Depends(get_queue)
) -> ChatService:
    return ChatService(
        chat_repository,
        document_repository,
        storage,
        queue
    )