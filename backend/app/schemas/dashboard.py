from pydantic import BaseModel
from typing import Any


class DashboardStats(BaseModel):
    applications_total: int
    applications_by_stage: dict[str, int]
    contacts_total: int
    upcoming_deadlines: int
    interviews_this_week: int
