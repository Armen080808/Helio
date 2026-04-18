from fastapi import APIRouter, Depends, Query
from sqlalchemy import or_
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.job_posting import JobPosting
from ..schemas.job_posting import JobPostingOut

router = APIRouter(prefix="/api/jobs", tags=["jobs"])

# Canonical Canadian location tokens — enforced at the API level so non-Canadian
# rows never surface even if they somehow slip past the scraper or seed.
_CANADA_TOKENS = [
    "toronto", "montreal", "vancouver", "calgary", "ottawa", "edmonton",
    "winnipeg", "hamilton", ", ON", ", QC", ", BC", ", AB", ", MB", ", NS",
    "Canada", "Ontario",
]


@router.get("/", response_model=list[JobPostingOut])
def list_jobs(
    job_type: str | None = Query(None, description="Internship, Full-time, Co-op"),
    finance_only: bool = Query(True),
    db: Session = Depends(get_db),
):
    q = db.query(JobPosting)

    if finance_only:
        q = q.filter(JobPosting.is_finance_relevant == True)  # noqa: E712

    if job_type:
        q = q.filter(JobPosting.job_type == job_type)

    # Always restrict to Canadian locations
    q = q.filter(
        or_(*[JobPosting.location.ilike(f"%{token}%") for token in _CANADA_TOKENS])
    )

    return q.order_by(JobPosting.posted_at.desc().nullslast()).limit(100).all()
