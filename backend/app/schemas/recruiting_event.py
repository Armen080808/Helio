import uuid
from datetime import datetime
from pydantic import BaseModel, ConfigDict


class RecruitingEventCreate(BaseModel):
    firm_id: str | None = None
    firm_name: str
    event_type: str
    title: str
    date: datetime
    location: str | None = None
    description: str | None = None
    rsvp_status: str | None = None
    notes: str | None = None
    is_public: bool = False


class RecruitingEventUpdate(BaseModel):
    rsvp_status: str | None = None
    notes: str | None = None
    location: str | None = None
    description: str | None = None


class RecruitingEventOut(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID | None
    firm_id: uuid.UUID | None
    firm_name: str
    event_type: str
    title: str
    date: datetime
    location: str | None
    description: str | None
    rsvp_status: str | None
    notes: str | None
    is_public: bool
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)
