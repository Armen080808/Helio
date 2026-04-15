import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.interview_prep import InterviewPrep
from ..models.user import User
from ..schemas.interview_prep import InterviewPrepCreate, InterviewPrepUpdate, InterviewPrepOut
from ..services.auth import get_current_user

router = APIRouter(prefix="/api/prep", tags=["prep"])


@router.get("/", response_model=list[InterviewPrepOut])
def list_prep(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return (
        db.query(InterviewPrep)
        .filter(InterviewPrep.user_id == current_user.id)
        .order_by(InterviewPrep.created_at.desc())
        .all()
    )


@router.post("/", response_model=InterviewPrepOut, status_code=status.HTTP_201_CREATED)
def create_prep(
    body: InterviewPrepCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    question_id = uuid.UUID(body.question_id) if body.question_id else None
    prep = InterviewPrep(
        user_id=current_user.id,
        question_id=question_id,
        question_text=body.question_text,
        category=body.category,
        answer=body.answer,
        target_firm=body.target_firm,
        notes=body.notes,
    )
    db.add(prep)
    db.commit()
    db.refresh(prep)
    return prep


@router.put("/{prep_id}", response_model=InterviewPrepOut)
def update_prep(
    prep_id: str,
    body: InterviewPrepUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    prep = db.query(InterviewPrep).filter(
        InterviewPrep.id == prep_id, InterviewPrep.user_id == current_user.id
    ).first()
    if not prep:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Prep entry not found")

    updates = body.model_dump(exclude_unset=True)
    for field, value in updates.items():
        setattr(prep, field, value)

    # Auto-update last_practiced if practice_count was incremented
    if "practice_count" in updates:
        prep.last_practiced = datetime.utcnow()

    db.commit()
    db.refresh(prep)
    return prep


@router.delete("/{prep_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_prep(
    prep_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    prep = db.query(InterviewPrep).filter(
        InterviewPrep.id == prep_id, InterviewPrep.user_id == current_user.id
    ).first()
    if not prep:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Prep entry not found")
    db.delete(prep)
    db.commit()
