from datetime import datetime
from typing import Literal
from pydantic import BaseModel, ConfigDict
from .client import ClientOut


class ProposalCreate(BaseModel):
    client_id: str
    title: str
    body: str
    amount: float
    currency: str = "USD"
    valid_until: datetime | None = None


class ProposalStatusUpdate(BaseModel):
    status: Literal["DRAFT", "SENT", "VIEWED", "ACCEPTED", "DECLINED"]


class ProposalOut(BaseModel):
    id: str
    user_id: str
    client_id: str
    title: str
    body: str
    amount: float
    currency: str
    status: str
    valid_until: datetime | None
    created_at: datetime
    client: ClientOut

    model_config = ConfigDict(from_attributes=True)
