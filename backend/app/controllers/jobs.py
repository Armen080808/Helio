from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.job_posting import JobPosting
from ..schemas.job_posting import JobPostingOut

router = APIRouter(prefix="/api/jobs", tags=["jobs"])


@router.get("/", response_model=list[JobPostingOut])
def list_jobs(
    job_type: str | None = Query(None, description="Internship, Full-time, Co-op"),
    location: str | None = Query(None),
    finance_only: bool = Query(True),
    db: Session = Depends(get_db),
):
    q = db.query(JobPosting)
    if finance_only:
        q = q.filter(JobPosting.is_finance_relevant == True)  # noqa: E712
    if job_type:
        q = q.filter(JobPosting.job_type == job_type)
    if location:
        q = q.filter(JobPosting.location.ilike(f"%{location}%"))
    return q.order_by(JobPosting.posted_at.desc().nullslast()).limit(50).all()
