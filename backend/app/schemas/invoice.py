from datetime import datetime
from pydantic import BaseModel, ConfigDict
from .client import ClientOut


class LineItem(BaseModel):
    description: str
    qty: int
    unit_price: float


class InvoiceCreate(BaseModel):
    client_id: str
    title: str
    line_items: list[LineItem]
    tax: float = 0.0
    currency: str = "USD"
    due_date: datetime | None = None
    contract_id: str | None = None


class InvoiceOut(BaseModel):
    id: str
    user_id: str
    client_id: str
    number: str
    title: str
    line_items: str  # raw JSON
    subtotal: float
    tax: float
    total: float
    currency: str
    status: str
    due_date: datetime | None
    paid_at: datetime | None
    created_at: datetime
    client: ClientOut

    model_config = ConfigDict(from_attributes=True)
