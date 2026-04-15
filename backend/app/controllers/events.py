import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.recruiting_event import RecruitingEvent
from ..models.user import User
from ..schemas.recruiting_event import RecruitingEventCreate, RecruitingEventUpdate, RecruitingEventOut
from ..services.auth import get_current_user

router = APIRouter(prefix="/api/events", tags=["events"])


@router.get("/", response_model=list[RecruitingEventOut])
def list_events(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return (
        db.query(RecruitingEvent)
        .filter(
            (RecruitingEvent.user_id == current_user.id) | (RecruitingEvent.is_public == True)  # noqa: E712
        )
        .order_by(RecruitingEvent.date.asc())
        .all()
    )


@router.post("/", response_model=RecruitingEventOut, status_code=status.HTTP_201_CREATED)
def create_event(
    body: RecruitingEventCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    firm_id = uuid.UUID(body.firm_id) if body.firm_id else None
    event = RecruitingEvent(
        user_id=current_user.id,
        firm_id=firm_id,
        firm_name=body.firm_name,
        event_type=body.event_type,
        title=body.title,
        date=body.date,
        location=body.location,
        description=body.description,
        rsvp_status=body.rsvp_status,
        notes=body.notes,
        is_public=body.is_public,
    )
    db.add(event)
    db.commit()
    db.refresh(event)
    return event


@router.put("/{event_id}", response_model=RecruitingEventOut)
def update_event(
    event_id: str,
    body: RecruitingEventUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    event = db.query(RecruitingEvent).filter(
        RecruitingEvent.id == event_id, RecruitingEvent.user_id == current_user.id
    ).first()
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")
    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(event, field, value)
    db.commit()
    db.refresh(event)
    return event


@router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_event(
    event_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    event = db.query(RecruitingEvent).filter(
        RecruitingEvent.id == event_id, RecruitingEvent.user_id == current_user.id
    ).first()
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")
    db.delete(event)
    db.commit()
