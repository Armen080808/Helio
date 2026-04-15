import uuid
from datetime import datetime
from sqlalchemy import String, Text, Boolean, Integer, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from ..database import Base


class InterviewPrep(Base):
    __tablename__ = "alyo_interview_prep"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("alyo_users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    question_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("alyo_interview_questions.id", ondelete="SET NULL"), nullable=True
    )
    question_text: Mapped[str] = mapped_column(Text, nullable=False)
    category: Mapped[str] = mapped_column(String(50), nullable=False)
    answer: Mapped[str | None] = mapped_column(Text, nullable=True)
    mastered: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    practice_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    last_practiced: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    target_firm: Mapped[str | None] = mapped_column(String(255), nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
