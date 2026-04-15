import uuid
from datetime import datetime, date
from sqlalchemy import String, Float, BigInteger, DateTime, Date
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from ..database import Base


class MarketSnapshot(Base):
    __tablename__ = "alyo_market_snapshots"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    symbol: Mapped[str] = mapped_column(String(20), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    price: Mapped[float] = mapped_column(Float, nullable=False)
    change: Mapped[float] = mapped_column(Float, nullable=False)
    change_pct: Mapped[float] = mapped_column(Float, nullable=False)
    volume: Mapped[int | None] = mapped_column(BigInteger, nullable=True)
    market_cap: Mapped[int | None] = mapped_column(BigInteger, nullable=True)
    snapshot_date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    fetched_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
