import uuid
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.application import Application
from ..models.user import User
from ..schemas.application import ApplicationCreate, ApplicationUpdate, ApplicationOut
from ..services.auth import get_current_user

router = APIRouter(prefix="/api/pipeline", tags=["pipeline"])


@router.get("/stats")
def get_pipeline_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    apps = db.query(Application).filter(Application.user_id == current_user.id).all()
    counts: dict[str, int] = {}
    for app in apps:
        counts[app.stage] = counts.get(app.stage, 0) + 1
    return {"stage_counts": counts, "total": len(apps)}


@router.get("/", response_model=list[ApplicationOut])
def list_applications(
    stage: str | None = Query(None),
    type: str | None = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    q = db.query(Application).filter(Application.user_id == current_user.id)
    if stage:
        q = q.filter(Application.stage == stage)
    if type:
        q = q.filter(Application.type == type)
    return q.order_by(Application.created_at.desc()).all()


@router.post("/", response_model=ApplicationOut, status_code=status.HTTP_201_CREATED)
def create_application(
    body: ApplicationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    firm_id = uuid.UUID(body.firm_id) if body.firm_id else None
    app = Application(
        user_id=current_user.id,
        firm_id=firm_id,
        firm_name=body.firm_name,
        role=body.role,
        type=body.type,
        stage=body.stage,
        applied_date=body.applied_date,
        deadline=body.deadline,
        next_step=body.next_step,
        notes=body.notes,
        salary=body.salary,
    )
    db.add(app)
    db.commit()
    db.refresh(app)
    return app


@router.put("/{app_id}", response_model=ApplicationOut)
def update_application(
    app_id: str,
    body: ApplicationUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    app = db.query(Application).filter(
        Application.id == app_id, Application.user_id == current_user.id
    ).first()
    if not app:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")

    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(app, field, value)
    db.commit()
    db.refresh(app)
    return app


@router.delete("/{app_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_application(
    app_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    app = db.query(Application).filter(
        Application.id == app_id, Application.user_id == current_user.id
    ).first()
    if not app:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")
    db.delete(app)
    db.commit()
