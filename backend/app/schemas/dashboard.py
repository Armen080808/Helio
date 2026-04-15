from pydantic import BaseModel


class DashboardStats(BaseModel):
    total_applications: int
    active_applications: int
    offers_count: int
    contacts_count: int
    upcoming_deadlines: list[dict]
    upcoming_events: list[dict]
    gpa: float | None
    courses_count: int
    market_summary: list[dict]
    recent_news: list[dict]
