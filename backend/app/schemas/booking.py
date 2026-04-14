from datetime import datetime
from pydantic import BaseModel, ConfigDict
from .client import ClientOut


class BookingCreate(BaseModel):
    title: str
    start_at: datetime
    end_at: datetime
    client_id: str | None = None
    notes: str | None = None
    location: str | None = None


class BookingOut(BaseModel):
    id: str
    user_id: str
    client_id: str | None
    title: str
    status: str
    start_at: datetime
    end_at: datetime
    location: str | None
    notes: str | None
    created_at: datetime
    client: ClientOut | None

    model_config = ConfigDict(from_attributes=True)
