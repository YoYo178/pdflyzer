
from backend.types.document import ProcessedChunk, ProcessedParagraph

MAX_CHUNK_LIMIT = 3000

class ChunkService:    
    def prepare_chunks(
        self,
        paragraphs: list[ProcessedParagraph]
    ) -> list[ProcessedChunk]:
        chunks = []
        
        current_paragraphs: list[ProcessedParagraph] = []
        current_length = 0
        chunk_index = 0
        
        for paragraph in paragraphs:
            paragraph_length = len(paragraph.text)
            
            # If the next paragraph doesn't fit then finalize this chunk
            if(
                current_paragraphs
                and current_length + paragraph_length > MAX_CHUNK_LIMIT
            ):
                chunks.append(
                    self._create_chunk(
                        chunk_index,
                        current_paragraphs
                    )
                )
                
                chunk_index += 1
                
                # Overlapping: Keep the last paragraph
                overlap = current_paragraphs[-1]
                
                current_paragraphs = [overlap]
                current_length = len(overlap.text)
                
            current_paragraphs.append(paragraph)
            current_length += paragraph_length
            
        if current_paragraphs:
            chunks.append(
                self._create_chunk(
                    chunk_index,
                    current_paragraphs
                )
            )
            
        return chunks
    
    def _create_chunk(
        self,
        chunk_index: int,
        paragraphs: list[ProcessedParagraph],
    ) -> ProcessedChunk:
        
        return ProcessedChunk(
            chunk_index=chunk_index,
            text="\n\n".join(
                paragraph.text for paragraph in paragraphs
            ),
            page_start=paragraphs[0].page_number,
            page_end=paragraphs[-1].page_number,
            paragraph_start=paragraphs[0].paragraph_index,
            paragraph_end=paragraphs[-1].paragraph_index,
        )