from datetime import date, timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.recruiting_deadline import RecruitingDeadline
from ..models.user import User
from ..schemas.recruiting_deadline import RecruitingDeadlineCreate, RecruitingDeadlineOut
from ..services.auth import get_current_user

router = APIRouter(prefix="/api/deadlines", tags=["deadlines"])


@router.get("/upcoming", response_model=list[RecruitingDeadlineOut])
def get_upcoming_deadlines(db: Session = Depends(get_db)):
    today = date.today()
    month = today + timedelta(days=30)
    return (
        db.query(RecruitingDeadline)
        .filter(
            RecruitingDeadline.application_deadline >= today,
            RecruitingDeadline.application_deadline <= month,
        )
        .order_by(RecruitingDeadline.application_deadline)
        .all()
    )


@router.get("/", response_model=list[RecruitingDeadlineOut])
def list_deadlines(db: Session = Depends(get_db)):
    return (
        db.query(RecruitingDeadline)
        .order_by(RecruitingDeadline.application_deadline.asc().nullslast())
        .all()
    )


@router.post("/", response_model=RecruitingDeadlineOut, status_code=status.HTTP_201_CREATED)
def create_deadline(
    body: RecruitingDeadlineCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    import uuid
    firm_id = uuid.UUID(body.firm_id) if body.firm_id else None
    deadline = RecruitingDeadline(
        firm_id=firm_id,
        firm_name=body.firm_name,
        role=body.role,
        type=body.type,
        cycle=body.cycle,
        application_open=body.application_open,
        application_deadline=body.application_deadline,
        networking_season_start=body.networking_season_start,
        notes=body.notes,
        source_url=body.source_url,
        is_community_added=True,
        submitted_by_user_id=current_user.id,
        verified=False,
    )
    db.add(deadline)
    db.commit()
    db.refresh(deadline)
    return deadline


@router.put("/{deadline_id}/verify", response_model=RecruitingDeadlineOut)
def verify_deadline(
    deadline_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # TODO: add admin role check when role system is implemented
    deadline = db.query(RecruitingDeadline).filter(RecruitingDeadline.id == deadline_id).first()
    if not deadline:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Deadline not found")
    deadline.verified = True
    db.commit()
    db.refresh(deadline)
    return deadline
