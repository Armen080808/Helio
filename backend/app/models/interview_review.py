import uuid
from datetime import datetime, date
from sqlalchemy import String, Text, Boolean, Integer, DateTime, Date, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from ..database import Base


class InterviewReview(Base):
    __tablename__ = "alyo_interview_reviews"

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
    interview_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    rounds: Mapped[int | None] = mapped_column(Integer, nullable=True)
    outcome: Mapped[str] = mapped_column(String(50), nullable=False)  # "Offer", "Rejected", "Pending", "Withdrew"
    difficulty: Mapped[int | None] = mapped_column(Integer, nullable=True)  # 1-5
    questions_asked: Mapped[str | None] = mapped_column(Text, nullable=True)
    tips: Mapped[str | None] = mapped_column(Text, nullable=True)
    anonymous: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    upvotes: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
