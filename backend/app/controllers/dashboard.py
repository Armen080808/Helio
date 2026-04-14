from datetime import datetime

from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.booking import Booking
from ..models.contract import Contract
from ..models.invoice import Invoice
from ..models.proposal import Proposal
from ..models.user import User
from ..schemas.dashboard import DashboardStats
from ..services.auth import get_current_user

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("/", response_model=DashboardStats)
def get_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    uid = current_user.id

    active_proposals = (
        db.query(func.count(Proposal.id))
        .filter(
            Proposal.user_id == uid,
            Proposal.status.in_(["DRAFT", "SENT", "VIEWED"]),
        )
        .scalar()
        or 0
    )

    unsigned_contracts = (
        db.query(func.count(Contract.id))
        .filter(
            Contract.user_id == uid,
            Contract.status != "SIGNED",
        )
        .scalar()
        or 0
    )

    outstanding_amount = (
        db.query(func.coalesce(func.sum(Invoice.total), 0.0))
        .filter(
            Invoice.user_id == uid,
            Invoice.status.in_(["SENT", "VIEWED", "PARTIAL", "OVERDUE"]),
        )
        .scalar()
        or 0.0
    )

    now = datetime.utcnow()
    upcoming_calls = (
        db.query(func.count(Booking.id))
        .filter(
            Booking.user_id == uid,
            Booking.status == "CONFIRMED",
            Booking.start_at >= now,
        )
        .scalar()
        or 0
    )

    return DashboardStats(
        active_proposals=active_proposals,
        unsigned_contracts=unsigned_contracts,
        outstanding_amount=float(outstanding_amount),
        upcoming_calls=upcoming_calls,
    )
