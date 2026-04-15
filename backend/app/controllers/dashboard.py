from datetime import date, timedelta
from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.application import Application
from ..models.contact import Contact
from ..models.course import Course
from ..models.market_snapshot import MarketSnapshot
from ..models.news_article import NewsArticle
from ..models.recruiting_deadline import RecruitingDeadline
from ..models.recruiting_event import RecruitingEvent
from ..models.user import User
from ..schemas.dashboard import DashboardStats
from ..services.auth import get_current_user

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("/", response_model=DashboardStats)
def get_dashboard(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Pipeline stats
    apps = db.query(Application).filter(Application.user_id == current_user.id).all()
    total = len(apps)
    active = len([a for a in apps if a.stage not in ["Rejected", "Withdrawn"]])
    offers = len([a for a in apps if a.stage == "Offer"])

    # Contacts count
    contacts_count = db.query(Contact).filter(Contact.user_id == current_user.id).count()

    # Upcoming deadlines (next 7 days) from global recruiting calendar
    today = date.today()
    week = today + timedelta(days=7)
    deadlines = (
        db.query(RecruitingDeadline)
        .filter(
            RecruitingDeadline.application_deadline >= today,
            RecruitingDeadline.application_deadline <= week,
        )
        .order_by(RecruitingDeadline.application_deadline)
        .limit(5)
        .all()
    )

    # Upcoming events (next 7 days)
    from datetime import datetime
    now = datetime.utcnow()
    week_dt = now + timedelta(days=7)
    events = (
        db.query(RecruitingEvent)
        .filter(
            (RecruitingEvent.user_id == current_user.id) | (RecruitingEvent.is_public == True),  # noqa: E712
            RecruitingEvent.date >= now,
            RecruitingEvent.date <= week_dt,
        )
        .order_by(RecruitingEvent.date)
        .limit(5)
        .all()
    )

    # GPA
    courses = (
        db.query(Course)
        .filter(Course.user_id == current_user.id, Course.grade_point.isnot(None))
        .all()
    )
    gpa = None
    if courses:
        total_credits = sum(c.credits for c in courses)
        if total_credits > 0:
            gpa = round(sum(c.grade_point * c.credits for c in courses) / total_credits, 2)

    # Market data — latest snapshot
    latest_date = db.query(func.max(MarketSnapshot.snapshot_date)).scalar()
    market = []
    if latest_date:
        snaps = (
            db.query(MarketSnapshot)
            .filter(
                MarketSnapshot.snapshot_date == latest_date,
                MarketSnapshot.symbol.in_(["^GSPTSE", "^GSPC", "TD.TO", "RY.TO"]),
            )
            .all()
        )
        market = [
            {
                "symbol": s.symbol,
                "name": s.name,
                "price": s.price,
                "change_pct": s.change_pct,
            }
            for s in snaps
        ]

    # Recent news
    news_items = (
        db.query(NewsArticle)
        .order_by(NewsArticle.published_at.desc().nullslast())
        .limit(3)
        .all()
    )
    news = [{"title": n.title, "source": n.source, "url": n.url} for n in news_items]

    return DashboardStats(
        total_applications=total,
        active_applications=active,
        offers_count=offers,
        contacts_count=contacts_count,
        upcoming_deadlines=[
            {
                "firm": d.firm_name,
                "role": d.role,
                "deadline": str(d.application_deadline),
            }
            for d in deadlines
        ],
        upcoming_events=[
            {
                "title": e.title,
                "firm": e.firm_name,
                "date": str(e.date),
                "type": e.event_type,
            }
            for e in events
        ],
        gpa=gpa,
        courses_count=len(courses),
        market_summary=market,
        recent_news=news,
    )
