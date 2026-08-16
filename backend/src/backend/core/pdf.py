import pymupdf

from backend.core.text import TextService
from backend.types.document import DocumentPage, DocumentParagraph

class PDFService:
    def extract_pages(self, file_path: str) -> list[DocumentPage]:
        out = []
        
        document = pymupdf.open(file_path)
        
        try:
            for page_index in range(len(document)):
                page = document[page_index]
                
                page_text = str(page.get_text())
                
                out.append(
                    DocumentPage(
                        page_number=page_index + 1,
                        text=page_text
                    )
                )
                
        finally:
            document.close()
            
        return out
    
    def prepare_paragraphs(self, pages: list[DocumentPage]) -> list[DocumentParagraph]:
        result = []
        
        paragraph_index = 1
        
        for page in pages:
            paragraphs = page.text.split("\n\n")
            
            for paragraph in paragraphs:
                paragraph = paragraph.strip()

                if not paragraph:
                    continue
            
                result.append(
                    DocumentParagraph(
                        page_number=page.page_number,
                        paragraph_index=paragraph_index,
                        text=paragraph
                    )
                )
                paragraph_index += 1
        
        return result