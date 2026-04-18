"""
Admin API — protected by X-Admin-Key header.
All endpoints return aggregate / cross-user data for the admin panel.
"""

from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.application import Application
from ..models.contact import Contact
from ..models.job_posting import JobPosting
from ..models.news_article import NewsArticle
from ..models.recruiting_event import RecruitingEvent
from ..models.user import User

router = APIRouter(prefix="/api/admin", tags=["admin"])

_ADMIN_KEY = "helio-admin-2026"


def _verify(x_admin_key: str = Header(None, alias="x-admin-key")):
    if x_admin_key != _ADMIN_KEY:
        raise HTTPException(status_code=403, detail="Forbidden")


# ─── Overview stats ───────────────────────────────────────────────────────────

@router.get("/stats")
def get_stats(db: Session = Depends(get_db), _: None = Depends(_verify)):
    now = datetime.utcnow()
    week_ago = now - timedelta(days=7)
    month_ago = now - timedelta(days=30)

    total_users = db.query(User).count()
    verified_users = db.query(User).filter(User.email_verified == True).count()  # noqa: E712
    new_users_week = db.query(User).filter(User.created_at >= week_ago).count()
    new_users_month = db.query(User).filter(User.created_at >= month_ago).count()

    total_apps = db.query(Application).count()
    new_apps_week = db.query(Application).filter(Application.created_at >= week_ago).count()

    total_jobs = db.query(JobPosting).filter(JobPosting.is_finance_relevant == True).count()  # noqa: E712
    total_events = db.query(RecruitingEvent).count()
    public_events = db.query(RecruitingEvent).filter(RecruitingEvent.is_public == True).count()  # noqa: E712
    total_news = db.query(NewsArticle).count()
    total_contacts = db.query(Contact).count()

    return {
        "total_users": total_users,
        "verified_users": verified_users,
        "new_users_week": new_users_week,
        "new_users_month": new_users_month,
        "total_applications": total_apps,
        "new_apps_week": new_apps_week,
        "total_jobs": total_jobs,
        "total_events": total_events,
        "public_events": public_events,
        "total_news": total_news,
        "total_contacts": total_contacts,
    }


# ─── User registrations trend (last 30 days) ─────────────────────────────────

@router.get("/registrations")
def get_registrations(db: Session = Depends(get_db), _: None = Depends(_verify)):
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    rows = (
        db.query(
            func.date_trunc("day", User.created_at).label("day"),
            func.count(User.id).label("count"),
        )
        .filter(User.created_at >= thirty_days_ago)
        .group_by(func.date_trunc("day", User.created_at))
        .order_by(func.date_trunc("day", User.created_at))
        .all()
    )
    return [{"date": row.day.strftime("%b %d"), "users": row.count} for row in rows]


# ─── Users list ──────────────────────────────────────────────────────────────

@router.get("/users")
def get_users(db: Session = Depends(get_db), _: None = Depends(_verify)):
    users = db.query(User).order_by(User.created_at.desc()).limit(200).all()
    result = []
    for u in users:
        app_count = db.query(Application).filter(Application.user_id == u.id).count()
        contact_count = db.query(Contact).filter(Contact.user_id == u.id).count()
        result.append({
            "id": str(u.id),
            "name": u.name or "—",
            "email": u.email,
            "email_verified": u.email_verified,
            "applications": app_count,
            "contacts": contact_count,
            "created_at": u.created_at.isoformat() if u.created_at else None,
        })
    return result


# ─── Applications overview ────────────────────────────────────────────────────

@router.get("/applications")
def get_applications(db: Session = Depends(get_db), _: None = Depends(_verify)):
    recent = (
        db.query(Application)
        .order_by(Application.created_at.desc())
        .limit(100)
        .all()
    )
    by_stage = (
        db.query(Application.stage, func.count(Application.id).label("count"))
        .group_by(Application.stage)
        .all()
    )
    by_type = (
        db.query(Application.type, func.count(Application.id).label("count"))
        .group_by(Application.type)
        .all()
    )
    top_firms = (
        db.query(Application.firm_name, func.count(Application.id).label("count"))
        .group_by(Application.firm_name)
        .order_by(func.count(Application.id).desc())
        .limit(10)
        .all()
    )
    return {
        "recent": [
            {
                "id": str(a.id),
                "firm_name": a.firm_name,
                "role": a.role,
                "type": a.type,
                "stage": a.stage,
                "applied_date": a.applied_date.isoformat() if a.applied_date else None,
                "created_at": a.created_at.isoformat() if a.created_at else None,
            }
            for a in recent
        ],
        "by_stage": [{"stage": s, "count": c} for s, c in by_stage],
        "by_type": [{"type": t, "count": c} for t, c in by_type],
        "top_firms": [{"firm": f, "count": c} for f, c in top_firms],
    }


# ─── Jobs list ────────────────────────────────────────────────────────────────

@router.get("/jobs")
def get_jobs(db: Session = Depends(get_db), _: None = Depends(_verify)):
    jobs = (
        db.query(JobPosting)
        .order_by(JobPosting.posted_at.desc().nullslast())
        .limit(100)
        .all()
    )
    return [
        {
            "id": str(j.id),
            "title": j.title,
            "company": j.company,
            "location": j.location,
            "job_type": j.job_type,
            "source": j.source,
            "url": j.url,
            "posted_at": j.posted_at.isoformat() if j.posted_at else None,
        }
        for j in jobs
    ]


# ─── Events list ─────────────────────────────────────────────────────────────

@router.get("/events")
def get_events(db: Session = Depends(get_db), _: None = Depends(_verify)):
    events = (
        db.query(RecruitingEvent)
        .filter(RecruitingEvent.is_public == True)  # noqa: E712
        .order_by(RecruitingEvent.date.asc())
        .limit(100)
        .all()
    )
    return [
        {
            "id": str(e.id),
            "title": e.title,
            "firm_name": e.firm_name,
            "event_type": e.event_type,
            "date": e.date.isoformat() if e.date else None,
            "location": e.location,
        }
        for e in events
    ]
