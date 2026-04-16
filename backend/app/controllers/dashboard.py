from collections import Counter
from datetime import date, datetime, timedelta
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.application import Application
from ..models.contact import Contact
from ..models.recruiting_deadline import RecruitingDeadline
from ..models.recruiting_event import RecruitingEvent
from ..models.user import User
from ..schemas.dashboard import DashboardStats
from ..services.auth import get_current_user

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

STAGES = ["Wishlist", "Applied", "OA", "Phone Screen", "Superday", "Offer", "Rejected"]


@router.get("/stats", response_model=DashboardStats)
def get_dashboard(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Pipeline stats
    apps = db.query(Application).filter(Application.user_id == current_user.id).all()
    stage_counts = Counter(a.stage for a in apps)
    by_stage = {s: stage_counts.get(s, 0) for s in STAGES}

    # Contacts count
    contacts_total = db.query(Contact).filter(Contact.user_id == current_user.id).count()

    # Upcoming deadlines count (next 30 days)
    today = date.today()
    month_out = today + timedelta(days=30)
    upcoming_deadlines = (
        db.query(RecruitingDeadline)
        .filter(
            RecruitingDeadline.application_deadline >= today,
            RecruitingDeadline.application_deadline <= month_out,
        )
        .count()
    )

    # Interviews this week (Superday / Phone Screen stages)
    now = datetime.utcnow()
    week_dt = now + timedelta(days=7)
    interviews_this_week = len([
        a for a in apps
        if a.stage in ("Phone Screen", "Superday")
    ])

    return DashboardStats(
        applications_total=len(apps),
        applications_by_stage=by_stage,
        contacts_total=contacts_total,
        upcoming_deadlines=upcoming_deadlines,
        interviews_this_week=interviews_this_week,
    )
