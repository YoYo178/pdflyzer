import re
from collections.abc import AsyncIterator

from arq import ArqRedis
from beanie import PydanticObjectId

import backend.exceptions.message as message_exceptions
from backend.core.embedding import EmbeddingService
from backend.core.llm import LLMService
from backend.core.retrieval import RetrievalService
from backend.models.message import Message, MessageSource
from backend.repositories.chat import ChatRepository
from backend.repositories.document import DocumentRepository
from backend.repositories.message import MessageRepository
from backend.schemas.message import MessageUpdatePayload

CITATION_REGEX = r"\[\[(\d+)\]\]"

class MessageService:
    def __init__(
        self,
        message_repository: MessageRepository,
        chat_repository: ChatRepository,
        document_repository: DocumentRepository,
        embedding_service: EmbeddingService,
        retrieval_service: RetrievalService,
        llm_service: LLMService,
        queue: ArqRedis
    ):
        self.message_repository = message_repository
        self.chat_repository = chat_repository
        self.document_repository = document_repository
        self.embedding_service = embedding_service
        self.retrieval_service = retrieval_service
        self.llm_service = llm_service
        self.queue = queue
    
    async def get_all_messages(self, user_id: PydanticObjectId, chat_id: PydanticObjectId) -> list[Message]:
        return await self.message_repository.find_all(user_id, chat_id)
    
    async def get_message_by_id(self, user_id: PydanticObjectId, chat_id: PydanticObjectId, message_id: PydanticObjectId) -> Message:
        return await self.message_repository.find_by_id(user_id, chat_id, message_id)
    
    async def create_message(self, user_id: PydanticObjectId, chat_id: PydanticObjectId, message_content: str) -> AsyncIterator[str | list[str]]:
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
        
        chat = await self.chat_repository.find_by_id(user_id, chat_id)
        
        # If it's a newly generated chat, and the title is still the default
        # then attempt to generate a meaningful title for this chat
        if(chat.name == "New Chat"):
            await self.queue.enqueue_job(
                'generate_chat_title',
                str(user_id),
                str(chat_id),
                message_content,
            )
        
        chunks = await self.retrieval_service.retrieve(chat_id, message_embeddings)
        
        response = []
        response_generator = self.llm_service.stream(message_content, chunks)
        
        async for chunk in response_generator:
            response.append(chunk)
            yield chunk

        response = "".join(response)

        available_citations = {
            int(citation)
            for citation in re.findall(CITATION_REGEX, response)
        }

        citation_sources = [
            MessageSource(
                filename=chunks[int(citation) - 1].filename,
                page_start=chunks[int(citation) - 1].page_start,
                page_end=chunks[int(citation) - 1].page_end,
                paragraph_start=chunks[int(citation) - 1].paragraph_start,
                paragraph_end=chunks[int(citation) - 1].paragraph_end,
                section=chunks[int(citation) - 1].text[:16] + "...",
            )
            for citation in available_citations
        ]

        await self.message_repository.create(
            Message(
                sender_id=None,
                sender_role="assistant",
                chat_id=chat_id,
                content=response,
                embeddings=[],
                sources=citation_sources
            )
        )

        yield [citation.model_dump_json() for citation in citation_sources]
        
    async def update_mesage(self, user_id: PydanticObjectId, chat_id: PydanticObjectId, message_id: PydanticObjectId, message_data: MessageUpdatePayload):
        return await self.message_repository.update(user_id, chat_id, message_id, message_data.model_dump())
        
    async def delete_message(self, user_id: PydanticObjectId, chat_id: PydanticObjectId, message_id: PydanticObjectId) -> None:
        return await self.message_repository.delete(user_id, chat_id, message_id)