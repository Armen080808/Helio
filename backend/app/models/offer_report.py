import uuid
from datetime import datetime
from sqlalchemy import String, Text, Boolean, Integer, Float, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from ..database import Base


class OfferReport(Base):
    __tablename__ = "alyo_offer_reports"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("alyo_users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    firm_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("alyo_firms.id", ondelete="SET NULL"), nullable=True
    )
    firm_name: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(255), nullable=False)
    type: Mapped[str] = mapped_column(String(50), nullable=False)  # "IB", "AM", "PE", "Consulting"
    cycle: Mapped[str] = mapped_column(String(50), nullable=False)
    base_salary: Mapped[int | None] = mapped_column(Integer, nullable=True)
    signing_bonus: Mapped[int | None] = mapped_column(Integer, nullable=True)
    internship_stipend: Mapped[int | None] = mapped_column(Integer, nullable=True)
    hourly_rate: Mapped[float | None] = mapped_column(Float, nullable=True)
    anonymous: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
