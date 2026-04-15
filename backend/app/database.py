from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from .config import settings

engine = create_engine(settings.database_url, pool_pre_ping=True)

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
