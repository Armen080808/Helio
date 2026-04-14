from datetime import datetime
from pydantic import BaseModel, ConfigDict


class ClientCreate(BaseModel):
    name: str
    email: str
    phone: str | None = None
    company: str | None = None
    notes: str | None = None


class ClientUpdate(BaseModel):
    name: str | None = None
    email: str | None = None
    phone: str | None = None
    company: str | None = None
    notes: str | None = None


class ClientOut(BaseModel):
    id: str
    user_id: str
    name: str
    email: str
    phone: str | None
    company: str | None
    notes: str | None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
