from datetime import date, datetime
from pydantic import BaseModel, ConfigDict


class RecruitingDeadlineCreate(BaseModel):
    firm_id: str | None = None
    firm_name: str
    role: str
    type: str
    cycle: str
    application_open: date | None = None
    application_deadline: date | None = None
    networking_season_start: date | None = None
    notes: str | None = None
    source_url: str | None = None


class RecruitingDeadlineOut(BaseModel):
    id: str
    firm_id: str | None
    firm_name: str
    role: str
    type: str
    cycle: str
    application_open: date | None
    application_deadline: date | None
    networking_season_start: date | None
    notes: str | None
    source_url: str | None
    is_community_added: bool
    verified: bool
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)
