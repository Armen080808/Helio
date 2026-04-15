from datetime import date, datetime
from pydantic import BaseModel, ConfigDict


class ContactCreate(BaseModel):
    firm_id: str | None = None
    name: str
    title: str | None = None
    firm_name: str | None = None
    email: str | None = None
    linkedin_url: str | None = None
    how_met: str | None = None
    date_met: date | None = None
    last_contact: date | None = None
    follow_up_date: date | None = None
    notes: str | None = None
    warmth: str = "Cold"


class ContactUpdate(BaseModel):
    name: str | None = None
    title: str | None = None
    firm_name: str | None = None
    email: str | None = None
    linkedin_url: str | None = None
    how_met: str | None = None
    date_met: date | None = None
    last_contact: date | None = None
    follow_up_date: date | None = None
    notes: str | None = None
    warmth: str | None = None


class ContactOut(BaseModel):
    id: str
    firm_id: str | None
    name: str
    title: str | None
    firm_name: str | None
    email: str | None
    linkedin_url: str | None
    how_met: str | None
    date_met: date | None
    last_contact: date | None
    follow_up_date: date | None
    notes: str | None
    warmth: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)
