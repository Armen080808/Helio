import uuid
from datetime import datetime
from sqlalchemy import String, Text, Boolean, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from ..database import Base


class JobPosting(Base):
    __tablename__ = "alyo_job_postings"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    title: Mapped[str] = mapped_column(String(500), nullable=False)
    company: Mapped[str] = mapped_column(String(255), nullable=False)
    url: Mapped[str] = mapped_column(String(2000), unique=True, nullable=False)
    location: Mapped[str | None] = mapped_column(String(255), nullable=True)
    job_type: Mapped[str | None] = mapped_column(String(50), nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    posted_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    source: Mapped[str] = mapped_column(String(100), nullable=False)
    is_finance_relevant: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    fetched_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
