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

    async def save(self, file: UploadFile, file_name: str) -> StoredFile:
        path = self.base_path / file_name
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

    async def save_temp(self, file: UploadFile, file_name: str) -> StoredFile:
        return await self.save(file, file_name=f".{file_name}.tmp")
    
    def reject_file(self, temp_file_path: str) -> None:
        Path(temp_file_path).unlink(missing_ok=True)
    
    def finalize_file(self, temp_file_path: str, file_name: str) -> str:
        old_file = Path(temp_file_path)
        new_file = self.base_path / file_name
        
        old_file.replace(new_file)
        
        return str(new_file)
