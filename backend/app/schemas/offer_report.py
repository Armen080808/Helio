import uuid
from datetime import datetime
from pydantic import BaseModel, ConfigDict


class OfferReportCreate(BaseModel):
    firm_id: str | None = None
    firm_name: str
    role: str
    type: str
    cycle: str
    base_salary: int | None = None
    signing_bonus: int | None = None
    internship_stipend: int | None = None
    hourly_rate: float | None = None
    anonymous: bool = True
    notes: str | None = None


class OfferReportOut(BaseModel):
    id: uuid.UUID
    firm_id: uuid.UUID | None
    firm_name: str
    role: str
    type: str
    cycle: str
    base_salary: int | None
    signing_bonus: int | None
    internship_stipend: int | None
    hourly_rate: float | None
    anonymous: bool
    notes: str | None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)
