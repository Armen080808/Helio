import threading
from fastapi import APIRouter, Depends, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.user import User
from ..services.auth import get_current_user
from ..services.email import send_connection_email

router = APIRouter(prefix="/api/alumni", tags=["alumni"])


class ConnectRequest(BaseModel):
    alumni_name: str
    alumni_role: str
    alumni_company: str
    message: str


@router.post("/connect", status_code=status.HTTP_202_ACCEPTED)
def send_connect_request(
    body: ConnectRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Send a connection-request confirmation email to the requesting user.
    Runs the SMTP call in a background thread so the response is instant.
    """
    def _send():
        send_connection_email(
            to_email=current_user.email,
            sender_name=current_user.name,
            alumni_name=body.alumni_name,
            alumni_role=body.alumni_role,
            alumni_company=body.alumni_company,
            message=body.message,
        )

    threading.Thread(target=_send, daemon=True).start()
    return {"status": "sent"}
