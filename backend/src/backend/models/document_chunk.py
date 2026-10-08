from beanie import PydanticObjectId

from backend.models.base import BaseTimestampDocument

class DocumentChunk(BaseTimestampDocument):
    document_id: PydanticObjectId
    
    filename: str
    
    chunk_index: int
    text: str
    
    page_start: int
    page_end: int
    
    paragraph_start: int
    paragraph_end: int
    
    embeddings: list[float]
    
    class Settings:
        name = "document_chunks"