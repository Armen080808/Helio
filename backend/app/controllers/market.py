from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.market_snapshot import MarketSnapshot
from ..schemas.market_snapshot import MarketSnapshotOut

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


@router.get("/history/{symbol}", response_model=list[MarketSnapshotOut])
def get_symbol_history(symbol: str, db: Session = Depends(get_db)):
    return (
        db.query(MarketSnapshot)
        .filter(MarketSnapshot.symbol == symbol)
        .order_by(MarketSnapshot.snapshot_date.desc())
        .limit(30)
        .all()
    )
