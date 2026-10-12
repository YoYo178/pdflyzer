from argon2 import PasswordHasher
from arq import ArqRedis
from fastapi import Depends

from backend.core.embedding import EmbeddingService
from backend.core.llm import LLMService
from backend.core.retrieval import RetrievalService
from backend.core.storage import StorageService
from backend.dependencies.core import (
    get_embedding_service,
    get_llm_service,
    get_queue,
    get_retrieval_service,
    get_storage_service,
)
from backend.dependencies.hasher import get_password_hasher
from backend.dependencies.repositories import (
    get_chat_repository,
    get_document_chunk_repository,
    get_document_repository,
    get_message_repository,
    get_stored_document_repository,
    get_user_repository,
)
from backend.repositories.chat import ChatRepository
from backend.repositories.document import DocumentRepository
from backend.repositories.document_chunk import DocumentChunkRepository
from backend.repositories.message import MessageRepository
from backend.repositories.stored_document import StoredDocumentRepository
from backend.repositories.user import UserRepository
from backend.services.auth import AuthService
from backend.services.chat import ChatService
from backend.services.document import DocumentService
from backend.services.message import MessageService
from backend.services.user import UserService


def get_auth_service(
    user_repository: UserRepository = Depends(get_user_repository),
    password_hasher: PasswordHasher = Depends(get_password_hasher)
) -> AuthService:
    return AuthService(
        user_repository=user_repository,
        hasher=password_hasher
    )

def get_document_service(
    document_repository: DocumentRepository = Depends(get_document_repository),
    document_chunk_repository: DocumentChunkRepository = Depends(get_document_chunk_repository),
    stored_document_repository: StoredDocumentRepository = Depends(get_stored_document_repository),
    storage: StorageService = Depends(get_storage_service),
    queue: ArqRedis = Depends(get_queue)
) -> DocumentService:
    return DocumentService(
        document_repository,
        document_chunk_repository,
        stored_document_repository,
        storage,
        queue
    )

def get_message_service(
    message_repository: MessageRepository = Depends(get_message_repository),
    chat_repository: ChatRepository = Depends(get_chat_repository),
    document_repository: DocumentRepository = Depends(get_document_repository),
    embedding_service: EmbeddingService = Depends(get_embedding_service),
    retrieval_service: RetrievalService = Depends(get_retrieval_service),
    llm_service: LLMService = Depends(get_llm_service),
    queue: ArqRedis = Depends(get_queue)
) -> MessageService:
    return MessageService(
        message_repository,
        chat_repository,
        document_repository,
        embedding_service,
        retrieval_service,
        llm_service,
        queue
    )

def get_chat_service(
    chat_repository: ChatRepository = Depends(get_chat_repository),
    document_service: DocumentService = Depends(get_document_service),
    message_service: MessageService = Depends(get_message_service),
) -> ChatService:
    return ChatService(
        chat_repository,
        document_service,
        message_service
    )

def get_user_service(
    user_repository: UserRepository = Depends(get_user_repository),
    chat_service: ChatService = Depends(get_chat_service)
) -> UserService:
    return UserService(
        user_repository,
        chat_service
    )