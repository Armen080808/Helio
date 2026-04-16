import uuid
from datetime import datetime
from pydantic import BaseModel, ConfigDict


class NewsArticleOut(BaseModel):
    id: uuid.UUID
    title: str
    url: str
    source: str
    summary: str | None
    published_at: datetime | None
    category: str | None
    fetched_at: datetime
    model_config = ConfigDict(from_attributes=True)
