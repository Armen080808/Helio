import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.client import Client
from ..models.user import User
from ..schemas.client import ClientCreate, ClientOut, ClientUpdate
from ..services.auth import get_current_user

router = APIRouter(
    prefix="/api/clients",
    tags=["clients"],
    dependencies=[Depends(get_current_user)],
)


def _get_client_or_404(client_id: str, user_id: uuid.UUID, db: Session) -> Client:
    try:
        cid = uuid.UUID(client_id)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Client not found")

    client = db.query(Client).filter(Client.id == cid, Client.user_id == user_id).first()
    if not client:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Client not found")
    return client


@router.get("/", response_model=list[ClientOut])
def list_clients(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    clients = (
        db.query(Client)
        .filter(Client.user_id == current_user.id)
        .order_by(Client.created_at.desc())
        .all()
    )
    return [ClientOut.model_validate(c) for c in clients]


@router.post("/", response_model=ClientOut, status_code=status.HTTP_201_CREATED)
def create_client(
    body: ClientCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    client = Client(
        user_id=current_user.id,
        name=body.name,
        email=body.email,
        phone=body.phone,
        company=body.company,
        notes=body.notes,
    )
    db.add(client)
    db.commit()
    db.refresh(client)
    return ClientOut.model_validate(client)


@router.put("/{client_id}", response_model=ClientOut)
def update_client(
    client_id: str,
    body: ClientUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    client = _get_client_or_404(client_id, current_user.id, db)

    update_data = body.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(client, field, value)

    db.commit()
    db.refresh(client)
    return ClientOut.model_validate(client)


@router.delete("/{client_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_client(
    client_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    client = _get_client_or_404(client_id, current_user.id, db)
    db.delete(client)
    db.commit()
