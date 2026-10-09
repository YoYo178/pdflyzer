from datetime import UTC, datetime

from beanie import Document, Replace, Save, before_event
from pydantic import Field


class BaseTimestampDocument(Document):
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(UTC))

    @before_event([Replace, Save])
    def update_timestamp(self):
        self.updated_at = datetime.now(UTC)