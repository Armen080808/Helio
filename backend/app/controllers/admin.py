"""
Admin API — protected by X-Admin-Key header.
All endpoints return aggregate / cross-user data for the admin panel.

Security layer
--------------
POST /api/admin/auth/login  validates credentials server-side and enforces
IP-based rate limiting: after MAX_FAILURES (3) consecutive wrong-password
attempts from the same IP address the IP is blocked for BLOCK_DURATION (1 h).

Credentials are stored only on the server — never shipped to the browser.
"""

import uuid as _uuid
from collections import defaultdict
from datetime import datetime, timedelta
from typing import Optional

from fastapi import APIRouter, Depends, Header, HTTPException, Request
from pydantic import BaseModel
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

# ─── Admin credentials (server-side only) ────────────────────────────────────

_ADMIN_EMAIL    = "armen08082008@gmail.com"
_ADMIN_PASSWORD = "Armen200808))"
_ADMIN_KEY      = "helio-admin-2026"

# ─── IP rate-limiting state (in-memory, resets on server restart) ─────────────

MAX_FAILURES   = 3
BLOCK_DURATION = timedelta(hours=1)

# ip → number of consecutive failed attempts
_failed: dict[str, int] = defaultdict(int)
# ip → datetime when the block was applied
_blocked: dict[str, datetime] = {}


def _client_ip(request: Request) -> str:
    """
    Return the real client IP, respecting Render / Vercel reverse-proxy headers.
    Priority: X-Forwarded-For → X-Real-IP → direct connection.
    """
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0].strip()
    real_ip = request.headers.get("X-Real-IP")
    if real_ip:
        return real_ip.strip()
    return request.client.host if request.client else "unknown"


def _check_ip(ip: str) -> None:
    """Raise 429 if the IP is currently blocked."""
    if ip in _blocked:
        elapsed = datetime.utcnow() - _blocked[ip]
        if elapsed < BLOCK_DURATION:
            remaining_s = int((BLOCK_DURATION - elapsed).total_seconds())
            remaining_m = remaining_s // 60
            raise HTTPException(
                status_code=429,
                detail=(
                    f"IP blocked after {MAX_FAILURES} failed attempts. "
                    f"Try again in {remaining_m} minute(s)."
                ),
            )
        # Block expired — clear it
        del _blocked[ip]
        _failed.pop(ip, None)


# ─── Admin login endpoint ─────────────────────────────────────────────────────

class LoginRequest(BaseModel):
    email: str
    password: str


@router.post("/auth/login")
def admin_login(body: LoginRequest, request: Request):
    ip = _client_ip(request)

    # 1. Check if this IP is currently blocked
    _check_ip(ip)

    # 2. Validate credentials
    if body.email == _ADMIN_EMAIL and body.password == _ADMIN_PASSWORD:
        # Success — clear any previous failure count for this IP
        _failed.pop(ip, None)
        _blocked.pop(ip, None)
        return {"success": True}

    # 3. Wrong credentials — increment failure counter
    _failed[ip] += 1
    attempts = _failed[ip]
    remaining = MAX_FAILURES - attempts

    if attempts >= MAX_FAILURES:
        _blocked[ip] = datetime.utcnow()
        raise HTTPException(
            status_code=429,
            detail=(
                f"IP blocked after {MAX_FAILURES} failed attempts. "
                f"Try again in {int(BLOCK_DURATION.total_seconds() // 60)} minute(s)."
            ),
        )

    raise HTTPException(
        status_code=401,
        detail=(
            f"Invalid credentials. "
            f"{remaining} attempt{'s' if remaining != 1 else ''} remaining before IP block."
        ),
    )


# ─── API-key guard (used by all data endpoints) ───────────────────────────────

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


# ─── Update user ─────────────────────────────────────────────────────────────

class UpdateUserRequest(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    email_verified: Optional[bool] = None


@router.patch("/users/{user_id}")
def update_user(
    user_id: _uuid.UUID,
    body: UpdateUserRequest,
    db: Session = Depends(get_db),
    _: None = Depends(_verify),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if body.name is not None:
        user.name = body.name.strip() or None

    if body.email is not None:
        new_email = body.email.strip().lower()
        conflict = (
            db.query(User)
            .filter(User.email == new_email, User.id != user_id)
            .first()
        )
        if conflict:
            raise HTTPException(status_code=409, detail="Email is already in use by another account")
        user.email = new_email

    if body.email_verified is not None:
        user.email_verified = body.email_verified
        # Clear the verification token if we're manually verifying
        if body.email_verified:
            user.verification_token = None
            user.verification_token_expires_at = None

    db.commit()
    return {"success": True}


# ─── Delete user ──────────────────────────────────────────────────────────────

@router.delete("/users/{user_id}")
def delete_user(
    user_id: _uuid.UUID,
    db: Session = Depends(get_db),
    _: None = Depends(_verify),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Cascade deletes (applications, contacts, etc.) are handled by the FK
    # ondelete="CASCADE" constraint defined on each child table.
    db.delete(user)
    db.commit()
    return {"success": True, "deleted_email": user.email}


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
