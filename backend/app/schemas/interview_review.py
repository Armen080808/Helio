from datetime import date, datetime
from pydantic import BaseModel, ConfigDict


class InterviewReviewCreate(BaseModel):
    firm_id: str | None = None
    firm_name: str
    role: str
    interview_date: date | None = None
    rounds: int | None = None
    outcome: str
    difficulty: int | None = None
    questions_asked: str | None = None
    tips: str | None = None
    anonymous: bool = True


class InterviewReviewOut(BaseModel):
    id: str
    firm_id: str | None
    firm_name: str
    role: str
    interview_date: date | None
    rounds: int | None
    outcome: str
    difficulty: int | None
    questions_asked: str | None
    tips: str | None
    anonymous: bool
    upvotes: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)
