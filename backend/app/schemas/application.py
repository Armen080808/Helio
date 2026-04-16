import uuid
from datetime import date, datetime
from pydantic import BaseModel, ConfigDict


class ApplicationCreate(BaseModel):
    firm_id: str | None = None
    firm_name: str
    role: str
    type: str
    stage: str = "Wishlist"
    applied_date: date | None = None
    deadline: date | None = None
    next_step: str | None = None
    notes: str | None = None
    salary: int | None = None


class ApplicationUpdate(BaseModel):
    stage: str | None = None
    next_step: str | None = None
    notes: str | None = None
    salary: int | None = None
    applied_date: date | None = None
    deadline: date | None = None


class ApplicationOut(BaseModel):
    id: uuid.UUID
    firm_id: uuid.UUID | None
    firm_name: str
    role: str
    type: str
    stage: str
    applied_date: date | None
    deadline: date | None
    next_step: str | None
    notes: str | None
    salary: int | None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)
