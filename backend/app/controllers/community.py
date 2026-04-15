import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.interview_review import InterviewReview
from ..models.offer_report import OfferReport
from ..models.user import User
from ..schemas.interview_review import InterviewReviewCreate, InterviewReviewOut
from ..schemas.offer_report import OfferReportCreate, OfferReportOut
from ..services.auth import get_current_user

router = APIRouter(prefix="/api/community", tags=["community"])


# ----- Interview Reviews -----

@router.get("/reviews", response_model=list[InterviewReviewOut])
def list_reviews(db: Session = Depends(get_db)):
    return (
        db.query(InterviewReview)
        .order_by(InterviewReview.created_at.desc())
        .all()
    )


@router.get("/reviews/{firm_id}", response_model=list[InterviewReviewOut])
def get_firm_reviews(firm_id: str, db: Session = Depends(get_db)):
    return (
        db.query(InterviewReview)
        .filter(InterviewReview.firm_id == firm_id)
        .order_by(InterviewReview.created_at.desc())
        .all()
    )


@router.post("/reviews", response_model=InterviewReviewOut, status_code=status.HTTP_201_CREATED)
def create_review(
    body: InterviewReviewCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    firm_id = uuid.UUID(body.firm_id) if body.firm_id else None
    review = InterviewReview(
        user_id=current_user.id,
        firm_id=firm_id,
        firm_name=body.firm_name,
        role=body.role,
        interview_date=body.interview_date,
        rounds=body.rounds,
        outcome=body.outcome,
        difficulty=body.difficulty,
        questions_asked=body.questions_asked,
        tips=body.tips,
        anonymous=body.anonymous,
    )
    db.add(review)
    db.commit()
    db.refresh(review)
    return review


# ----- Offer Reports -----

@router.get("/offers", response_model=list[OfferReportOut])
def list_offers(db: Session = Depends(get_db)):
    return (
        db.query(OfferReport)
        .order_by(OfferReport.created_at.desc())
        .all()
    )


@router.get("/offers/{firm_id}", response_model=list[OfferReportOut])
def get_firm_offers(firm_id: str, db: Session = Depends(get_db)):
    return (
        db.query(OfferReport)
        .filter(OfferReport.firm_id == firm_id)
        .order_by(OfferReport.created_at.desc())
        .all()
    )


@router.post("/offers", response_model=OfferReportOut, status_code=status.HTTP_201_CREATED)
def create_offer_report(
    body: OfferReportCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    firm_id = uuid.UUID(body.firm_id) if body.firm_id else None
    report = OfferReport(
        user_id=current_user.id,
        firm_id=firm_id,
        firm_name=body.firm_name,
        role=body.role,
        type=body.type,
        cycle=body.cycle,
        base_salary=body.base_salary,
        signing_bonus=body.signing_bonus,
        internship_stipend=body.internship_stipend,
        hourly_rate=body.hourly_rate,
        anonymous=body.anonymous,
        notes=body.notes,
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    return report
