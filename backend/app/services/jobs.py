import feedparser
from datetime import datetime
from sqlalchemy.orm import Session
from ..models.job_posting import JobPosting

FINANCE_KEYWORDS = [
    "investment banking", "capital markets", "asset management", "private equity",
    "financial analyst", "finance", "equity research", "trading", "M&A",
    "analyst", "associate", "intern", "summer analyst",
]

JOB_FEEDS = [
    (
        "LinkedIn",
        "https://www.linkedin.com/jobs/search/?keywords=finance+analyst+toronto"
        "&location=Toronto&f_JT=I&f_E=1%2C2&trk=public_jobs_jobs-search-bar_search-submit"
        "&position=1&pageNum=0",
    ),
    (
        "Indeed",
        "https://ca.indeed.com/rss?q=finance+analyst&l=Toronto%2C+ON&jt=internship",
    ),
]

BACKUP_FEEDS = [
    ("WorkopolisCa", "http://rss.workopolis.com/jobs?q=finance&l=Toronto"),
    (
        "Glassdoor",
        "https://www.glassdoor.com/Job/toronto-finance-jobs-SRCH_IL.0,7_IC2281069_KO8,15.htm",
    ),
]


def fetch_and_store_jobs(db: Session):
    count = 0
    for source, url in JOB_FEEDS + BACKUP_FEEDS:
        try:
            feed = feedparser.parse(url)
            for entry in feed.entries[:20]:
                link = entry.get("link", "")
                title = entry.get("title", "")
                if not link or not title:
                    continue
                if db.query(JobPosting).filter(JobPosting.url == link[:2000]).first():
                    continue
                is_relevant = any(
                    kw.lower() in title.lower() or kw.lower() in entry.get("summary", "").lower()
                    for kw in FINANCE_KEYWORDS
                )
                published = None
                if hasattr(entry, "published_parsed") and entry.published_parsed:
                    published = datetime(*entry.published_parsed[:6])
                job = JobPosting(
                    title=title[:500],
                    company=entry.get("author", source)[:255],
                    url=link[:2000],
                    location="Toronto, ON",
                    description=entry.get("summary", "")[:2000] if hasattr(entry, "summary") else None,
                    posted_at=published,
                    source=source,
                    is_finance_relevant=is_relevant,
                )
                db.add(job)
                count += 1
        except Exception as e:
            print(f"[JOBS] Failed {source}: {e}")
    db.commit()
    print(f"[JOBS] Added {count} postings")
