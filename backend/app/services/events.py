"""
Fetch recruiting & networking events from public Ontario/UofT sources.
Runs every 30 minutes via the scheduler. Fails silently — the static
seed always provides baseline data.

Live sources:
  1. UofT Events (Localist API)  — events.utoronto.ca/api/2/events
  2. Meetup RSS feeds            — Toronto Finance & Investing groups
"""
import httpx
import feedparser
from datetime import datetime, timezone
from sqlalchemy.orm import Session

from ..models.recruiting_event import RecruitingEvent

# ── Live sources ────────────────────────────────────────────────────────────

UOFT_API = "https://events.utoronto.ca/api/2/events"
UOFT_QUERY_PARAMS = [
    {"pp": 20, "days": 90, "q": "finance career investing"},
    {"pp": 20, "days": 90, "q": "networking business rotman"},
    {"pp": 20, "days": 90, "q": "recruiting banking consulting"},
]

RSS_SOURCES = [
    ("Toronto Finance Meetup",   "https://www.meetup.com/toronto-finance-investing/events/rss/"),
    ("CFA Society Toronto",      "https://cfatoronto.ca/events/feed/"),
    ("UofT Events Finance",      "https://events.utoronto.ca/?q=finance+career&format=rss"),
]

_TIMEOUT = httpx.Timeout(10.0)

# ── Helpers ─────────────────────────────────────────────────────────────────

def _already_exists(db: Session, title: str, event_date: datetime) -> bool:
    """Avoid duplicate inserts by checking title + date."""
    return (
        db.query(RecruitingEvent)
        .filter(
            RecruitingEvent.title == title[:500],
            RecruitingEvent.date  == event_date,
            RecruitingEvent.is_public == True,  # noqa: E712
        )
        .first()
        is not None
    )


def _infer_event_type(title: str, description: str = "") -> str:
    text = (title + " " + description).lower()
    if any(w in text for w in ["info session", "information session", "presentation", "overview"]):
        return "Info Session"
    if any(w in text for w in ["networking", "mixer", "cocktail", "gala", "meet"]):
        return "Networking"
    if any(w in text for w in ["workshop", "prep", "training", "bootcamp"]):
        return "Workshop"
    if any(w in text for w in ["superday", "super day", "final round"]):
        return "Superday"
    return "Other"


# ── UofT Localist API ────────────────────────────────────────────────────────

def _fetch_uoft_events(db: Session) -> int:
    added = 0
    with httpx.Client(timeout=_TIMEOUT) as client:
        for params in UOFT_QUERY_PARAMS:
            try:
                resp = client.get(UOFT_API, params=params)
                if resp.status_code != 200:
                    continue
                data = resp.json()
                for item in data.get("events", []):
                    ev = item.get("event", {})
                    title = (ev.get("title") or "").strip()[:500]
                    if not title:
                        continue
                    # Parse date — Localist returns "YYYY-MM-DD HH:MM:SS" or ISO strings
                    raw_date = ev.get("event_instances", [{}])[0].get("event_instance", {}).get("start") if ev.get("event_instances") else ev.get("date_utc")
                    if not raw_date:
                        continue
                    try:
                        # Handle ISO 8601 or Localist format
                        raw_date = raw_date.replace("Z", "+00:00")
                        event_dt = datetime.fromisoformat(raw_date).replace(tzinfo=None)
                    except (ValueError, AttributeError):
                        continue
                    if event_dt < datetime.utcnow():
                        continue
                    if _already_exists(db, title, event_dt):
                        continue
                    description = (ev.get("description_text") or ev.get("description") or "")[:2000]
                    location = (ev.get("address") or ev.get("location_name") or "University of Toronto")[:500]
                    db.add(RecruitingEvent(
                        user_id=None,
                        firm_name="UofT Events",
                        event_type=_infer_event_type(title, description),
                        title=title,
                        date=event_dt,
                        location=location,
                        description=description,
                        is_public=True,
                    ))
                    added += 1
            except Exception as exc:
                print(f"[EVENTS] UofT API error ({params.get('q')}): {exc}")
    if added:
        db.commit()
    return added


# ── RSS feeds ────────────────────────────────────────────────────────────────

def _fetch_rss_events(db: Session) -> int:
    added = 0
    for source_name, url in RSS_SOURCES:
        try:
            feed = feedparser.parse(url)
            for entry in feed.entries[:15]:
                title = (getattr(entry, "title", "") or "").strip()[:500]
                if not title:
                    continue
                # Parse published/updated date
                raw_dt = getattr(entry, "published_parsed", None) or getattr(entry, "updated_parsed", None)
                if not raw_dt:
                    continue
                import time as _time
                event_dt = datetime(*raw_dt[:6])
                if event_dt < datetime.utcnow():
                    continue
                if _already_exists(db, title, event_dt):
                    continue
                description = (getattr(entry, "summary", "") or "")[:2000]
                location = (getattr(entry, "location", "") or "Toronto, ON")[:500]
                db.add(RecruitingEvent(
                    user_id=None,
                    firm_name=source_name,
                    event_type=_infer_event_type(title, description),
                    title=title,
                    date=event_dt,
                    location=location,
                    description=description,
                    is_public=True,
                ))
                added += 1
        except Exception as exc:
            print(f"[EVENTS] RSS error ({source_name}): {exc}")
    if added:
        db.commit()
    return added


# ── Public entry point ───────────────────────────────────────────────────────

def fetch_and_store_events(db: Session) -> None:
    """Called by scheduler every 30 minutes."""
    uoft_added = _fetch_uoft_events(db)
    rss_added  = _fetch_rss_events(db)
    total = uoft_added + rss_added
    print(f"[EVENTS] Refresh complete — {total} new public event(s) added")
