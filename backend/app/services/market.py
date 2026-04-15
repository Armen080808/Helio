import yfinance as yf
from datetime import date
from sqlalchemy.orm import Session
from ..models.market_snapshot import MarketSnapshot

SYMBOLS = {
    "^GSPTSE": "TSX Composite",
    "^GSPC": "S&P 500",
    "^DJI": "Dow Jones",
    "TD.TO": "TD Bank",
    "RY.TO": "RBC",
    "BMO.TO": "BMO",
    "BNS.TO": "Scotiabank",
    "CM.TO": "CIBC",
    "NA.TO": "National Bank",
    "GS": "Goldman Sachs",
    "MS": "Morgan Stanley",
    "JPM": "JPMorgan",
    "BAM.TO": "Brookfield AM",
}


def fetch_and_store_market_data(db: Session):
    today = date.today()
    for symbol, name in SYMBOLS.items():
        try:
            ticker = yf.Ticker(symbol)
            info = ticker.fast_info
            existing = db.query(MarketSnapshot).filter(
                MarketSnapshot.symbol == symbol,
                MarketSnapshot.snapshot_date == today
            ).first()
            if existing:
                continue
            snap = MarketSnapshot(
                symbol=symbol,
                name=name,
                price=round(info.last_price, 2),
                change=round(info.last_price - info.previous_close, 2),
                change_pct=round(
                    (info.last_price - info.previous_close) / info.previous_close * 100, 2
                ),
                volume=getattr(info, "three_month_average_volume", None),
                market_cap=getattr(info, "market_cap", None),
                snapshot_date=today,
            )
            db.add(snap)
        except Exception as e:
            print(f"[MARKET] Failed {symbol}: {e}")
    db.commit()
    print(f"[MARKET] Updated {today}")
