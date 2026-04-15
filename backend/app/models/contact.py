import uuid
from datetime import datetime, date
from sqlalchemy import String, Text, DateTime, Date, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from ..database import Base


class Contact(Base):
    __tablename__ = "alyo_contacts"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("alyo_users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    firm_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("alyo_firms.id", ondelete="SET NULL"), nullable=True
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    title: Mapped[str | None] = mapped_column(String(255), nullable=True)
    firm_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    email: Mapped[str | None] = mapped_column(String(255), nullable=True)
    linkedin_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    how_met: Mapped[str | None] = mapped_column(String(255), nullable=True)
    date_met: Mapped[date | None] = mapped_column(Date, nullable=True)
    last_contact: Mapped[date | None] = mapped_column(Date, nullable=True)
    follow_up_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    warmth: Mapped[str] = mapped_column(String(20), default="Cold", nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
