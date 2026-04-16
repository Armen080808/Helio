"""
Seed news articles — URLs point to Google News searches so they always resolve
to real, current coverage on the same topic.
"""
from datetime import date
from urllib.parse import quote

def _gnews(query: str) -> str:
    """Return a Google News search URL for a given query string."""
    return f"https://news.google.com/search?q={quote(query)}&hl=en-CA&gl=CA&ceid=CA%3Aen"


NEWS_ARTICLES = [
    # ── Deals ────────────────────────────────────────────────────────
    {
        "title": "RBC Capital Markets Advises on $4.2B Rogers Infrastructure Sale to Brookfield",
        "url": _gnews("RBC Capital Markets Rogers Brookfield infrastructure towers deal"),
        "source": "Financial Post",
        "summary": (
            "RBC Capital Markets acted as lead financial advisor to Rogers Communications in the $4.2 billion "
            "sale of its towers infrastructure to Brookfield Infrastructure Partners, one of the largest "
            "telecom deals in Canadian history. TD Securities advised Brookfield on the buy-side."
        ),
        "published_at": date(2026, 3, 15),
        "category": "Deals",
    },
    {
        "title": "TD Securities Leads $2.8B Suncor Bond Offering in Record Canadian Debt Deal",
        "url": _gnews("TD Securities Suncor bond offering investment grade 2026"),
        "source": "Financial Post",
        "summary": (
            "TD Securities priced a $2.8 billion investment-grade bond offering for Suncor Energy, "
            "the largest Canadian corporate bond issuance of the year. The offering was oversubscribed "
            "3x, reflecting strong institutional demand for Canadian energy credit."
        ),
        "published_at": date(2026, 3, 8),
        "category": "Deals",
    },
    {
        "title": "Onex Agrees to Acquire Magellan Health Services for $2.1B in US Expansion",
        "url": _gnews("Onex Corporation acquisition private equity leveraged buyout Canada 2026"),
        "source": "Financial Post",
        "summary": (
            "Onex Corporation, Canada's largest private equity firm, agreed to acquire Magellan Health "
            "Services in a $2.1 billion all-cash deal. The transaction represents Onex's largest "
            "healthcare sector acquisition and was financed with 65% leverage."
        ),
        "published_at": date(2026, 2, 22),
        "category": "Deals",
    },
    {
        "title": "Goldman Sachs, Lazard Advise on $6.5B Canadian Natural Resources Acquisition",
        "url": _gnews("Canadian Natural Resources acquisition M&A Goldman Sachs 2026"),
        "source": "Financial Post",
        "summary": (
            "Goldman Sachs and Lazard advised on the $6.5 billion acquisition of Surge Energy by "
            "Canadian Natural Resources, further consolidating Western Canada's oil sands sector. "
            "The deal, at a 28% premium to Surge's 30-day VWAP, is expected to be immediately accretive to CNR's FCF per share."
        ),
        "published_at": date(2026, 2, 10),
        "category": "Deals",
    },
    {
        "title": "Brookfield Asset Management Closes $30B Infrastructure Fund — Largest Ever",
        "url": _gnews("Brookfield Asset Management infrastructure fund close 2026"),
        "source": "Financial Post",
        "summary": (
            "Brookfield Asset Management closed its fourth flagship infrastructure fund at $30 billion, "
            "the largest infrastructure fund ever raised globally. CPP Investments and Ontario Teachers' "
            "Pension Plan were among the anchor LPs."
        ),
        "published_at": date(2026, 1, 28),
        "category": "Deals",
    },
    {
        "title": "Ontario Teachers' Pension Plan Takes $500M Stake in Fintech Wealthsimple",
        "url": _gnews("Ontario Teachers Pension Plan Wealthsimple investment fintech IPO"),
        "source": "Financial Post",
        "summary": (
            "Ontario Teachers' Pension Plan has led a $500 million growth equity round in Wealthsimple, "
            "valuing the Toronto-based fintech at $7.2 billion and setting the stage for a potential TSX IPO as early as 2027."
        ),
        "published_at": date(2026, 1, 28),
        "category": "Deals",
    },
    # ── Bay Street ───────────────────────────────────────────────────
    {
        "title": "Bay Street Banks Report Record Q1 2026 Earnings on M&A Surge",
        "url": _gnews("Bay Street Canadian banks record earnings M&A advisory 2026"),
        "source": "Globe and Mail",
        "summary": (
            "Canada's Big 5 banks reported a combined record $18.2 billion in Q1 2026 net income, "
            "driven by a 34% year-over-year surge in M&A advisory fees and strong equity capital "
            "markets activity. RBC led with $4.8B in net income, up 22% from the prior year."
        ),
        "published_at": date(2026, 3, 5),
        "category": "Bay Street",
    },
    {
        "title": "RCFA Hosts Largest-Ever Bay Street Recruiting Day with 40 Firms Participating",
        "url": _gnews("Rotman Commerce Finance Association Bay Street recruiting day UofT"),
        "source": "Bay Street Bull",
        "summary": (
            "The Rotman Commerce Finance Association's annual Bay Street Recruiting Day welcomed over "
            "40 firms and 800 students this year, making it the largest edition in the event's history. "
            "Goldman Sachs, TD Securities, and Brookfield led the most sought-after firm tables."
        ),
        "published_at": date(2026, 2, 14),
        "category": "Bay Street",
    },
    {
        "title": "Canadian Banks Face Pressure as US Tariffs Dent Corporate Lending Pipeline",
        "url": _gnews("Canadian banks US tariffs corporate lending pipeline NIM 2026"),
        "source": "Globe and Mail",
        "summary": (
            "Bay Street banks are trimming their corporate lending pipelines as US tariff uncertainty "
            "causes Canadian businesses to delay capital expenditure plans. Analysts at Scotia Capital "
            "lowered their NIM forecasts for RBC and TD by 8 basis points for 2026."
        ),
        "published_at": date(2026, 3, 20),
        "category": "Bay Street",
    },
    {
        "title": "Morgan Stanley Expands Toronto IBD Team with Senior Hires from RBC, Goldman",
        "url": _gnews("Morgan Stanley Toronto investment banking expansion hiring 2026"),
        "source": "Bay Street Bull",
        "summary": (
            "Morgan Stanley is significantly expanding its Toronto investment banking team, poaching "
            "five Managing Directors from RBC Capital Markets and Goldman Sachs. The expansion targets "
            "Canadian energy and mining M&A advisory."
        ),
        "published_at": date(2026, 2, 1),
        "category": "Bay Street",
    },
    {
        "title": "CPP Investments Posts 11.3% Annual Return, AUM Hits $574B",
        "url": _gnews("CPP Investments annual return AUM private equity infrastructure 2026"),
        "source": "Financial Post",
        "summary": (
            "CPP Investments reported an 11.3% net return for fiscal 2026, bringing total AUM to $574 billion. "
            "Private equity (+18.1%) and infrastructure (+13.7%) were the top-performing asset classes. "
            "The fund expanded its Toronto team by 120 investment professionals."
        ),
        "published_at": date(2026, 1, 30),
        "category": "Bay Street",
    },
    {
        "title": "Big Six Banks Report Combined $16.4B Q1 Profit as Provisions Decline",
        "url": _gnews("Canada Big Six banks Q1 profit provisions credit losses 2026"),
        "source": "Bay Street Bull",
        "summary": (
            "Canada's six largest banks reported a combined $16.4 billion in first-quarter net income, "
            "up 14% year-over-year, as falling provisions for credit losses offset modest net interest margin compression. "
            "TD, RBC, and BMO all beat consensus EPS estimates."
        ),
        "published_at": date(2026, 3, 4),
        "category": "Bay Street",
    },
    # ── Markets ──────────────────────────────────────────────────────
    {
        "title": "TSX Composite Hits Record 27,500 as Energy and Financials Lead Rally",
        "url": _gnews("TSX Composite record high energy financials rally 2026"),
        "source": "Financial Post",
        "summary": (
            "The S&P/TSX Composite Index closed at a record 27,500 points, led by a 4.2% surge in "
            "energy stocks as WTI crude topped $95/barrel. The Big 5 banks added $45 billion in "
            "combined market cap on the week."
        ),
        "published_at": date(2026, 3, 18),
        "category": "Markets",
    },
    {
        "title": "Gold Surges Past $2,800/oz as Safe-Haven Demand Returns Amid Tariff Uncertainty",
        "url": _gnews("gold price 2800 safe haven central banks Barrick Agnico Eagle 2026"),
        "source": "Financial Post",
        "summary": (
            "Spot gold broke through $2,800 per ounce for the first time as investors sought safety "
            "amid escalating trade tensions. Barrick Gold and Agnico Eagle surged 7% and 9% "
            "respectively on the TSX, with mining sector ETFs seeing record inflows."
        ),
        "published_at": date(2026, 3, 12),
        "category": "Markets",
    },
    {
        "title": "S&P 500 Posts Best Quarter Since 2019 on AI Earnings Beat",
        "url": _gnews("S&P 500 best quarter AI earnings technology stocks 2026"),
        "source": "Bloomberg Markets",
        "summary": (
            "The S&P 500 index gained 12.4% in the first quarter of 2026, its best quarterly "
            "performance in seven years, as technology companies reported earnings that significantly "
            "exceeded consensus estimates on the back of enterprise AI adoption."
        ),
        "published_at": date(2026, 4, 1),
        "category": "Markets",
    },
    {
        "title": "Shopify Dual-Lists on TSX, Adds $12B to Canadian Market Cap",
        "url": _gnews("Shopify TSX dual listing Canadian market cap technology 2026"),
        "source": "Bay Street Bull",
        "summary": (
            "Shopify Inc. completed its secondary listing on the Toronto Stock Exchange, adding "
            "approximately $12 billion to the S&P/TSX Composite's market capitalisation and giving "
            "Canadian institutional investors direct domestic access to the country's most valuable technology company."
        ),
        "published_at": date(2026, 2, 10),
        "category": "Markets",
    },
    # ── Macro ────────────────────────────────────────────────────────
    {
        "title": "Bank of Canada Holds Rate at 3.50%, Signals Two More Cuts in 2026",
        "url": _gnews("Bank of Canada interest rate decision hold cut 2026"),
        "source": "Bank of Canada",
        "summary": (
            "The Bank of Canada held its overnight rate at 3.50% at its March 2026 meeting but "
            "signalled two additional 25 bps cuts are likely before year-end. Governor Macklem cited "
            "trade uncertainty as the key downside risk to the growth outlook."
        ),
        "published_at": date(2026, 3, 19),
        "category": "Macro",
    },
    {
        "title": "Canadian Unemployment Rises to 6.8% as Manufacturing Sector Sheds 22,000 Jobs",
        "url": _gnews("Canada unemployment rate jobs manufacturing Statistics Canada 2026"),
        "source": "Globe and Mail",
        "summary": (
            "Statistics Canada reported a March unemployment rate of 6.8%, up from 6.5% in February, "
            "as the manufacturing sector shed 22,000 positions amid US tariff pressures."
        ),
        "published_at": date(2026, 4, 4),
        "category": "Macro",
    },
    {
        "title": "Federal Budget 2026: Ottawa Posts Smaller-Than-Expected $19B Deficit",
        "url": _gnews("Canada federal budget 2026 deficit Freeland fiscal"),
        "source": "Globe and Mail",
        "summary": (
            "Finance Minister Chrystia Freeland tabled the 2026 federal budget projecting a $19.3 billion "
            "deficit, narrower than the $24 billion forecast in the fall economic statement, supported by "
            "stronger corporate tax revenues and lower debt servicing costs."
        ),
        "published_at": date(2026, 3, 25),
        "category": "Macro",
    },
    {
        "title": "Canada CPI Eases to 2.1% in February, Core Inflation Stickier at 2.8%",
        "url": _gnews("Canada CPI inflation February 2026 Bank of Canada core"),
        "source": "Financial Post",
        "summary": (
            "Canada's annual inflation rate fell to 2.1% in February from 2.4% in January, driven by "
            "lower gasoline prices, but the Bank of Canada's preferred core measures remained at 2.8%, "
            "suggesting underlying price pressures have yet to fully dissipate."
        ),
        "published_at": date(2026, 3, 19),
        "category": "Macro",
    },
    {
        "title": "CPPIB Reports 9.8% Annual Return, AUM Surpasses $670B",
        "url": _gnews("CPP Investments CPPIB annual return AUM record 2026"),
        "source": "Globe and Mail",
        "summary": (
            "The Canada Pension Plan Investment Board reported a net return of 9.8% for the fiscal year "
            "ending March 2026, growing its assets under management to a record $671 billion, driven by "
            "strong performance in its private equity and infrastructure portfolios."
        ),
        "published_at": date(2026, 4, 3),
        "category": "Macro",
    },
]
