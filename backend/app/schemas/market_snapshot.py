import uuid
from datetime import date, datetime
from pydantic import BaseModel, ConfigDict


class MarketSnapshotOut(BaseModel):
    id: uuid.UUID
    symbol: str
    name: str
    price: float
    change: float
    change_pct: float
    volume: int | None
    market_cap: int | None
    snapshot_date: date
    fetched_at: datetime
    model_config = ConfigDict(from_attributes=True)
