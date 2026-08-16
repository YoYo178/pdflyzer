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
