import uuid
from datetime import datetime
from sqlalchemy import String, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from ..database import Base


class User(Base):
    __tablename__ = "alyo_users"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    password_hash: Mapped[str | None] = mapped_column(String(255), nullable=True)
    email_verified: Mapped[bool] = mapped_column(default=False, nullable=False)
    verification_token: Mapped[str | None] = mapped_column(String(10), nullable=True, index=True)
    verification_token_expires_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime | None] = mapped_column(
        DateTime, default=None, onupdate=datetime.utcnow, nullable=True
    )
