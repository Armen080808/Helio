import uuid
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from ..database import get_db
from ..models.booking import Booking
from ..models.client import Client
from ..models.user import User
from ..schemas.booking import BookingCreate, BookingOut
from ..services.auth import get_current_user

router = APIRouter(prefix="/api/bookings", tags=["bookings"])


def _get_booking_or_404(booking_id: str, user_id: uuid.UUID, db: Session) -> Booking:
    try:
        bid = uuid.UUID(booking_id)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")

    booking = (
        db.query(Booking)
        .filter(Booking.id == bid, Booking.user_id == user_id)
        .first()
    )
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")
    return booking


@router.get("/", response_model=list[BookingOut])
def list_bookings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    bookings = (
        db.query(Booking)
        .options(joinedload(Booking.client))
        .filter(Booking.user_id == current_user.id)
        .order_by(Booking.start_at.asc())
        .all()
    )
    return [BookingOut.model_validate(b) for b in bookings]


@router.post("/", response_model=BookingOut, status_code=status.HTTP_201_CREATED)
def create_booking(
    body: BookingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    client_uuid: uuid.UUID | None = None
    if body.client_id:
        try:
            client_uuid = uuid.UUID(body.client_id)
        except ValueError:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid client_id")

        client = db.query(Client).filter(
            Client.id == client_uuid, Client.user_id == current_user.id
        ).first()
        if not client:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Client not found")

    if body.end_at <= body.start_at:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="end_at must be after start_at",
        )

    booking = Booking(
        user_id=current_user.id,
        client_id=client_uuid,
        title=body.title,
        notes=body.notes,
        start_at=body.start_at,
        end_at=body.end_at,
        location=body.location,
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)

    booking = (
        db.query(Booking)
        .options(joinedload(Booking.client))
        .filter(Booking.id == booking.id)
        .first()
    )
    return BookingOut.model_validate(booking)


@router.patch("/{booking_id}/cancel", response_model=BookingOut)
def cancel_booking(
    booking_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    booking = _get_booking_or_404(booking_id, current_user.id, db)
    booking.status = "CANCELLED"

    db.commit()
    db.refresh(booking)

    booking = (
        db.query(Booking)
        .options(joinedload(Booking.client))
        .filter(Booking.id == booking.id)
        .first()
    )
    return BookingOut.model_validate(booking)


@router.delete("/{booking_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_booking(
    booking_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    booking = _get_booking_or_404(booking_id, current_user.id, db)
    db.delete(booking)
    db.commit()
