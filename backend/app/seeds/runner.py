from sqlalchemy.orm import Session
from ..models.firm import Firm
from ..models.recruiting_deadline import RecruitingDeadline
from ..models.interview_question import InterviewQuestion
from .firms import FIRMS
from .deadlines import DEADLINES
from .questions import QUESTIONS


def seed_all(db: Session):
    seed_firms(db)
    seed_deadlines(db)
    seed_questions(db)


def seed_firms(db: Session):
    existing = {f.name for f in db.query(Firm).all()}
    added = 0
    for f in FIRMS:
        if f["name"] not in existing:
            db.add(Firm(**f))
            added += 1
    db.commit()
    print(f"[SEED] Firms: added {added}")


def seed_deadlines(db: Session):
    existing = {(d.firm_name, d.role, d.cycle) for d in db.query(RecruitingDeadline).all()}
    added = 0
    for d in DEADLINES:
        key = (d["firm_name"], d["role"], d["cycle"])
        if key not in existing:
            db.add(RecruitingDeadline(**d))
            added += 1
    db.commit()
    print(f"[SEED] Deadlines: added {added}")


def seed_questions(db: Session):
    existing_qs = {q.question[:100] for q in db.query(InterviewQuestion).all()}
    added = 0
    for q in QUESTIONS:
        if q["question"][:100] not in existing_qs:
            db.add(InterviewQuestion(**q))
            added += 1
    db.commit()
    print(f"[SEED] Questions: added {added}")
