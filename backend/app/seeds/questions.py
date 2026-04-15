QUESTIONS = [
    # TECHNICAL - Valuation
    {
        "category": "Technical",
        "subcategory": "Valuation",
        "difficulty": "Medium",
        "question": "Walk me through a DCF analysis.",
        "answer": (
            "A DCF values a company based on its future free cash flows discounted back to present value. "
            "Steps: (1) Project FCF for 5-10 years using revenue growth, EBIT margins, D&A, capex, and "
            "changes in working capital. (2) Calculate terminal value using either Gordon Growth Model "
            "(FCF × (1+g) / (WACC-g)) or exit multiple method. (3) Discount all cash flows at WACC "
            "(weighted average cost of capital). (4) Sum DCFs + terminal value = enterprise value. "
            "Subtract net debt to get equity value, divide by shares for price per share."
        ),
    },
    {
        "category": "Technical",
        "subcategory": "Valuation",
        "difficulty": "Easy",
        "question": "What are the three main valuation methodologies?",
        "answer": (
            "1. DCF (Discounted Cash Flow) — intrinsic value based on future cash flows. "
            "2. Comparable Company Analysis (Comps) — value based on trading multiples (EV/EBITDA, P/E) "
            "of similar public companies. 3. Precedent Transactions — value based on multiples paid in "
            "prior M&A deals. DCF = most precise but most assumptions. Comps = market-based, real-time. "
            "Precedents = include control premium, usually highest valuation."
        ),
    },
    {
        "category": "Technical",
        "subcategory": "Valuation",
        "difficulty": "Hard",
        "question": "How does an increase in capex affect the three financial statements?",
        "answer": (
            "Income Statement: No immediate effect (capex is not expensed immediately). "
            "Depreciation increases over time → reduces net income. "
            "Cash Flow Statement: Capex outflow in investing activities → reduces free cash flow. "
            "Balance Sheet: PP&E increases by capex amount. Accumulated depreciation increases → "
            "net PP&E decreases over time. Cash decreases."
        ),
    },
    {
        "category": "Technical",
        "subcategory": "Valuation",
        "difficulty": "Medium",
        "question": "What is EBITDA and why is it used as a valuation metric?",
        "answer": (
            "EBITDA = Earnings Before Interest, Taxes, Depreciation & Amortization. Used because: "
            "(1) Proxy for operating cash flow — removes non-cash charges and capital structure effects. "
            "(2) Allows comparison across companies with different debt levels and tax situations. "
            "(3) Most commonly used in LBO analysis and M&A. "
            "Limitations: ignores capex, working capital needs; can be manipulated."
        ),
    },
    {
        "category": "Technical",
        "subcategory": "Valuation",
        "difficulty": "Medium",
        "question": "What's the difference between enterprise value and equity value?",
        "answer": (
            "Enterprise Value (EV) = total value of the business to ALL capital providers (debt + equity holders). "
            "EV = Market Cap + Total Debt + Preferred Stock + Minority Interest - Cash. "
            "Equity Value = value to equity holders only = Market Cap. "
            "Bridge: EV - Net Debt = Equity Value. Use EV multiples (EV/EBITDA, EV/Revenue) when "
            "comparing companies with different capital structures."
        ),
    },
    # TECHNICAL - LBO
    {
        "category": "Technical",
        "subcategory": "LBO",
        "difficulty": "Hard",
        "question": "Walk me through an LBO model.",
        "answer": (
            "LBO = Leveraged Buyout. Steps: (1) Purchase price: PE firm buys company using ~30-40% equity "
            "+ 60-70% debt. (2) Build integrated 3-statement model for hold period (typically 5 years). "
            "(3) Debt paydown: model amortization and cash sweeps. "
            "(4) Exit: sell company at assumed multiple (EV/EBITDA). "
            "(5) Calculate returns: IRR and MOIC for PE sponsor. "
            "Key value drivers: entry/exit multiple expansion, EBITDA growth, debt paydown."
        ),
    },
    {
        "category": "Technical",
        "subcategory": "LBO",
        "difficulty": "Medium",
        "question": "What makes a good LBO candidate?",
        "answer": (
            "Ideal LBO target: (1) Stable, predictable cash flows to service debt. "
            "(2) Low existing debt (room to lever up). (3) Strong market position / defensible moat. "
            "(4) Asset-light or tangible assets as collateral. "
            "(5) Potential for operational improvement / cost cuts. "
            "(6) Clear exit path (strategic acquirer, IPO). (7) Non-cyclical industry preferred. "
            "Examples: software with recurring revenue, consumer staples, healthcare services."
        ),
    },
    # TECHNICAL - M&A
    {
        "category": "Technical",
        "subcategory": "M&A",
        "difficulty": "Hard",
        "question": "Walk me through an accretion/dilution analysis.",
        "answer": (
            "Accretion/dilution measures impact of acquisition on acquirer's EPS. "
            "Steps: (1) Calculate standalone EPS of acquirer. "
            "(2) Calculate cost of deal: purchase price, financing mix (cash/debt/stock), "
            "interest expense on new debt, shares issued. "
            "(3) Add target's net income to acquirer. (4) Calculate new EPS post-deal. "
            "If new EPS > old EPS = accretive. If lower = dilutive. "
            "Key insight: deal is accretive when target's earnings yield (1/P-E) > "
            "acquirer's after-tax cost of financing."
        ),
    },
    {
        "category": "Technical",
        "subcategory": "M&A",
        "difficulty": "Medium",
        "question": "What is a fairness opinion and when is it used?",
        "answer": (
            "A fairness opinion is a letter from an investment bank stating that the financial terms "
            "of a proposed M&A transaction are fair to shareholders from a financial point of view. "
            "Used: (1) M&A deals to protect board from shareholder lawsuits. "
            "(2) LBOs, going-private transactions. (3) Required by certain regulatory frameworks. "
            "The bank uses DCF, comps, and precedent transactions to opine on fairness. "
            "Usually paid $1-5M per opinion."
        ),
    },
    # BEHAVIORAL
    {
        "category": "Behavioral",
        "subcategory": "Why IB",
        "difficulty": "Easy",
        "question": "Why investment banking?",
        "answer": (
            "Strong answer hits 3 points: (1) Intellectual interest — fascination with capital markets, "
            "deal-making, business valuation. (2) Skill development — want to build financial modeling, "
            "client management, and analytical skills at the highest level. "
            "(3) Career optionality — IB provides exit ops to PE, corporate development, AM. "
            "Avoid generic answers. Reference specific deals you've read about. "
            "Show you understand the lifestyle tradeoff."
        ),
    },
    {
        "category": "Behavioral",
        "subcategory": "Why Firm",
        "difficulty": "Easy",
        "question": "Why this firm specifically?",
        "answer": (
            "Research required. Hit 3 angles: (1) Specific deal or transaction the firm did that interests you. "
            "(2) Cultural differentiator you've heard from analysts (coffee chats essential here). "
            "(3) Strategic positioning — e.g., 'TD's leadership in Canadian energy M&A aligns with my "
            "interest in the sector.' Never say 'brand' or 'prestige' — say 'reputation for developing "
            "analysts' or 'deal flow in X sector.'"
        ),
    },
    {
        "category": "Behavioral",
        "subcategory": "General",
        "difficulty": "Easy",
        "question": "Tell me about yourself.",
        "answer": (
            "The 'story' format: Present → Past → Future. Keep to 90 seconds. "
            "Present: What you're studying and what's driving your current focus. "
            "Past: 2-3 key experiences that built your finance interest/skills "
            "(internships, clubs, projects). Future: Why IB specifically at this firm is "
            "the logical next step. Practice until it sounds natural, not rehearsed. "
            "Always end with something that invites follow-up questions."
        ),
    },
    {
        "category": "Behavioral",
        "subcategory": "General",
        "difficulty": "Easy",
        "question": "What's your greatest weakness?",
        "answer": (
            "Avoid clichés ('I work too hard', 'I'm a perfectionist'). "
            "Formula: Real weakness + specific example + what you've done to improve + current status. "
            "Example: 'I used to struggle with delegating work when leading group projects. "
            "I'd redo teammates' work rather than coaching them. I realized this in [club role], "
            "so I started setting clearer expectations upfront and checking in earlier. "
            "Now I [specific behavior change].'"
        ),
    },
    {
        "category": "Behavioral",
        "subcategory": "General",
        "difficulty": "Medium",
        "question": "Tell me about a time you worked under pressure to meet a deadline.",
        "answer": (
            "Use STAR format: Situation (context), Task (your role), Action (what you specifically did), "
            "Result (quantifiable outcome). Strong IB answers involve finance/analytical work. "
            "Example from a case competition, financial modeling project, or time-pressured club role. "
            "Key: emphasize your personal actions, not team's. Show composure under pressure."
        ),
    },
    # MARKET
    {
        "category": "Market",
        "subcategory": "Current Events",
        "difficulty": "Medium",
        "question": "What is the current Bank of Canada interest rate and what's the outlook?",
        "answer": (
            "Know the current rate going into your interview. As of early 2026, the Bank of Canada "
            "has been navigating between inflation management and growth support. "
            "Key factors: CPI trends, unemployment rate, housing market, CAD/USD exchange rate. "
            "For interviews: state the rate, give recent trend (cutting/hiking), and give a 12-month "
            "outlook with reasoning. Check bankofcanada.ca the morning of your interview."
        ),
    },
    {
        "category": "Market",
        "subcategory": "Current Events",
        "difficulty": "Medium",
        "question": "Walk me through what's happening in the Canadian M&A market right now.",
        "answer": (
            "Research before interviews. Key sectors to watch: energy/natural resources "
            "(major consolidation), Canadian banking (any cross-border deals), tech (AI-driven M&A), "
            "mining (gold/critical minerals). Sources to monitor: Bloomberg Canada, Financial Post M&A "
            "section, Deal Law Wire. Know 2-3 recent large Canadian deals by name, buyer, seller, "
            "value, and rationale."
        ),
    },
    {
        "category": "Market",
        "subcategory": "Macro",
        "difficulty": "Easy",
        "question": "If the Fed raises interest rates, what happens to bond prices?",
        "answer": (
            "Bond prices move inversely to interest rates. When rates rise: existing bonds with lower "
            "coupons become less attractive → prices fall. Duration measures sensitivity — longer "
            "duration = greater price sensitivity. If rate rises 1%: a 10-year bond drops ~10% in price "
            "(roughly). Key formula: Bond Price = PV of coupons + PV of face value, "
            "both discounted at new higher rate."
        ),
    },
    {
        "category": "Market",
        "subcategory": "Macro",
        "difficulty": "Medium",
        "question": "What is the yield curve and what does an inverted yield curve signal?",
        "answer": (
            "Yield curve plots bond yields across different maturities (3mo, 2yr, 5yr, 10yr, 30yr). "
            "Normal curve: long-term yields > short-term (lenders demand premium for longer time horizon). "
            "Inverted curve: short-term yields > long-term. Signals: (1) Market expects future rate cuts "
            "(recession expected). (2) Historically reliable recession predictor — inverted before every "
            "US recession since 1970. (3) Bad for bank margins (they borrow short, lend long)."
        ),
    },
    # CANADIAN SPECIFIC
    {
        "category": "Technical",
        "subcategory": "Canadian Markets",
        "difficulty": "Medium",
        "question": "What are the Big 5 Canadian banks and their capital markets divisions?",
        "answer": (
            "1. TD Bank → TD Securities (top in Canada). "
            "2. RBC → RBC Capital Markets (largest by volume). "
            "3. BMO → BMO Capital Markets. "
            "4. Scotiabank → Scotiabank GBM (Global Banking & Markets). "
            "5. CIBC → CIBC Capital Markets. "
            "Plus National Bank Financial (sometimes called Big 6). "
            "Key differences: TD strong in M&A advisory, RBC in ECM, BMO in mining/energy, "
            "Scotiabank in LatAm, CIBC in real estate/healthcare."
        ),
    },
    {
        "category": "Market",
        "subcategory": "Canadian Markets",
        "difficulty": "Easy",
        "question": "What is the TSX and how does it differ from the S&P 500?",
        "answer": (
            "TSX (Toronto Stock Exchange) = Canada's primary stock exchange. "
            "~1,500 listed companies vs. S&P 500's 500. Key difference: TSX is heavily weighted in "
            "financial services (~33%), energy (~18%), and materials/mining (~12%). "
            "S&P 500 is tech-heavy (~30%). TSX has significant gold mining exposure "
            "(Barrick, Kinross, Agnico Eagle). Generally more volatile due to commodity exposure. "
            "Good at-interview answer: compare weighting, note commodity sensitivity, "
            "mention CAD/USD correlation."
        ),
    },
    {
        "category": "Technical",
        "subcategory": "Canadian Markets",
        "difficulty": "Hard",
        "question": "How does Bay Street recruiting differ from Wall Street recruiting?",
        "answer": (
            "Key differences: (1) Timeline: Bay Street (Big 5 banks) recruit January-February for summer. "
            "Wall Street (Goldman, MS, JPM) recruit September-November — much earlier. "
            "(2) Size: US banks have hundreds of summer analysts globally. "
            "Canadian Big 5 hire 5-20 per group. "
            "(3) Process: Bay Street = more networking-dependent, warmer culture. "
            "Wall Street = more formalized HireVue + superday. "
            "(4) Compensation: US banks pay ~$110-130K USD all-in for SA. "
            "Canadian Big 5 ~$70-90K CAD. "
            "(5) Exit ops: Both lead to PE/AM but US gives access to larger global funds."
        ),
    },
]
