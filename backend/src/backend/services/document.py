from arq import ArqRedis
from beanie import PydanticObjectId
from fastapi import UploadFile

import backend.exceptions.document as document_exceptions
from backend.core.storage import StorageService
from backend.models.chat_document import ChatDocument
from backend.repositories.document import DocumentRepository
from backend.repositories.document_chunk import DocumentChunkRepository

MAX_UPLOADS = 5

class DocumentService:
    def __init__(
        self,
        repo: DocumentRepository,
        document_chunk_repository: DocumentChunkRepository,
        storage: StorageService,
        queue: ArqRedis,
    ):
        self.repo = repo
        self.document_chunk_repository = document_chunk_repository
        self.storage = storage
        self.queue = queue

    async def get_all_documents(self, user_id: PydanticObjectId, chat_id: PydanticObjectId) -> list[ChatDocument]:
        return await self.repo.find_all(user_id, chat_id)

    async def get_document_by_id(self, user_id: PydanticObjectId, document_id: PydanticObjectId) -> ChatDocument:
        return await self.repo.find_by_id(user_id, document_id)

    async def get_document_in_chat(self, user_id: PydanticObjectId, chat_id: PydanticObjectId, document_id: PydanticObjectId) -> ChatDocument:
        return await self.repo.find_by_id_in_chat(user_id, chat_id, document_id)

    async def delete_document(self, user_id: PydanticObjectId, document_id: PydanticObjectId) -> ChatDocument:
        # TODO: This is currently a bug, it should only delete chunks if no other documents reference it
        # TODO: but currently it will delete all chunks even if there are multiple documents referencing them
        await self.document_chunk_repository.delete_document_chunks(document_id)
        return await self.repo.delete(user_id, document_id)

    async def delete_document_in_chat(self, user_id: PydanticObjectId, chat_id: PydanticObjectId, document_id: PydanticObjectId) -> ChatDocument:
        # TODO: This is currently a bug, it should only delete chunks if no other documents reference it
        # TODO: but currently it will delete all chunks even if there are multiple documents referencing them
        await self.document_chunk_repository.delete_document_chunks(document_id)
        return await self.repo.delete_in_chat(user_id, chat_id, document_id)

    async def upload_document(self, user_id: PydanticObjectId, chat_id: PydanticObjectId, files: list[UploadFile]) -> None:
        files_trimmed = files[:MAX_UPLOADS]

        for file in files_trimmed:
            if not file.filename or not file.content_type or not file.size:
                continue

            document_id = PydanticObjectId()

            temp_file = await self.storage.save_temp(
                file,
                str(document_id),
            )

            # Check whether this exact file already exists
            # in this specific chat.
            document_exists_in_same_chat = await self.repo.find_one_by_hash(
                user_id,
                temp_file.sha256,
                chat_id,
            )

            if document_exists_in_same_chat:
                self.storage.reject_file(temp_file.path)
                raise document_exceptions.DocumentAlreadyExists()

            # Check whether the physical file already exists
            # somewhere accessible to this user.
            existing_document = await self.repo.find_one_by_hash(
                user_id,
                temp_file.sha256,
            )

            if existing_document:
                document = ChatDocument(
                    id=document_id,
                    chat_id=chat_id,
                    filename=file.filename,
                    mime_type=existing_document.mime_type,
                    size=existing_document.size,
                    status=existing_document.status,
                    file_path=existing_document.file_path,
                    file_hash=existing_document.file_hash,
                    pages=existing_document.pages
                )

                await self.repo.create(
                    user_id,
                    chat_id,
                    document,
                )

                self.storage.reject_file(temp_file.path)

                # TODO: Have one document update all other
                # documents pointing to the same physical file.
                if existing_document.status != "READY":
                    existing_document.status = document.status = "QUEUED"

                    await existing_document.save()
                    await document.save()

                    await self.queue.enqueue_job(
                        "process_document",
                        str(user_id),
                        str(document.id),
                        str(chat_id),
                    )

                continue

            final_path = self.storage.finalize_file(
                temp_file.path,
                f"{document_id}.pdf",
            )

            document = ChatDocument(
                id=document_id,
                chat_id=chat_id,
                filename=file.filename,
                mime_type=file.content_type,
                size=file.size,
                status="QUEUED",
                file_path=final_path,
                file_hash=temp_file.sha256,
            )

            await self.repo.create(
                user_id,
                chat_id,
                document,
            )

            await self.queue.enqueue_job(
                "process_document",
                str(user_id),
                str(document.id),
                str(chat_id),
            )