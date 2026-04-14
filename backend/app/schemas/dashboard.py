from pydantic import BaseModel


class DashboardStats(BaseModel):
    active_proposals: int
    unsigned_contracts: int
    outstanding_amount: float
    upcoming_calls: int
