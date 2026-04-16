from datetime import datetime
from sqlalchemy.orm import Session
from ..models.firm import Firm
from ..models.recruiting_deadline import RecruitingDeadline
from ..models.interview_question import InterviewQuestion
from ..models.news_article import NewsArticle
from .firms import FIRMS
from .deadlines import DEADLINES
from .questions import QUESTIONS
from .news import NEWS_ARTICLES


def seed_all(db: Session):
    seed_firms(db)
    seed_deadlines(db)
    seed_questions(db)
    seed_news(db)


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


def seed_news(db: Session):
    # Build a title→row map so we can update stale URLs in-place
    existing_by_title = {n.title: n for n in db.query(NewsArticle).all()}
    existing_urls = {n.url for n in existing_by_title.values()}
    added = updated = 0
    for item in NEWS_ARTICLES:
        pub = item.get("published_at")
        if pub and hasattr(pub, "year"):
            pub = datetime(pub.year, pub.month, pub.day, 12, 0, 0)
        if item["url"] in existing_urls:
            continue  # already correct
        if item["title"] in existing_by_title:
            # Old fake URL stored under same title — update it
            row = existing_by_title[item["title"]]
            row.url = item["url"]
            updated += 1
        else:
            db.add(NewsArticle(
                title=item["title"],
                url=item["url"],
                source=item["source"],
                summary=item.get("summary"),
                published_at=pub,
                category=item.get("category"),
            ))
            added += 1
    db.commit()
    print(f"[SEED] News: added {added}, url-fixed {updated}")
