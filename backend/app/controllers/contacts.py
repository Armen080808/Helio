import uuid
from datetime import date, timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.contact import Contact
from ..models.user import User
from ..schemas.contact import ContactCreate, ContactUpdate, ContactOut
from ..services.auth import get_current_user

router = APIRouter(prefix="/api/contacts", tags=["contacts"])


@router.get("/due", response_model=list[ContactOut])
def get_due_contacts(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    today = date.today()
    week = today + timedelta(days=7)
    return (
        db.query(Contact)
        .filter(
            Contact.user_id == current_user.id,
            Contact.follow_up_date >= today,
            Contact.follow_up_date <= week,
        )
        .order_by(Contact.follow_up_date)
        .all()
    )


@router.get("/", response_model=list[ContactOut])
def list_contacts(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return (
        db.query(Contact)
        .filter(Contact.user_id == current_user.id)
        .order_by(Contact.follow_up_date.asc().nullslast(), Contact.created_at.desc())
        .all()
    )


@router.post("/", response_model=ContactOut, status_code=status.HTTP_201_CREATED)
def create_contact(
    body: ContactCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    firm_id = uuid.UUID(body.firm_id) if body.firm_id else None
    contact = Contact(
        user_id=current_user.id,
        firm_id=firm_id,
        name=body.name,
        title=body.title,
        firm_name=body.firm_name,
        email=body.email,
        linkedin_url=body.linkedin_url,
        how_met=body.how_met,
        date_met=body.date_met,
        last_contact=body.last_contact,
        follow_up_date=body.follow_up_date,
        notes=body.notes,
        warmth=body.warmth,
    )
    db.add(contact)
    db.commit()
    db.refresh(contact)
    return contact


@router.put("/{contact_id}", response_model=ContactOut)
def update_contact(
    contact_id: str,
    body: ContactUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    contact = db.query(Contact).filter(
        Contact.id == contact_id, Contact.user_id == current_user.id
    ).first()
    if not contact:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Contact not found")
    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(contact, field, value)
    db.commit()
    db.refresh(contact)
    return contact


@router.delete("/{contact_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_contact(
    contact_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    contact = db.query(Contact).filter(
        Contact.id == contact_id, Contact.user_id == current_user.id
    ).first()
    if not contact:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Contact not found")
    db.delete(contact)
    db.commit()
