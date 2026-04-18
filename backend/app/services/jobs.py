"""
Job postings are sourced from the static seed in seeds/jobs.py which is
loaded into the DB on every server startup by seeds/runner.py.

Live scraping of Workday and Greenhouse career pages has been disabled:
  - Workday CXS API now requires a browser session + CSRF token for POST requests
    (server-side calls return 422 / 404 regardless of the request body).
  - Greenhouse public board slugs for the target firms are not publicly exposed.

To add or update job listings, edit backend/app/seeds/jobs.py and redeploy.
"""

from sqlalchemy.orm import Session


def fetch_and_store_jobs(db: Session) -> None:  # noqa: ARG001
    """No-op — jobs are managed via the static seed in seeds/jobs.py."""
    print("[JOBS] Live scraper disabled — jobs served from static seed.")
