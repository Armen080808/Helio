from datetime import datetime
from pydantic import BaseModel, ConfigDict


class JobPostingOut(BaseModel):
    id: str
    title: str
    company: str
    url: str
    location: str | None
    job_type: str | None
    description: str | None
    posted_at: datetime | None
    source: str
    is_finance_relevant: bool
    fetched_at: datetime
    model_config = ConfigDict(from_attributes=True)
