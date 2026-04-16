"""
Static seed data for Canadian market snapshots.
Used as an immediate fallback so the Markets page shows data on first startup
before the live Yahoo Finance fetch completes in the background.

Prices are approximate mid-April 2026 values — the scheduler refreshes them
with live data every weekday at 4:30 PM ET.
"""

MARKET_SNAPSHOTS = [
    # ── Index ────────────────────────────────────────────────────────────
    {
        "symbol":     "^GSPTSE",
        "name":       "TSX Composite",
        "price":      24_182.45,
        "change":     -68.30,
        "change_pct": -0.28,
        "volume":     None,
        "market_cap": None,
    },
    # ── Big 6 Canadian Banks ─────────────────────────────────────────────
    {
        "symbol":     "TD.TO",
        "name":       "TD Bank",
        "price":      82.14,
        "change":     0.42,
        "change_pct": 0.51,
        "volume":     9_200_000,
        "market_cap": 148_000_000_000,
    },
    {
        "symbol":     "RY.TO",
        "name":       "RBC",
        "price":      133.58,
        "change":     1.12,
        "change_pct": 0.84,
        "volume":     5_800_000,
        "market_cap": 187_000_000_000,
    },
    {
        "symbol":     "BMO.TO",
        "name":       "BMO",
        "price":      123.76,
        "change":     -0.85,
        "change_pct": -0.68,
        "volume":     3_900_000,
        "market_cap": 91_000_000_000,
    },
    {
        "symbol":     "BNS.TO",
        "name":       "Scotiabank",
        "price":      65.43,
        "change":     0.23,
        "change_pct": 0.35,
        "volume":     6_100_000,
        "market_cap": 79_000_000_000,
    },
    {
        "symbol":     "CM.TO",
        "name":       "CIBC",
        "price":      67.89,
        "change":     -0.31,
        "change_pct": -0.45,
        "volume":     4_400_000,
        "market_cap": 63_000_000_000,
    },
    {
        "symbol":     "NA.TO",
        "name":       "National Bank",
        "price":      107.22,
        "change":     0.68,
        "change_pct": 0.64,
        "volume":     1_800_000,
        "market_cap": 36_000_000_000,
    },
    # ── Other Canadian ───────────────────────────────────────────────────
    {
        "symbol":     "BAM.TO",
        "name":       "Brookfield AM",
        "price":      54.87,
        "change":     0.93,
        "change_pct": 1.72,
        "volume":     2_300_000,
        "market_cap": 89_000_000_000,
    },
    {
        "symbol":     "SHOP.TO",
        "name":       "Shopify",
        "price":      118.34,
        "change":     -2.15,
        "change_pct": -1.79,
        "volume":     3_100_000,
        "market_cap": 151_000_000_000,
    },
    {
        "symbol":     "SU.TO",
        "name":       "Suncor Energy",
        "price":      53.41,
        "change":     0.57,
        "change_pct": 1.08,
        "volume":     7_600_000,
        "market_cap": 61_000_000_000,
    },
]
