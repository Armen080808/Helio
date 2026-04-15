import uuid
from datetime import datetime
from sqlalchemy import String, Text, Integer, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from ..database import Base


class InterviewQuestion(Base):
    __tablename__ = "alyo_interview_questions"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    category: Mapped[str] = mapped_column(String(50), nullable=False)  # "Technical", "Behavioral", "Fit", "Market"
    subcategory: Mapped[str | None] = mapped_column(String(100), nullable=True)
    question: Mapped[str] = mapped_column(Text, nullable=False)
    answer: Mapped[str | None] = mapped_column(Text, nullable=True)
    difficulty: Mapped[str] = mapped_column(String(20), nullable=False)  # "Easy", "Medium", "Hard"
    firm_specific: Mapped[str | None] = mapped_column(String(255), nullable=True)
    source: Mapped[str | None] = mapped_column(String(255), nullable=True)
    upvotes: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
