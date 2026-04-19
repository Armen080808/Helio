from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.pool import NullPool
from .config import settings

# NullPool is required for Neon serverless PostgreSQL.
# Neon uses pgBouncer for its own connection pooling; SQLAlchemy's built-in
# pool conflicts with it and causes stale-connection errors that silently
# swallow writes (users register → 201 but row never commits).
# With NullPool every request opens + closes its own connection via pgBouncer.
engine = create_engine(
    settings.database_url,
    poolclass=NullPool,
    connect_args={
        "sslmode": "require",
        "connect_timeout": 10,
    },
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    # Import all models so Base picks them up before create_all
    from .models import (  # noqa: F401
        user, firm, application, contact, recruiting_deadline,
        interview_question, interview_prep, course, recruiting_event,
        market_snapshot, news_article, job_posting, interview_review, offer_report,
    )
    Base.metadata.create_all(bind=engine)

    # ── Column migrations (idempotent) ────────────────────────────────────────
    # create_all only creates missing *tables*, not missing columns in existing
    # tables.  Run ALTER TABLE … ADD COLUMN IF NOT EXISTS for any new fields.
    from sqlalchemy import text
    with engine.connect() as conn:
        conn.execute(text(
            "ALTER TABLE alyo_users "
            "ADD COLUMN IF NOT EXISTS password_reset_token VARCHAR(10), "
            "ADD COLUMN IF NOT EXISTS password_reset_token_expires_at TIMESTAMP"
        ))
        conn.commit()
