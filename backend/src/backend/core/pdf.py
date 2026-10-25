import pymupdf

from backend.core.text import TextService
from backend.types.document import ProcessedPage, ProcessedParagraph


class PDFService:
    def __init__(self, text_service: TextService):
        self.text_service = text_service

    def extract_pages(self, file_path: str) -> list[ProcessedPage]:
        out = []

        document = pymupdf.open(file_path)

        try:
            for page_index in range(len(document)):
                page = document[page_index]

                page_text = str(page.get_text())
                normalized_text = self.text_service.normalize(page_text)

                out.append(
                    ProcessedPage(page_number=page_index + 1, text=normalized_text)
                )

        finally:
            document.close()

        return out

    def prepare_paragraphs(
        self, pages: list[ProcessedPage]
    ) -> list[ProcessedParagraph]:
        result = []

        paragraph_index = 1

        for page in pages:
            paragraphs = page.text.split('\n\n')

            for paragraph in paragraphs:
                paragraph = paragraph.strip()

                if not paragraph:
                    continue

                result.append(
                    ProcessedParagraph(
                        page_number=page.page_number,
                        paragraph_index=paragraph_index,
                        text=paragraph,
                    )
                )
                paragraph_index += 1

        return result
