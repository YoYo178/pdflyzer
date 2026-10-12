from beanie import PydanticObjectId

from backend.repositories.document_chunk import DocumentChunkRepository
from backend.types.document import RetrievedChunk


class RetrievalService:
    def __init__(self, document_chunk_repository: DocumentChunkRepository):
        self.document_chunk_repository = document_chunk_repository

    async def retrieve(
        self,
        documents_in_chat: list[PydanticObjectId],
        query_embeddings: list[float],
        limit: int = 5,
    ) -> list[RetrievedChunk]:
        return await self.document_chunk_repository.vector_search(
            documents_in_chat=documents_in_chat,
            query_embeddings=query_embeddings,
            limit=limit,
        )
