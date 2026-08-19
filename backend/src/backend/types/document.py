from dataclasses import dataclass

@dataclass
class ProcessedPage:
    page_number: int
    text: str
    
@dataclass
class ProcessedParagraph:
    page_number: int
    paragraph_index: int
    text: str

@dataclass
class ProcessedChunk:
    chunk_index: int
    text: str
    
    page_start: int
    page_end: int
    
    paragraph_start: int
    paragraph_end: int