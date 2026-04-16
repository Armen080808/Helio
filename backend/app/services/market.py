"""
Fetch Canadian market data via yfinance (which handles Yahoo Finance's
session/cookie auth automatically) with a small per-symbol delay to
avoid server-side rate limits.
"""
import time
from datetime import date, datetime
from sqlalchemy.orm import Session
from ..models.market_snapshot import MarketSnapshot

# Canadian-only symbols: index, Big 6 banks, asset managers & sectors
SYMBOLS: dict[str, str] = {
    "^GSPTSE":  "TSX Composite",
    "TD.TO":    "TD Bank",
    "RY.TO":    "RBC",
    "BMO.TO":   "BMO",
    "BNS.TO":   "Scotiabank",
    "CM.TO":    "CIBC",
    "NA.TO":    "National Bank",
    "BAM.TO":   "Brookfield AM",
    "SHOP.TO":  "Shopify",
    "SU.TO":    "Suncor Energy",
}


def fetch_and_store_market_data(db: Session) -> None:
    try:
        import yfinance as yf
    except ImportError:
        print("[MARKET] yfinance not installed — skipping live fetch")
        return

    today = date.today()
    added = updated = 0

    for symbol, name in SYMBOLS.items():
        try:
            ticker = yf.Ticker(symbol)
            info = ticker.fast_info

            price: float = round(float(info.last_price), 2)
            prev:  float = round(float(info.previous_close), 2)
            change     = round(price - prev, 2)
            change_pct = round((price - prev) / prev * 100, 2) if prev else 0.0
            volume     = getattr(info, "three_month_average_volume", None)
            market_cap = getattr(info, "market_cap", None)

            existing = (
                db.query(MarketSnapshot)
                .filter(
                    MarketSnapshot.symbol == symbol,
                    MarketSnapshot.snapshot_date == today,
                )
                .first()
            )

            if existing:
                existing.price      = price
                existing.change     = change
                existing.change_pct = change_pct
                existing.volume     = volume
                existing.market_cap = market_cap
                existing.fetched_at = datetime.utcnow()
                updated += 1
            else:
                db.add(MarketSnapshot(
                    symbol=symbol,
                    name=name,
                    price=price,
                    change=change,
                    change_pct=change_pct,
                    volume=volume,
                    market_cap=market_cap,
                    snapshot_date=today,
                ))
                added += 1

        except Exception as exc:
            print(f"[MARKET] Failed {symbol}: {exc}")

        time.sleep(0.5)  # 500 ms between symbols to avoid rate limits

    db.commit()
    print(f"[MARKET] {today} — added {added}, refreshed {updated}")
