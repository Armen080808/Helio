import uuid
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from ..database import get_db
from ..models.client import Client
from ..models.contract import Contract
from ..models.proposal import Proposal
from ..models.user import User
from ..schemas.contract import ContractCreate, ContractOut, SignParty
from ..services.auth import get_current_user

router = APIRouter(prefix="/api/contracts", tags=["contracts"])


def _get_contract_or_404(contract_id: str, user_id: uuid.UUID, db: Session) -> Contract:
    try:
        cid = uuid.UUID(contract_id)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Contract not found")

    contract = (
        db.query(Contract)
        .filter(Contract.id == cid, Contract.user_id == user_id)
        .first()
    )
    if not contract:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Contract not found")
    return contract


@router.get("/", response_model=list[ContractOut])
def list_contracts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    contracts = (
        db.query(Contract)
        .options(joinedload(Contract.client))
        .filter(Contract.user_id == current_user.id)
        .order_by(Contract.created_at.desc())
        .all()
    )
    return [ContractOut.model_validate(c) for c in contracts]


@router.post("/", response_model=ContractOut, status_code=status.HTTP_201_CREATED)
def create_contract(
    body: ContractCreate,
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

    proposal_uuid: uuid.UUID | None = None
    if body.proposal_id:
        try:
            proposal_uuid = uuid.UUID(body.proposal_id)
        except ValueError:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid proposal_id")

        proposal = db.query(Proposal).filter(
            Proposal.id == proposal_uuid, Proposal.user_id == current_user.id
        ).first()
        if not proposal:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Proposal not found")

    contract = Contract(
        user_id=current_user.id,
        client_id=client_uuid,
        proposal_id=proposal_uuid,
        title=body.title,
        body=body.body,
    )
    db.add(contract)
    db.commit()
    db.refresh(contract)

    contract = (
        db.query(Contract)
        .options(joinedload(Contract.client))
        .filter(Contract.id == contract.id)
        .first()
    )
    return ContractOut.model_validate(contract)


@router.patch("/{contract_id}/sign", response_model=ContractOut)
def sign_contract(
    contract_id: str,
    body: SignParty,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    contract = _get_contract_or_404(contract_id, current_user.id, db)
    now = datetime.utcnow()

    if body.party == "user":
        contract.signed_at = now
    else:
        contract.client_signed_at = now

    # Determine new status
    if contract.signed_at and contract.client_signed_at:
        contract.status = "SIGNED"
    elif contract.signed_at or contract.client_signed_at:
        contract.status = "PARTIALLY_SIGNED"

    db.commit()
    db.refresh(contract)

    contract = (
        db.query(Contract)
        .options(joinedload(Contract.client))
        .filter(Contract.id == contract.id)
        .first()
    )
    return ContractOut.model_validate(contract)


@router.delete("/{contract_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_contract(
    contract_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    contract = _get_contract_or_404(contract_id, current_user.id, db)
    db.delete(contract)
    db.commit()
