import uuid
from datetime import datetime
from sqlalchemy import String, Text, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from ..database import Base


class NewsArticle(Base):
    __tablename__ = "alyo_news_articles"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    title: Mapped[str] = mapped_column(String(1000), nullable=False)
    url: Mapped[str] = mapped_column(String(2000), unique=True, nullable=False)
    source: Mapped[str] = mapped_column(String(255), nullable=False)
    summary: Mapped[str | None] = mapped_column(Text, nullable=True)
    published_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    category: Mapped[str | None] = mapped_column(String(50), nullable=True)
    fetched_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
