"""
Fetch Canadian market data directly from Yahoo Finance's public HTTP API.
No third-party library — pure httpx requests to Yahoo Finance chart endpoint.
"""
import httpx
from datetime import date, datetime
from sqlalchemy.orm import Session
from ..models.market_snapshot import MarketSnapshot

# Canadian-only symbols: indices, Big 6 banks, major asset managers & sectors
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

_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0 Safari/537.36"
    ),
    "Accept": "application/json",
}


def _fetch_quote(symbol: str) -> dict | None:
    """Fetch current price and previous close directly from Yahoo Finance chart API."""
    url = (
        f"https://query2.finance.yahoo.com/v8/finance/chart/{symbol}"
        "?interval=1d&range=2d&includePrePost=false"
    )
    try:
        with httpx.Client(timeout=12, follow_redirects=True) as client:
            r = client.get(url, headers=_HEADERS)
            r.raise_for_status()
        data = r.json()
        result = data["chart"]["result"][0]
        meta = result["meta"]

        price: float = meta.get("regularMarketPrice") or 0.0
        prev: float = (
            meta.get("chartPreviousClose")
            or meta.get("previousClose")
            or price
        )
        volume = meta.get("regularMarketVolume")
        market_cap = meta.get("marketCap")

        return {
            "price": price,
            "prev_close": prev,
            "volume": volume,
            "market_cap": market_cap,
        }
    except Exception as exc:
        print(f"[MARKET] Quote fetch failed for {symbol}: {exc}")
        return None


def fetch_and_store_market_data(db: Session) -> None:
    today = date.today()
    added = updated = 0

    for symbol, name in SYMBOLS.items():
        try:
            existing = (
                db.query(MarketSnapshot)
                .filter(
                    MarketSnapshot.symbol == symbol,
                    MarketSnapshot.snapshot_date == today,
                )
                .first()
            )

            quote = _fetch_quote(symbol)
            if not quote or not quote["price"]:
                continue

            price     = round(quote["price"], 2)
            prev      = quote["prev_close"] or price
            change    = round(price - prev, 2)
            change_pct = round((price - prev) / prev * 100, 2) if prev else 0.0

            if existing:
                # Refresh today's snapshot with latest price
                existing.price      = price
                existing.change     = change
                existing.change_pct = change_pct
                existing.volume     = quote.get("volume")
                existing.market_cap = quote.get("market_cap")
                existing.fetched_at = datetime.utcnow()
                updated += 1
            else:
                snap = MarketSnapshot(
                    symbol=symbol,
                    name=name,
                    price=price,
                    change=change,
                    change_pct=change_pct,
                    volume=quote.get("volume"),
                    market_cap=quote.get("market_cap"),
                    snapshot_date=today,
                )
                db.add(snap)
                added += 1

        except Exception as exc:
            print(f"[MARKET] Failed {symbol}: {exc}")

    db.commit()
    print(f"[MARKET] {today} — added {added}, refreshed {updated}")
