import uuid
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from ..database import get_db
from ..models.client import Client
from ..models.proposal import Proposal
from ..models.user import User
from ..schemas.proposal import ProposalCreate, ProposalOut, ProposalStatusUpdate
from ..services.auth import get_current_user

router = APIRouter(prefix="/api/proposals", tags=["proposals"])

STATUS_TIMESTAMP_MAP = {
    "SENT": "sent_at",
    "VIEWED": "viewed_at",
    "ACCEPTED": "accepted_at",
    "DECLINED": "declined_at",
}


def _get_proposal_or_404(proposal_id: str, user_id: uuid.UUID, db: Session) -> Proposal:
    try:
        pid = uuid.UUID(proposal_id)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Proposal not found")

    proposal = (
        db.query(Proposal)
        .filter(Proposal.id == pid, Proposal.user_id == user_id)
        .first()
    )
    if not proposal:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Proposal not found")
    return proposal


@router.get("/", response_model=list[ProposalOut])
def list_proposals(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    proposals = (
        db.query(Proposal)
        .options(joinedload(Proposal.client))
        .filter(Proposal.user_id == current_user.id)
        .order_by(Proposal.created_at.desc())
        .all()
    )
    return [ProposalOut.model_validate(p) for p in proposals]


@router.post("/", response_model=ProposalOut, status_code=status.HTTP_201_CREATED)
def create_proposal(
    body: ProposalCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        client_uuid = uuid.UUID(body.client_id)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid client_id")

    client = db.query(Client).filter(Client.id == client_uuid, Client.user_id == current_user.id).first()
    if not client:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Client not found")

    proposal = Proposal(
        user_id=current_user.id,
        client_id=client_uuid,
        title=body.title,
        body=body.body,
        amount=body.amount,
        currency=body.currency,
        valid_until=body.valid_until,
    )
    db.add(proposal)
    db.commit()
    db.refresh(proposal)

    # Reload with client relationship
    proposal = (
        db.query(Proposal)
        .options(joinedload(Proposal.client))
        .filter(Proposal.id == proposal.id)
        .first()
    )
    return ProposalOut.model_validate(proposal)


@router.patch("/{proposal_id}/status", response_model=ProposalOut)
def update_proposal_status(
    proposal_id: str,
    body: ProposalStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    proposal = _get_proposal_or_404(proposal_id, current_user.id, db)
    proposal.status = body.status

    ts_field = STATUS_TIMESTAMP_MAP.get(body.status)
    if ts_field:
        setattr(proposal, ts_field, datetime.utcnow())

    db.commit()
    db.refresh(proposal)

    proposal = (
        db.query(Proposal)
        .options(joinedload(Proposal.client))
        .filter(Proposal.id == proposal.id)
        .first()
    )
    return ProposalOut.model_validate(proposal)


@router.delete("/{proposal_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_proposal(
    proposal_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    proposal = _get_proposal_or_404(proposal_id, current_user.id, db)
    db.delete(proposal)
    db.commit()
