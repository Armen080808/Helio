import uuid
from datetime import datetime
from sqlalchemy import String, Text, Float, Boolean, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from ..database import Base


class Firm(Base):
    __tablename__ = "alyo_firms"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    name: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    type: Mapped[str] = mapped_column(String(50), nullable=False)  # "IB", "AM", "PE", "Consulting", "VC", "Bank"
    description: Mapped[str] = mapped_column(Text, nullable=False, default="")
    headquarters: Mapped[str] = mapped_column(String(255), nullable=False, default="Toronto, ON")
    website: Mapped[str | None] = mapped_column(String(500), nullable=True)
    linkedin_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    avg_gpa_requirement: Mapped[float | None] = mapped_column(Float, nullable=True)
    recruits_uoft: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    is_community_added: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
