import uuid
from datetime import datetime
from sqlalchemy import String, Text, Float, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from ..database import Base


class Course(Base):
    __tablename__ = "alyo_courses"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("alyo_users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    code: Mapped[str] = mapped_column(String(20), nullable=False)  # "ECO101H1"
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    semester: Mapped[str] = mapped_column(String(20), nullable=False)  # "Fall 2025"
    grade: Mapped[str | None] = mapped_column(String(5), nullable=True)  # "A+", "A", etc.
    grade_point: Mapped[float | None] = mapped_column(Float, nullable=True)
    credits: Mapped[float] = mapped_column(Float, default=0.5, nullable=False)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
