from beanie import PydanticObjectId

from backend.models.document_chunk import DocumentChunk
from backend.types.document import RetrievedChunk


class DocumentChunkRepository:
    async def create_many(
        self,
        chunks: list[DocumentChunk]
    ) -> None:

        if not chunks:
            return
        
        await DocumentChunk.insert_many(chunks)
        
    async def delete_document_chunks(
        self,
        document_id: PydanticObjectId
    ):
        await DocumentChunk.find(
            DocumentChunk.document_id == document_id
        ).delete()
        
    async def vector_search(
        self,
        chat_id: PydanticObjectId,
        query_embeddings: list[float],
        limit: int
    ) -> list[RetrievedChunk]:
        pipeline = [
            {
                "$vectorSearch": {
                    "index": "vector_index",
                    "path": "embeddings",
                    "queryVector": query_embeddings,
                    "numCandidates": 50,
                    "limit": limit
                }
            },
            {
                "$project": {
                    "_id": 1,
                    "document_id": 1,
                    
                    "filename": 1,
    
                    "chunk_index": 1,
                    "text": 1,
                    
                    "page_start": 1,
                    "page_end": 1,
                    
                    "paragraph_start": 1,
                    "paragraph_end": 1,
                    
                    "score": {
                        "$meta": "vectorSearchScore"
                    }
                }
            }
        ]
        
        results = await DocumentChunk.aggregate(pipeline).to_list()
        
        return [
            RetrievedChunk(
                id=result["_id"],
                document_id=result["document_id"],
                
                filename=result["filename"],

                chunk_index=result["chunk_index"],
                text=result["text"],
                
                page_start=result["page_start"],
                page_end=result["page_end"],
                
                paragraph_start=result["paragraph_start"],
                paragraph_end=result["paragraph_end"],
                
                score=result["score"]
            ) for result in results
        ]