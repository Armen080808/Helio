from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.firm import Firm
from ..models.recruiting_deadline import RecruitingDeadline
from ..models.interview_review import InterviewReview
from ..schemas.firm import FirmOut, FirmCreate
from ..services.auth import get_current_user
from ..models.user import User

router = APIRouter(prefix="/api/firms", tags=["firms"])


@router.get("/", response_model=list[FirmOut])
def list_firms(
    type: str | None = Query(None, description="Filter by firm type: IB, AM, PE, Consulting, VC"),
    db: Session = Depends(get_db),
):
    q = db.query(Firm)
    if type:
        q = q.filter(Firm.type == type)
    return q.order_by(Firm.name).all()


@router.get("/{firm_id}")
def get_firm(firm_id: str, db: Session = Depends(get_db)):
    firm = db.query(Firm).filter(Firm.id == firm_id).first()
    if not firm:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Firm not found")

    deadlines = (
        db.query(RecruitingDeadline)
        .filter(RecruitingDeadline.firm_id == firm.id)
        .order_by(RecruitingDeadline.application_deadline)
        .all()
    )
    reviews = (
        db.query(InterviewReview)
        .filter(InterviewReview.firm_id == firm.id)
        .order_by(InterviewReview.created_at.desc())
        .limit(10)
        .all()
    )

    firm_data = FirmOut.model_validate(firm).model_dump()
    firm_data["deadlines"] = [
        {
            "id": str(d.id),
            "role": d.role,
            "cycle": d.cycle,
            "application_deadline": str(d.application_deadline) if d.application_deadline else None,
            "application_open": str(d.application_open) if d.application_open else None,
            "notes": d.notes,
        }
        for d in deadlines
    ]
    firm_data["reviews"] = [
        {
            "id": str(r.id),
            "role": r.role,
            "outcome": r.outcome,
            "difficulty": r.difficulty,
            "tips": r.tips,
            "anonymous": r.anonymous,
            "upvotes": r.upvotes,
            "created_at": str(r.created_at),
        }
        for r in reviews
    ]
    return firm_data


@router.post("/", response_model=FirmOut, status_code=status.HTTP_201_CREATED)
def create_firm(
    body: FirmCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    existing = db.query(Firm).filter(Firm.name == body.name).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Firm already exists")

    firm = Firm(**body.model_dump(), is_community_added=True)
    db.add(firm)
    db.commit()
    db.refresh(firm)
    return firm
