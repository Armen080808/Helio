from datetime import datetime, date
from sqlalchemy.orm import Session
from ..models.firm import Firm
from ..models.recruiting_deadline import RecruitingDeadline
from ..models.interview_question import InterviewQuestion
from ..models.news_article import NewsArticle
from ..models.market_snapshot import MarketSnapshot
from ..models.recruiting_event import RecruitingEvent
from ..models.job_posting import JobPosting
from .firms import FIRMS
from .deadlines import DEADLINES
from .questions import QUESTIONS
from .news import NEWS_ARTICLES
from .market import MARKET_SNAPSHOTS
from .events import EVENTS
from .jobs import JOBS

# Canadian location indicators — any job whose location contains none of
# these is considered non-Canadian and will be purged on startup.
_CANADA_TOKENS = frozenset([
    "toronto", "montreal", "vancouver", "calgary", "ottawa", "edmonton",
    "winnipeg", "quebec", "hamilton", "kitchener",
    ", on", ", qc", ", bc", ", ab", ", mb", ", ns", ", sk",
    "canada", "ontario", "british columbia", "alberta",
])


def seed_all(db: Session):
    seed_firms(db)
    seed_deadlines(db)
    seed_questions(db)
    seed_news(db)
    seed_market(db)
    seed_events(db)
    seed_jobs(db)


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


def seed_market(db: Session):
    """
    Upsert static Canadian market snapshots for today.
    Runs on every startup; also purges any stale non-Canadian symbols
    (e.g. GS, JPM, ^GSPC leftover from older deployments) so they never
    become the 'latest_date' and hide the Canadian data.
    """
    # ── 1. Remove any rows whose symbol is not in our Canadian set ──────────
    known_symbols = {snap["symbol"] for snap in MARKET_SNAPSHOTS}
    deleted = (
        db.query(MarketSnapshot)
        .filter(~MarketSnapshot.symbol.in_(known_symbols))
        .delete(synchronize_session=False)
    )
    if deleted:
        db.commit()
        print(f"[SEED] Market: purged {deleted} stale non-Canadian row(s)")

    # ── 2. Seed Canadian snapshots for today (skip if already present) ──────
    today = date.today()
    existing_symbols = {
        row.symbol
        for row in db.query(MarketSnapshot.symbol)
        .filter(MarketSnapshot.snapshot_date == today)
        .all()
    }

    added = 0
    for snap in MARKET_SNAPSHOTS:
        if snap["symbol"] in existing_symbols:
            continue  # already have a live or seeded price for today
        db.add(MarketSnapshot(
            symbol=snap["symbol"],
            name=snap["name"],
            price=snap["price"],
            change=snap["change"],
            change_pct=snap["change_pct"],
            volume=snap.get("volume"),
            market_cap=snap.get("market_cap"),
            snapshot_date=today,
        ))
        added += 1

    if added:
        db.commit()
    print(f"[SEED] Market: seeded {added} static snapshot(s) for {today}")


def seed_jobs(db: Session):
    """
    1. Purge any existing job posting whose location is not Canadian.
    2. Seed static Canadian job postings (deduped by URL).
    """
    # ── 1. Purge non-Canadian rows ───────────────────────────────────────────
    all_jobs = db.query(JobPosting).all()
    purged = 0
    for job in all_jobs:
        loc = (job.location or "").lower()
        if not any(token in loc for token in _CANADA_TOKENS):
            db.delete(job)
            purged += 1
    if purged:
        db.commit()
        print(f"[SEED] Jobs: purged {purged} non-Canadian posting(s)")

    # ── 2. Seed static entries ───────────────────────────────────────────────
    existing_urls = {j.url for j in db.query(JobPosting.url).all()}
    added = 0
    for job in JOBS:
        if job["url"] in existing_urls:
            continue
        db.add(JobPosting(
            title=job["title"],
            company=job["company"],
            location=job["location"],
            url=job["url"],
            job_type=job.get("job_type"),
            description=job.get("description"),
            posted_at=job.get("posted_at"),
            source=job["source"],
            is_finance_relevant=True,
        ))
        added += 1
    if added:
        db.commit()
    print(f"[SEED] Jobs: added {added} Canadian posting(s)")


def seed_events(db: Session):
    """
    Seed public recruiting & networking events. Deduplicates by title + date
    so re-deploys never create duplicate rows.
    """
    existing = {
        (e.title, e.date)
        for e in db.query(RecruitingEvent.title, RecruitingEvent.date)
        .filter(RecruitingEvent.is_public == True)  # noqa: E712
        .all()
    }
    added = 0
    for ev in EVENTS:
        key = (ev["title"], ev["date"])
        if key in existing:
            continue
        db.add(RecruitingEvent(
            user_id=None,
            firm_id=None,
            firm_name=ev["firm_name"],
            event_type=ev["event_type"],
            title=ev["title"],
            date=ev["date"],
            location=ev.get("location"),
            description=ev.get("description"),
            is_public=True,
        ))
        added += 1
    if added:
        db.commit()
    print(f"[SEED] Events: added {added} public event(s)")
