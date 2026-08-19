from backend.models.document_chunk import DocumentChunk

class DocumentChunkRepository:
    async def create_many(
        self,
        chunks: list[DocumentChunk]
    ) -> None:

        if not chunks:
            return
        
        await DocumentChunk.insert_many(chunks)