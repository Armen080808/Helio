"""
Job scraper — fetches postings directly from firm career pages.

Most Bay Street firms use Workday as their ATS. Workday exposes a consistent
public JSON API (the same one that renders their job board pages in the browser).
Pattern: POST https://{tenant}.wd{n}.myworkdayjobs.com/wday/cxs/{tenant}/{board}/jobs

For non-Workday firms (Goldman Sachs, JP Morgan, McKinsey etc.) we use their
specific career page APIs where available.
"""

import httpx
from datetime import datetime
from sqlalchemy.orm import Session
from ..models.job_posting import JobPosting

# ─── Keywords ────────────────────────────────────────────────────────────────

FINANCE_KEYWORDS = [
    "investment banking", "capital markets", "asset management", "private equity",
    "equity research", "fixed income", "trading", "derivatives", "portfolio",
    "financial analyst", "corporate finance", "m&a", "mergers", "acquisitions",
    "leveraged finance", "debt capital", "equity capital", "restructuring",
    "quantitative", "quant", "risk", "credit", "hedge fund", "infrastructure",
]

ROLE_KEYWORDS = [
    "summer analyst", "summer associate", "intern", "internship", "co-op",
    "associate", "analyst", "graduate", "campus", "new grad",
]

EXCLUDE_KEYWORDS = [
    "branch", "teller", "personal banking", "customer service", "retail",
    "software engineer", "developer", "devops", "sre", "data engineer",
    "hr ", "human resources", "marketing", "communications", "legal counsel",
    "administrative", "receptionist", "janitor", "security guard",
]

# ─── Workday firm registry ────────────────────────────────────────────────────
# (display_name, workday_tenant, workday_board, location, wd_version)

WORKDAY_FIRMS = [
    # ── Canadian Big 5 ──────────────────────────────────────────────────────
    ("TD Securities",           "td",              "TD_Bank_Careers",        "Toronto, ON", 3),
    ("RBC Capital Markets",     "rbc",             "RBC_Careers",            "Toronto, ON", 3),
    ("BMO Capital Markets",     "bmo",             "External",               "Toronto, ON", 3),
    ("Scotiabank GBM",          "scotiabank",      "Scotiabank_Careers",     "Toronto, ON", 3),
    ("CIBC Capital Markets",    "cibc",            "External",               "Toronto, ON", 3),
    ("National Bank Financial", "nbc",             "External",               "Montreal, QC", 3),
    # ── US Bulge Brackets ────────────────────────────────────────────────────
    ("Goldman Sachs",           "gs",              "External_Career_Website", "Toronto, ON", 5),
    ("Morgan Stanley",          "morganstanley",   "External",               "Toronto, ON", 3),
    ("JP Morgan",               "jpmc",            "campus_recruiting",      "Toronto, ON", 5),
    ("Barclays",                "barclays",        "External",               "Toronto, ON", 3),
    ("Citi",                    "citi",            "External",               "Toronto, ON", 3),
    ("UBS",                     "ubs",             "UBS_Experienced",        "Toronto, ON", 3),
    ("Deutsche Bank",           "db",              "External_Career_Site",   "Toronto, ON", 3),
    # ── Asset Management / Pensions ──────────────────────────────────────────
    ("Brookfield Asset Management", "brookfield",  "External",               "Toronto, ON", 3),
    ("CPP Investments",         "cppinvestments",  "CPP_Careers",            "Toronto, ON", 3),
    ("OMERS",                   "omers",           "OMERS_Careers",          "Toronto, ON", 3),
    ("Ontario Teachers' Pension Plan", "otpp",     "OTPP",                   "Toronto, ON", 3),
    ("Manulife",                "manulife",        "External",               "Toronto, ON", 3),
    # ── Consulting ───────────────────────────────────────────────────────────
    ("Deloitte",                "deloitte",        "DeloitteCareerSite",     "Toronto, ON", 3),
    ("KPMG",                    "kpmg",            "External",               "Toronto, ON", 3),
    ("EY",                      "ey",              "EY_External",            "Toronto, ON", 3),
    ("PwC",                     "pwc",             "Global_Campus",          "Toronto, ON", 3),
    # ── Elite Boutiques ──────────────────────────────────────────────────────
    ("Lazard",                  "lazard",          "External",               "Toronto, ON", 3),
    ("Evercore",                "evercore",        "External",               "New York, NY", 3),
    ("Rothschild & Co",         "rothschild",      "External",               "Toronto, ON", 3),
]

SEARCH_TERMS = [
    "summer analyst",
    "summer associate",
    "intern",
    "investment banking analyst",
    "capital markets",
    "finance",
]

_HEADERS = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "en-US,en;q=0.9",
}


# ─── Helpers ──────────────────────────────────────────────────────────────────

def _is_relevant(title: str, description: str = "") -> bool:
    text = (title + " " + description).lower()
    # Hard exclude non-finance roles
    if any(kw in text for kw in EXCLUDE_KEYWORDS):
        return False
    has_role = any(kw in text for kw in ROLE_KEYWORDS)
    has_finance = any(kw in text for kw in FINANCE_KEYWORDS)
    return has_role or has_finance


def _detect_job_type(title: str) -> str | None:
    t = title.lower()
    if any(k in t for k in ["intern", "summer analyst", "summer associate", "co-op", "coop"]):
        return "Internship"
    if "full-time" in t or "full time" in t or "new analyst" in t or "new graduate" in t:
        return "Full-time"
    if "associate" in t:
        return "Full-time"
    return None


def _already_exists(db: Session, url: str) -> bool:
    return db.query(JobPosting).filter(JobPosting.url == url[:2000]).first() is not None


def _save(db: Session, *, title: str, company: str, url: str, location: str,
          description: str | None, posted_at: datetime | None, source: str) -> bool:
    url = url[:2000]
    if not title or not url or _already_exists(db, url):
        return False
    db.add(JobPosting(
        title=title[:500],
        company=company[:255],
        url=url,
        location=location[:255] if location else None,
        job_type=_detect_job_type(title),
        description=(description or "")[:2000] or None,
        posted_at=posted_at,
        source=source,
        is_finance_relevant=_is_relevant(title, description or ""),
    ))
    return True


# ─── Workday scraper ──────────────────────────────────────────────────────────

def _workday_fetch(tenant: str, board: str, wd_version: int, search: str) -> list[dict]:
    """Call the Workday public jobs JSON API for one firm."""
    url = (
        f"https://{tenant}.wd{wd_version}.myworkdayjobs.com"
        f"/wday/cxs/{tenant}/{board}/jobs"
    )
    body = {
        "appliedFacets": {},
        "limit": 20,
        "offset": 0,
        "searchText": search,
    }
    with httpx.Client(timeout=15, headers=_HEADERS, follow_redirects=True) as client:
        r = client.post(url, json=body)
        r.raise_for_status()
        return r.json().get("jobPostings", [])


def _scrape_workday_firm(
    db: Session,
    firm_name: str,
    tenant: str,
    board: str,
    location: str,
    wd_version: int,
) -> int:
    count = 0
    seen_paths: set[str] = set()

    for search in SEARCH_TERMS:
        try:
            postings = _workday_fetch(tenant, board, wd_version, search)
        except Exception as e:
            print(f"[JOBS] {firm_name} ({search}): {e}")
            break  # if one search fails, skip remaining terms for this firm

        for p in postings:
            title = p.get("title", "").strip()
            ext_path = p.get("externalPath", "")

            if not title or not ext_path or ext_path in seen_paths:
                continue
            if not _is_relevant(title):
                continue

            seen_paths.add(ext_path)
            job_url = (
                f"https://{tenant}.wd{wd_version}.myworkdayjobs.com"
                f"/en-US/{board}{ext_path}"
            )
            loc = p.get("locationsText") or location

            if _save(db, title=title, company=firm_name, url=job_url,
                     location=loc, description=None, posted_at=None, source=firm_name):
                count += 1

    return count


# ─── McKinsey (Greenhouse) ────────────────────────────────────────────────────

def _scrape_mckinsey(db: Session) -> int:
    """McKinsey uses Greenhouse. Their public jobs JSON endpoint is open."""
    count = 0
    try:
        url = "https://boards-api.greenhouse.io/v1/boards/mckinsey/jobs?content=true"
        with httpx.Client(timeout=15, headers=_HEADERS, follow_redirects=True) as client:
            r = client.get(url)
            r.raise_for_status()
            jobs = r.json().get("jobs", [])

        for job in jobs[:40]:
            title = job.get("title", "").strip()
            if not _is_relevant(title):
                continue
            job_url = job.get("absolute_url", "")
            location = job.get("location", {}).get("name", "Toronto, ON")
            # Filter for Toronto/Canada if possible
            if location and "toronto" not in location.lower() and "canada" not in location.lower():
                continue
            updated_at = job.get("updated_at", "")
            posted = None
            if updated_at:
                try:
                    posted = datetime.fromisoformat(updated_at.replace("Z", "+00:00").replace("+0000", "+00:00"))
                except Exception:
                    pass
            if _save(db, title=title, company="McKinsey & Company", url=job_url,
                     location=location, description=None, posted_at=posted, source="McKinsey"):
                count += 1
    except Exception as e:
        print(f"[JOBS] McKinsey (Greenhouse): {e}")
    return count


def _scrape_bcg(db: Session) -> int:
    """BCG also uses Greenhouse."""
    count = 0
    try:
        url = "https://boards-api.greenhouse.io/v1/boards/bcg/jobs?content=true"
        with httpx.Client(timeout=15, headers=_HEADERS, follow_redirects=True) as client:
            r = client.get(url)
            r.raise_for_status()
            jobs = r.json().get("jobs", [])

        for job in jobs[:40]:
            title = job.get("title", "").strip()
            if not _is_relevant(title):
                continue
            job_url = job.get("absolute_url", "")
            location = job.get("location", {}).get("name", "Toronto, ON")
            if location and "toronto" not in location.lower() and "canada" not in location.lower():
                continue
            if _save(db, title=title, company="Boston Consulting Group", url=job_url,
                     location=location, description=None, posted_at=None, source="BCG"):
                count += 1
    except Exception as e:
        print(f"[JOBS] BCG (Greenhouse): {e}")
    return count


def _scrape_bain(db: Session) -> int:
    """Bain uses Greenhouse."""
    count = 0
    try:
        url = "https://boards-api.greenhouse.io/v1/boards/bain/jobs?content=true"
        with httpx.Client(timeout=15, headers=_HEADERS, follow_redirects=True) as client:
            r = client.get(url)
            r.raise_for_status()
            jobs = r.json().get("jobs", [])

        for job in jobs[:40]:
            title = job.get("title", "").strip()
            if not _is_relevant(title):
                continue
            job_url = job.get("absolute_url", "")
            location = job.get("location", {}).get("name", "Toronto, ON")
            if location and "toronto" not in location.lower() and "canada" not in location.lower():
                continue
            if _save(db, title=title, company="Bain & Company", url=job_url,
                     location=location, description=None, posted_at=None, source="Bain"):
                count += 1
    except Exception as e:
        print(f"[JOBS] Bain (Greenhouse): {e}")
    return count


# ─── Master fetch function ────────────────────────────────────────────────────

def fetch_and_store_jobs(db: Session):
    total = 0

    print("[JOBS] Starting firm career page scrape…")

    # Workday firms
    for firm_name, tenant, board, location, wd_ver in WORKDAY_FIRMS:
        added = _scrape_workday_firm(db, firm_name, tenant, board, location, wd_ver)
        if added:
            print(f"[JOBS]   {firm_name}: +{added}")
        total += added

    # Greenhouse firms (consulting)
    for fn in [_scrape_mckinsey, _scrape_bcg, _scrape_bain]:
        added = fn(db)
        total += added

    db.commit()
    print(f"[JOBS] Done — {total} new postings stored")
