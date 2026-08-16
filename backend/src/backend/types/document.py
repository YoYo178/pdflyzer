from dataclasses import dataclass

@dataclass
class DocumentPage:
    page_number: int
    text: str
    
@dataclass
class DocumentParagraph:
    page_number: int
    paragraph_index: int
    text: str
