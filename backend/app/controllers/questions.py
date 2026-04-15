from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.interview_question import InterviewQuestion
from ..models.user import User
from ..schemas.interview_question import InterviewQuestionOut
from ..services.auth import get_current_user

router = APIRouter(prefix="/api/questions", tags=["questions"])


@router.get("/", response_model=list[InterviewQuestionOut])
def list_questions(
    category: str | None = Query(None),
    subcategory: str | None = Query(None),
    difficulty: str | None = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(InterviewQuestion)
    if category:
        q = q.filter(InterviewQuestion.category == category)
    if subcategory:
        q = q.filter(InterviewQuestion.subcategory == subcategory)
    if difficulty:
        q = q.filter(InterviewQuestion.difficulty == difficulty)
    return q.order_by(InterviewQuestion.upvotes.desc(), InterviewQuestion.created_at.asc()).all()


@router.get("/{question_id}", response_model=InterviewQuestionOut)
def get_question(question_id: str, db: Session = Depends(get_db)):
    q = db.query(InterviewQuestion).filter(InterviewQuestion.id == question_id).first()
    if not q:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Question not found")
    return q


@router.post("/{question_id}/upvote")
def upvote_question(
    question_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    q = db.query(InterviewQuestion).filter(InterviewQuestion.id == question_id).first()
    if not q:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Question not found")
    q.upvotes += 1
    db.commit()
    return {"upvotes": q.upvotes}
