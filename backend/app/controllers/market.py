import threading
from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from ..database import get_db, SessionLocal
from ..models.market_snapshot import MarketSnapshot
from ..schemas.market_snapshot import MarketSnapshotOut
from ..services.market import fetch_and_store_market_data

router = APIRouter(prefix="/api/market", tags=["market"])


@router.get("/", response_model=list[MarketSnapshotOut])
def get_market_latest(db: Session = Depends(get_db)):
    latest_date = db.query(func.max(MarketSnapshot.snapshot_date)).scalar()
    if not latest_date:
        return []
    return (
        db.query(MarketSnapshot)
        .filter(MarketSnapshot.snapshot_date == latest_date)
        .order_by(MarketSnapshot.symbol)
        .all()
    )


@router.post("/refresh", status_code=202)
def trigger_market_refresh():
    """Kick off a live market data fetch in the background. Returns immediately."""
    def _run():
        db = SessionLocal()
        try:
            fetch_and_store_market_data(db)
        finally:
            db.close()
    threading.Thread(target=_run, daemon=True).start()
    return {"status": "refresh triggered"}


@router.get("/history/{symbol}", response_model=list[MarketSnapshotOut])
def get_symbol_history(symbol: str, db: Session = Depends(get_db)):
    return (
        db.query(MarketSnapshot)
        .filter(MarketSnapshot.symbol == symbol)
        .order_by(MarketSnapshot.snapshot_date.desc())
        .limit(30)
        .all()
    )
