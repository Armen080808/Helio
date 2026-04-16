import uuid
from pydantic import BaseModel, ConfigDict


class FirmOut(BaseModel):
    id: uuid.UUID
    name: str
    type: str
    description: str
    headquarters: str
    website: str | None
    avg_gpa_requirement: float | None
    recruits_uoft: bool
    notes: str | None
    is_community_added: bool
    model_config = ConfigDict(from_attributes=True)


class FirmCreate(BaseModel):
    name: str
    type: str
    description: str
    headquarters: str = "Toronto, ON"
    website: str | None = None
    avg_gpa_requirement: float | None = None
    notes: str | None = None
