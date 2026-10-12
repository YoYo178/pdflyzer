from datetime import UTC, datetime

from beanie import Document, Replace, Save, before_event
from pydantic import ConfigDict, Field


class BaseTimestampDocument(Document):
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(UTC))

    # This configuration forces Pydantic to format all datetime objects with a 'Z' suffix
    # when serializing documents to JSON for API responses.
    model_config = ConfigDict(
        json_encoders={datetime: lambda v: v.strftime('%Y-%m-%dT%H:%M:%S.%fZ')}
    )

    @before_event([Replace, Save])
    def update_timestamp(self):
        self.updated_at = datetime.now(UTC)
