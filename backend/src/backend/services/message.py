from beanie import PydanticObjectId
from typing import AsyncIterator

from backend.core.embedding import EmbeddingService
from backend.core.retrieval import RetrievalService
from backend.core.llm import LLMService

import backend.exceptions.message as message_exceptions

from backend.models.message import Message

from backend.schemas.message import PayloadMessage

from backend.repositories.message import MessageRepository
from backend.repositories.document import DocumentRepository

class MessageService:
    def __init__(
        self,
        message_repository: MessageRepository,
        document_repository: DocumentRepository,
        embedding_service: EmbeddingService,
        retrieval_service: RetrievalService,
        llm_service: LLMService
    ):
        self.message_repository = message_repository
        self.document_repository = document_repository
        self.embedding_service = embedding_service
        self.retrieval_service = retrieval_service
        self.llm_service = llm_service
    
    async def get_all_messages(self, user_id: PydanticObjectId, chat_id: PydanticObjectId) -> list[Message]:
        return await self.message_repository.find_all(user_id, chat_id)
    
    async def get_message_by_id(self, user_id: PydanticObjectId, chat_id: PydanticObjectId, message_id: PydanticObjectId) -> Message:
        return await self.message_repository.find_by_id(user_id, chat_id, message_id)
    
    async def create_message(self, user_id: PydanticObjectId, chat_id: PydanticObjectId, message_content: str) -> AsyncIterator[str]:
        documents = await self.document_repository.find_all(user_id, chat_id)
        
        if not documents:
            raise message_exceptions.NoDocumentFound()
        
        message_embeddings = self.embedding_service.generate([message_content])[0]

        await self.message_repository.create(
            Message(
                sender_id=user_id,
                sender_role="user",

                chat_id=chat_id,
                
                content=message_content,
                embeddings=message_embeddings
            )
        )
        
        chunks = await self.retrieval_service.retrieve(chat_id, message_embeddings)
        
        response = []
        response_generator = self.llm_service.stream(message_content, chunks)
        
        async for chunk in response_generator:
            response.append(chunk)
            yield chunk
        
        response = "".join(response)
        response_message = Message(
            sender_id=None,
            sender_role="system",
            
            chat_id=chat_id,
            
            content=response,
            embeddings=[]
        )
        
        await self.message_repository.create(response_message)
    
    async def delete_message(self, user_id: PydanticObjectId, chat_id: PydanticObjectId, message_id: PydanticObjectId) -> None:
        return await self.message_repository.delete(user_id, chat_id, message_id)