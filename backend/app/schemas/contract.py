from datetime import datetime
from typing import Literal
from pydantic import BaseModel, ConfigDict
from .client import ClientOut


class ContractCreate(BaseModel):
    client_id: str
    title: str
    body: str
    proposal_id: str | None = None


class SignParty(BaseModel):
    party: Literal["user", "client"]


class ContractOut(BaseModel):
    id: str
    user_id: str
    client_id: str
    title: str
    status: str
    signed_at: datetime | None
    client_signed_at: datetime | None
    created_at: datetime
    client: ClientOut

    model_config = ConfigDict(from_attributes=True)
