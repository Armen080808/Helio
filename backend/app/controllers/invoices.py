import json
import uuid
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from ..database import get_db
from ..models.client import Client
from ..models.contract import Contract
from ..models.invoice import Invoice
from ..models.user import User
from ..schemas.invoice import InvoiceCreate, InvoiceOut
from ..services.auth import get_current_user

router = APIRouter(prefix="/api/invoices", tags=["invoices"])


def _get_invoice_or_404(invoice_id: str, user_id: uuid.UUID, db: Session) -> Invoice:
    try:
        iid = uuid.UUID(invoice_id)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invoice not found")

    invoice = (
        db.query(Invoice)
        .filter(Invoice.id == iid, Invoice.user_id == user_id)
        .first()
    )
    if not invoice:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invoice not found")
    return invoice


def _generate_invoice_number(user_id: uuid.UUID, db: Session) -> str:
    count = db.query(Invoice).filter(Invoice.user_id == user_id).count()
    return f"INV-{(count + 1):04d}"


@router.get("/", response_model=list[InvoiceOut])
def list_invoices(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    invoices = (
        db.query(Invoice)
        .options(joinedload(Invoice.client))
        .filter(Invoice.user_id == current_user.id)
        .order_by(Invoice.created_at.desc())
        .all()
    )
    return [InvoiceOut.model_validate(inv) for inv in invoices]


@router.post("/", response_model=InvoiceOut, status_code=status.HTTP_201_CREATED)
def create_invoice(
    body: InvoiceCreate,
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

    contract_uuid: uuid.UUID | None = None
    if body.contract_id:
        try:
            contract_uuid = uuid.UUID(body.contract_id)
        except ValueError:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid contract_id")

        contract = db.query(Contract).filter(
            Contract.id == contract_uuid, Contract.user_id == current_user.id
        ).first()
        if not contract:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Contract not found")

    # Compute financials
    subtotal = sum(item.qty * item.unit_price for item in body.line_items)
    total = subtotal + body.tax
    line_items_json = json.dumps([item.model_dump() for item in body.line_items])
    invoice_number = _generate_invoice_number(current_user.id, db)

    invoice = Invoice(
        user_id=current_user.id,
        client_id=client_uuid,
        contract_id=contract_uuid,
        number=invoice_number,
        title=body.title,
        line_items=line_items_json,
        subtotal=subtotal,
        tax=body.tax,
        total=total,
        currency=body.currency,
        due_date=body.due_date,
    )
    db.add(invoice)
    db.commit()
    db.refresh(invoice)

    invoice = (
        db.query(Invoice)
        .options(joinedload(Invoice.client))
        .filter(Invoice.id == invoice.id)
        .first()
    )
    return InvoiceOut.model_validate(invoice)


@router.patch("/{invoice_id}/paid", response_model=InvoiceOut)
def mark_invoice_paid(
    invoice_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    invoice = _get_invoice_or_404(invoice_id, current_user.id, db)
    invoice.paid_at = datetime.utcnow()
    invoice.status = "PAID"

    db.commit()
    db.refresh(invoice)

    invoice = (
        db.query(Invoice)
        .options(joinedload(Invoice.client))
        .filter(Invoice.id == invoice.id)
        .first()
    )
    return InvoiceOut.model_validate(invoice)


@router.delete("/{invoice_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_invoice(
    invoice_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    invoice = _get_invoice_or_404(invoice_id, current_user.id, db)
    db.delete(invoice)
    db.commit()
