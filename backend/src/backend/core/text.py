import re


class TextService:
    def normalize(self, text: str):
        text = text.replace('\r\n', '\n')
        text = text.replace('\r', '\n')

        text = re.sub(r'[ \t]+', ' ', text)

        text = re.sub(r'\n{3,}', '\n\n', text)

        return text.strip()
