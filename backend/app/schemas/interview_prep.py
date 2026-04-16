import uuid
from datetime import datetime
from pydantic import BaseModel, ConfigDict


class InterviewPrepCreate(BaseModel):
    question_id: str | None = None
    question_text: str
    category: str
    answer: str | None = None
    target_firm: str | None = None
    notes: str | None = None


class InterviewPrepUpdate(BaseModel):
    answer: str | None = None
    mastered: bool | None = None
    practice_count: int | None = None
    target_firm: str | None = None
    notes: str | None = None


class InterviewPrepOut(BaseModel):
    id: uuid.UUID
    question_id: uuid.UUID | None
    question_text: str
    category: str
    answer: str | None
    mastered: bool
    practice_count: int
    last_practiced: datetime | None
    target_firm: str | None
    notes: str | None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)
