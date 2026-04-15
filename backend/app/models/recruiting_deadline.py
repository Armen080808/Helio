import uuid
from datetime import datetime, date
from sqlalchemy import String, Text, Boolean, DateTime, Date, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from ..database import Base


class RecruitingDeadline(Base):
    __tablename__ = "alyo_recruiting_deadlines"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    firm_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("alyo_firms.id", ondelete="SET NULL"), nullable=True
    )
    firm_name: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(255), nullable=False)
    type: Mapped[str] = mapped_column(String(50), nullable=False)
    cycle: Mapped[str] = mapped_column(String(50), nullable=False)
    application_open: Mapped[date | None] = mapped_column(Date, nullable=True)
    application_deadline: Mapped[date | None] = mapped_column(Date, nullable=True)
    networking_season_start: Mapped[date | None] = mapped_column(Date, nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    source_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    is_community_added: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    submitted_by_user_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("alyo_users.id", ondelete="SET NULL"), nullable=True
    )
    verified: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
