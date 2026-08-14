import hashlib
from pathlib import Path

from fastapi import UploadFile

from backend.types.storage import StoredFile

PROJECT_ROOT_DIR = Path(__file__).resolve().parents[3]
BASE_FILE_STORAGE_DIR = PROJECT_ROOT_DIR / "user_content" / "documents"

class StorageService:
    def __init__(self):
        self.base_path = BASE_FILE_STORAGE_DIR
        self.base_path.mkdir(parents=True, exist_ok=True)
        
    async def calculate_hash(self, file: UploadFile) -> str:
        hasher = hashlib.sha256()
        
        while chunk := await file.read(1024 * 1024):
            hasher.update(chunk)
            
        return hasher.hexdigest()

    async def save(self, file_id: str, file: UploadFile) -> StoredFile:
        path = self.base_path / file_id
        size = 0

        hasher = hashlib.sha256()

        with path.open("wb") as destination:
            while chunk := await file.read(1024 * 1024):
                destination.write(chunk)
                
                hasher.update(chunk)
                size += len(chunk)

        return StoredFile(
            str(path),
            size,
            sha256=hasher.hexdigest()
        )
