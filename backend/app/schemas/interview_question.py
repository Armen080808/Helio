import uuid
from datetime import datetime
from pydantic import BaseModel, ConfigDict


class InterviewQuestionOut(BaseModel):
    id: uuid.UUID
    category: str
    subcategory: str | None
    question: str
    answer: str | None
    difficulty: str
    firm_specific: str | None
    source: str | None
    upvotes: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


class InterviewQuestionCreate(BaseModel):
    category: str
    subcategory: str | None = None
    question: str
    answer: str | None = None
    difficulty: str
    firm_specific: str | None = None
    source: str | None = None
