from arq import ArqRedis
from fastapi import Depends
from argon2 import PasswordHasher

from backend.core.embedding import EmbeddingService
from backend.core.retrieval import RetrievalService
from backend.core.storage import StorageService

from backend.services.auth import AuthService
from backend.services.chat import ChatService
from backend.services.document import DocumentService
from backend.services.message import MessageService
from backend.services.user import UserService

from backend.repositories.chat import ChatRepository
from backend.repositories.document import DocumentRepository
from backend.repositories.message import MessageRepository
from backend.repositories.user import UserRepository

from backend.dependencies.core import get_storage_service, get_queue, get_embedding_service, get_retrieval_service
from backend.dependencies.repositories import get_user_repository, get_document_repository, get_chat_repository, get_message_repository
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
    document_repository: DocumentRepository = Depends(get_document_repository),
    storage: StorageService = Depends(get_storage_service),
    queue: ArqRedis = Depends(get_queue)
) -> DocumentService:
    return DocumentService(
        document_repository,
        storage,
        queue
    )

def get_chat_service(
    chat_repository: ChatRepository = Depends(get_chat_repository),
) -> ChatService:
    return ChatService(chat_repository)

def get_message_service(
    message_repository: MessageRepository = Depends(get_message_repository),
    document_repository: DocumentRepository = Depends(get_document_repository),
    embedding_service: EmbeddingService = Depends(get_embedding_service),
    retrieval_service: RetrievalService = Depends(get_retrieval_service)
) -> MessageService:
    return MessageService(
        message_repository,
        document_repository,
        embedding_service,
        retrieval_service,
    )