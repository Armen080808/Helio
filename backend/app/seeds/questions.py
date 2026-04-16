QUESTIONS = [
    # ─────────────────────────────────────────
    # TECHNICAL — Valuation
    # ─────────────────────────────────────────
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
    {
        "category": "Technical",
        "subcategory": "Valuation",
        "difficulty": "Hard",
        "question": "How do you calculate WACC?",
        "answer": (
            "WACC = (E/V × Re) + (D/V × Rd × (1-T)) where: "
            "E = market value of equity, D = market value of debt, V = E + D, "
            "Re = cost of equity (from CAPM: Rf + β × Market Risk Premium), "
            "Rd = cost of debt (yield on the company's bonds or interest rate on loans), "
            "T = tax rate (debt tax shield). Use market values, not book values. "
            "Higher WACC → lower DCF value. Sensitive to beta and capital structure assumptions."
        ),
    },
    {
        "category": "Technical",
        "subcategory": "Valuation",
        "difficulty": "Hard",
        "question": "Walk me through a comparable company analysis.",
        "answer": (
            "1. Select comparable companies: same industry, similar size, business model, geography. "
            "2. Spread key financial metrics: revenue, EBITDA, EBIT, net income (LTM and NTM). "
            "3. Calculate trading multiples: EV/EBITDA, EV/EBIT, EV/Revenue, P/E. "
            "4. Apply mean/median multiples to target's financials to get implied valuation range. "
            "5. Sanity check: is the target a premium or discount to peers (and why)? "
            "Key: use NTM estimates for forward multiples; adjust for non-recurring items."
        ),
    },
    {
        "category": "Technical",
        "subcategory": "Valuation",
        "difficulty": "Medium",
        "question": "What is a terminal value and how do you calculate it?",
        "answer": (
            "Terminal value (TV) captures value beyond the explicit forecast period (usually year 5-10). "
            "Two methods: "
            "(1) Gordon Growth Model: TV = FCF_n × (1+g) / (WACC - g), where g = perpetuity growth rate (2-3%). "
            "TV often represents 60-80% of total DCF value, so it's the most sensitive assumption. "
            "(2) Exit Multiple Method: TV = EBITDA_n × EV/EBITDA exit multiple (based on comps). "
            "Always cross-check both methods. GGM is more conservative; exit multiple is market-based."
        ),
    },
    {
        "category": "Technical",
        "subcategory": "Valuation",
        "difficulty": "Easy",
        "question": "If two companies have the same P/E, are they equally valued?",
        "answer": (
            "No — P/E ignores capital structure differences. A highly levered company may have low P/E "
            "due to high interest expense depressing net income, but EV/EBITDA would show it's expensive. "
            "Also P/E is affected by tax rates, accounting choices, non-recurring items. "
            "Better to use EV/EBITDA for cross-company comparison when capital structures differ. "
            "P/E is useful for same-industry companies with similar debt levels."
        ),
    },
    # ─────────────────────────────────────────
    # TECHNICAL — Accounting
    # ─────────────────────────────────────────
    {
        "category": "Technical",
        "subcategory": "Accounting",
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
        "subcategory": "Accounting",
        "difficulty": "Hard",
        "question": "Walk me through the three financial statements and how they link together.",
        "answer": (
            "Income Statement → shows revenue, expenses, net income over a period. "
            "Net income flows to retained earnings on the Balance Sheet. "
            "Cash Flow Statement → starts with net income, then adjusts for non-cash items (D&A), "
            "working capital changes, capex (investing), debt/equity changes (financing). "
            "Ending cash on CFS = cash on Balance Sheet. "
            "Balance Sheet: Assets = Liabilities + Equity at a point in time. "
            "D&A from IS reduces PP&E (B/S); capex increases PP&E."
        ),
    },
    {
        "category": "Technical",
        "subcategory": "Accounting",
        "difficulty": "Medium",
        "question": "What happens to the three statements if accounts receivable increases by $10M?",
        "answer": (
            "Income Statement: No change (revenue already recognized). "
            "Cash Flow Statement: Accounts receivable is a current asset; increase = use of cash → "
            "operating cash flow decreases by $10M. "
            "Balance Sheet: Current assets (A/R) increase by $10M; cash decreases by $10M "
            "(offsetting, so B/S stays balanced). "
            "Key insight: A/R increase means you collected less cash than you recognized as revenue."
        ),
    },
    {
        "category": "Technical",
        "subcategory": "Accounting",
        "difficulty": "Medium",
        "question": "What is working capital and why does it matter?",
        "answer": (
            "Working Capital = Current Assets - Current Liabilities. "
            "More relevant metric: Net Working Capital (NWC) = (A/R + Inventory) - (A/P + Accrued Expenses). "
            "Change in NWC impacts cash flow. Increasing NWC = cash outflow (e.g., collecting slower, "
            "paying suppliers faster). Decreasing NWC = cash inflow. "
            "In DCF, higher NWC requirements reduce FCF. Negative working capital (e.g., Amazon, grocery "
            "retailers) is actually favorable — customers pay before suppliers need to be paid."
        ),
    },
    {
        "category": "Technical",
        "subcategory": "Accounting",
        "difficulty": "Easy",
        "question": "What is the difference between depreciation and amortization?",
        "answer": (
            "Both are non-cash charges that reduce the book value of assets over time. "
            "Depreciation: applied to tangible assets (PP&E — buildings, machinery, equipment). "
            "Amortization: applied to intangible assets (patents, trademarks, customer relationships, goodwill). "
            "Both reduce net income on IS, are added back on CFS (non-cash). "
            "EBITDA adds both back, making it useful for cross-company comparison regardless of "
            "capitalization policy."
        ),
    },
    {
        "category": "Technical",
        "subcategory": "Accounting",
        "difficulty": "Hard",
        "question": "If a company uses LIFO vs. FIFO and costs are rising, how does this affect the statements?",
        "answer": (
            "LIFO (Last In, First Out): newer (higher cost) inventory sold first → higher COGS → "
            "lower gross profit → lower net income → lower taxes (tax shield). "
            "But balance sheet inventory is lower (older, cheaper units remain). "
            "FIFO (First In, First Out): older (lower cost) inventory sold first → lower COGS → "
            "higher gross profit → higher net income → higher taxes. "
            "Balance sheet inventory is higher (newer, pricier units remain). "
            "Note: LIFO not allowed under IFRS (used in Canada/internationally). US GAAP allows both."
        ),
    },
    {
        "category": "Technical",
        "subcategory": "Accounting",
        "difficulty": "Medium",
        "question": "What is goodwill and when does it appear on a balance sheet?",
        "answer": (
            "Goodwill = purchase price paid in an acquisition MINUS the fair value of net identifiable assets. "
            "It represents the premium for brand, customer relationships, synergies, talent. "
            "Only appears after an acquisition — not internally generated. "
            "Under IFRS and GAAP: goodwill is not amortized but tested for impairment annually. "
            "Goodwill impairment = write-down on IS (reduces earnings), reduces goodwill on B/S. "
            "High goodwill on B/S warrants scrutiny — may signal overpaid acquisitions."
        ),
    },
    # ─────────────────────────────────────────
    # TECHNICAL — LBO
    # ─────────────────────────────────────────
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
    {
        "category": "Technical",
        "subcategory": "LBO",
        "difficulty": "Medium",
        "question": "What is IRR and how is it different from MOIC in a PE context?",
        "answer": (
            "IRR (Internal Rate of Return) = annualized return on investment, accounting for time. "
            "MOIC (Multiple on Invested Capital) = total return multiple (exit equity / entry equity). "
            "Difference: MOIC ignores time; IRR penalizes longer holds. "
            "Example: 3x MOIC in 3 years = ~44% IRR. Same 3x MOIC in 7 years = ~17% IRR. "
            "PE funds target 20%+ IRR and 2.5-3x+ MOIC. "
            "IRR is preferred for comparing across funds; MOIC shows raw magnitude of return."
        ),
    },
    {
        "category": "Technical",
        "subcategory": "LBO",
        "difficulty": "Hard",
        "question": "If I increase the leverage in an LBO, what happens to the IRR?",
        "answer": (
            "Higher leverage generally increases IRR IF the company can service the debt. "
            "Reason: equity check is smaller → same exit value = higher return on smaller investment. "
            "BUT: more debt = more interest expense → less cash flow → less debt paydown → "
            "more bankruptcy risk. At excessive leverage, IRR actually falls due to higher default risk. "
            "Sweet spot: 4-6x EBITDA leverage for typical LBO. Investors price risk via higher expected returns. "
            "Also: higher leverage amplifies both gains AND losses (financial risk)."
        ),
    },
    {
        "category": "Technical",
        "subcategory": "LBO",
        "difficulty": "Hard",
        "question": "What is a debt schedule and how does it work in an LBO?",
        "answer": (
            "Debt schedule tracks all debt tranches throughout the hold period: "
            "1. Term Loan A/B: senior secured, lowest rate, mandatory amortization (1% per year typically). "
            "2. Revolving credit facility: drawn/repaid as needed for working capital. "
            "3. Senior Notes: fixed coupon, no amortization, bullet maturity. "
            "4. Mezzanine/PIK: subordinated, higher yield, sometimes paid-in-kind. "
            "5. Equity: most junior, highest return potential. "
            "The schedule models: beginning balance → interest → mandatory amortization → "
            "optional cash sweeps → ending balance. Cash sweep = excess cash repays most expensive debt first."
        ),
    },
    # ─────────────────────────────────────────
    # TECHNICAL — M&A
    # ─────────────────────────────────────────
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
    {
        "category": "Technical",
        "subcategory": "M&A",
        "difficulty": "Medium",
        "question": "What are the key synergies acquirers look for in a deal?",
        "answer": (
            "Revenue synergies: cross-selling, entering new markets, pricing power. Hard to underwrite — "
            "often overstated. Cost synergies: eliminating duplicate functions (HR, IT, finance), "
            "procurement leverage, plant consolidation, headcount reduction. More reliable. "
            "Financial synergies: lower cost of capital (debt capacity), tax benefits. "
            "Rule of thumb: cost synergies achievable in 2-3 years; revenue synergies take longer. "
            "Bankers typically underwrite only 50-70% of forecast synergies in models."
        ),
    },
    {
        "category": "Technical",
        "subcategory": "M&A",
        "difficulty": "Hard",
        "question": "What is a purchase price allocation (PPA) and why does it matter?",
        "answer": (
            "After an acquisition, the buyer must allocate the purchase price to all assets/liabilities "
            "of the acquired company at fair value. Steps: "
            "(1) Identify tangible assets (PP&E, inventory, A/R) at fair value. "
            "(2) Identify and value intangibles (customer relationships, patents, brand). "
            "(3) Remainder = goodwill. "
            "Why it matters: intangible assets are amortized → reduces future earnings. "
            "Goodwill is NOT amortized but impaired if deal underperforms. "
            "PPA can significantly impact reported EPS post-acquisition."
        ),
    },
    {
        "category": "Technical",
        "subcategory": "M&A",
        "difficulty": "Medium",
        "question": "What is the difference between a merger and an acquisition?",
        "answer": (
            "Acquisition: one company purchases another; target ceases to exist independently. "
            "Merger: two companies combine to form a new entity (or one survives). "
            "Types: horizontal (same industry), vertical (supply chain), conglomerate (unrelated). "
            "In practice, most 'mergers' are acquisitions — true mergers of equals are rare. "
            "Structurally: acquisitions can be cash, stock, or mixed consideration. "
            "Tax: cash deals taxable to target shareholders; stock deals can be tax-free (if structured as reorganization)."
        ),
    },
    {
        "category": "Technical",
        "subcategory": "M&A",
        "difficulty": "Hard",
        "question": "What is a hostile takeover and what defenses exist?",
        "answer": (
            "Hostile takeover: acquirer bypasses target's board and goes directly to shareholders "
            "(tender offer) or replaces the board via proxy fight. "
            "Common defenses: "
            "(1) Poison pill (shareholder rights plan): existing shareholders can buy new shares at discount "
            "if acquirer crosses ownership threshold, diluting hostile acquirer. "
            "(2) Staggered board: only 1/3 of board elected each year → harder to replace quickly. "
            "(3) White knight: target finds friendlier acquirer. "
            "(4) Pac-Man defense: target turns around and bids for acquirer. "
            "(5) Crown jewel: sell key assets to make company less attractive."
        ),
    },
    # ─────────────────────────────────────────
    # TECHNICAL — Canadian Markets
    # ─────────────────────────────────────────
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
    {
        "category": "Technical",
        "subcategory": "Canadian Markets",
        "difficulty": "Easy",
        "question": "What is the TSX and how does it differ from the S&P 500?",
        "answer": (
            "TSX (Toronto Stock Exchange) = Canada's primary stock exchange. "
            "~1,500 listed companies vs. S&P 500's 500. Key difference: TSX is heavily weighted in "
            "financial services (~33%), energy (~18%), and materials/mining (~12%). "
            "S&P 500 is tech-heavy (~30%). TSX has significant gold mining exposure "
            "(Barrick, Kinross, Agnico Eagle). Generally more volatile due to commodity exposure."
        ),
    },
    {
        "category": "Technical",
        "subcategory": "Canadian Markets",
        "difficulty": "Medium",
        "question": "What is the role of Canadian pension funds (CPP, OMERS, OTPP) in Bay Street?",
        "answer": (
            "Canadian pensions are among the most sophisticated institutional investors globally. "
            "CPP (~$550B), Ontario Teachers ($250B+), OMERS ($120B+), CPPIB invest directly in PE, "
            "infrastructure, real assets — often competing with, not just hiring from, Bay Street. "
            "'Canadian pension model' = direct investing + active management vs. outsourcing to funds. "
            "For students: pensions offer good culture, pay, and WLB vs. IB. "
            "Pathway: often hire directly from IB or from MBA programs. GPA cutoff ~3.7+."
        ),
    },
    # ─────────────────────────────────────────
    # TECHNICAL — Fixed Income & Derivatives
    # ─────────────────────────────────────────
    {
        "category": "Technical",
        "subcategory": "Fixed Income",
        "difficulty": "Medium",
        "question": "What is duration and how does it affect bond price sensitivity?",
        "answer": (
            "Duration measures a bond's price sensitivity to changes in interest rates. "
            "Modified Duration ≈ % change in price for a 1% change in yield. "
            "A bond with duration 7 loses ~7% in price if yields rise 1%. "
            "Factors: longer maturity → higher duration. Higher coupon → lower duration "
            "(more cash returned early). Zero-coupon bonds have duration = maturity. "
            "Convexity adjusts for non-linearity (duration understates price gains when rates fall). "
            "Portfolio managers use duration to manage interest rate risk."
        ),
    },
    {
        "category": "Technical",
        "subcategory": "Fixed Income",
        "difficulty": "Easy",
        "question": "What is a credit spread and what does it indicate?",
        "answer": (
            "Credit spread = difference between a corporate bond yield and the equivalent-maturity "
            "government bond yield (risk-free rate). "
            "It compensates investors for credit risk (default risk) and liquidity risk. "
            "Wider spread = market perceives higher default risk (or market stress). "
            "Investment grade (IG): spreads typically 50-200 bps. "
            "High yield (HY): spreads typically 300-800 bps. "
            "Spreads widen during recessions/credit crises (e.g., COVID-19 March 2020 saw IG spreads "
            "reach 400 bps). Used as a measure of credit market health."
        ),
    },
    {
        "category": "Technical",
        "subcategory": "Derivatives",
        "difficulty": "Medium",
        "question": "What is the difference between a call and a put option?",
        "answer": (
            "Call option: gives holder the RIGHT (not obligation) to BUY the underlying asset "
            "at the strike price before expiration. Buyer profits when price rises above strike. "
            "Put option: gives holder the RIGHT to SELL the underlying at strike price. "
            "Buyer profits when price falls below strike. "
            "Option price (premium) = intrinsic value + time value. "
            "Key inputs (Black-Scholes): stock price, strike, time to expiry, risk-free rate, volatility. "
            "In M&A: real options analysis used for valuing flexible investments."
        ),
    },
    # ─────────────────────────────────────────
    # MARKET — Macro
    # ─────────────────────────────────────────
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
    {
        "category": "Market",
        "subcategory": "Macro",
        "difficulty": "Medium",
        "question": "Explain quantitative easing (QE) and its market effects.",
        "answer": (
            "QE: central bank purchases government bonds (or MBS) in open market, injecting money supply. "
            "Effects: (1) Pushes down long-term yields → cheaper borrowing for companies/consumers. "
            "(2) Inflates asset prices (stocks, real estate) — 'TINA' (There Is No Alternative) to equities. "
            "(3) Weakens currency → boosts exports. (4) Can create asset bubbles and inflation. "
            "Used by Fed, ECB, BoC post-2008 and COVID-19. "
            "Tapering (reducing QE purchases) signals tighter policy → typically negative for bonds/equities."
        ),
    },
    {
        "category": "Market",
        "subcategory": "Macro",
        "difficulty": "Medium",
        "question": "What is inflation and how do central banks typically respond to it?",
        "answer": (
            "Inflation = general rise in price level (measured by CPI, PCE, PPI). "
            "Central banks (Bank of Canada, Fed) target ~2% CPI as 'healthy.' "
            "High inflation response: raise interest rates → increases borrowing cost → "
            "reduces spending and investment → cools demand → lowers prices. "
            "Also reduces money supply growth. Tradeoff: rate hikes risk causing recession. "
            "Low inflation / deflation: cut rates, use QE. "
            "2022-2024 context: CPI hit 8%+ post-COVID → aggressive rate hikes in Canada and US. "
            "Know the current Bank of Canada rate for your interview."
        ),
    },
    {
        "category": "Market",
        "subcategory": "Current Events",
        "difficulty": "Medium",
        "question": "What is the current Bank of Canada interest rate and what's the outlook?",
        "answer": (
            "Know the current rate going into your interview. Check bankofcanada.ca the morning of your interview. "
            "Key factors: CPI trends, unemployment rate, housing market, CAD/USD exchange rate. "
            "For interviews: state the rate, give recent trend (cutting/hiking), and give a 12-month "
            "outlook with reasoning. Be able to explain transmission mechanism: "
            "rate changes → mortgage rates → consumer spending → GDP growth."
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
        "subcategory": "Canadian Markets",
        "difficulty": "Easy",
        "question": "What sectors dominate the TSX Composite Index?",
        "answer": (
            "TSX is dominated by: Financials (~33%) — Big 5 banks + insurers (Manulife, Sun Life). "
            "Energy (~18%) — Canadian Natural Resources, Suncor, Cenovus. "
            "Materials (~12%) — Barrick Gold, Kinross, Agnico Eagle, Teck. "
            "Industrials (~12%). "
            "This makes TSX highly sensitive to commodity prices and interest rates. "
            "Contrast with S&P 500: heavily tech (~30%) and healthcare (~14%). "
            "Good interview answer: compare sector weights and macro sensitivities."
        ),
    },
    # ─────────────────────────────────────────
    # BEHAVIORAL — General
    # ─────────────────────────────────────────
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
    {
        "category": "Behavioral",
        "subcategory": "General",
        "difficulty": "Medium",
        "question": "Tell me about a time you disagreed with your team and how you handled it.",
        "answer": (
            "Banks want to see you can disagree professionally without damaging relationships. "
            "Formula: (1) Describe the disagreement briefly (keep it professional — no blame). "
            "(2) Explain your reasoning — show analytical thinking. "
            "(3) How you presented your view — listened first, then made your case with data. "
            "(4) Resolution: did you come to consensus? Did you defer to the team? "
            "What was the outcome? Key: show EQ (emotional intelligence) and collaborative problem-solving."
        ),
    },
    {
        "category": "Behavioral",
        "subcategory": "General",
        "difficulty": "Easy",
        "question": "Where do you see yourself in 5 years?",
        "answer": (
            "Don't say 'PE' in an IB interview (even if that's true — it signals you're leaving). "
            "Better: 'I want to develop deep technical and client-facing skills in IB, "
            "build expertise in [sector], and eventually take on more senior client responsibilities.' "
            "For consulting: 'I see myself as a strong problem-solver with broad industry exposure, "
            "potentially moving into a client leadership role or leveraging these skills in industry.' "
            "Be ambitious but loyal-sounding. Show growth mindset."
        ),
    },
    {
        "category": "Behavioral",
        "subcategory": "General",
        "difficulty": "Medium",
        "question": "Tell me about a leadership experience where you drove results.",
        "answer": (
            "Use STAR framework. Best examples: led a team in a case competition to a top finish, "
            "organized a finance club event that raised attendance, managed a group project under "
            "a tight deadline. Quantify the result: 'increased attendance by 40%', 'placed 2nd out of 60 teams'. "
            "Show you: set direction, motivated others, made difficult decisions, delivered outcomes. "
            "Avoid vague stories — specificity signals authenticity."
        ),
    },
    {
        "category": "Behavioral",
        "subcategory": "General",
        "difficulty": "Easy",
        "question": "What do you do when you don't know the answer to something?",
        "answer": (
            "Banks value intellectual honesty over bluffing. Strong answer: "
            "'I acknowledge I don't know the answer rather than guess incorrectly. "
            "I'd commit to finding the right answer quickly and follow up — in banking, "
            "accuracy matters more than speed. I'd also flag to my senior that I need clarification "
            "so expectations are set properly.' "
            "You can demonstrate this in the interview itself by asking for clarification "
            "rather than assuming."
        ),
    },
    {
        "category": "Behavioral",
        "subcategory": "Networking",
        "difficulty": "Easy",
        "question": "How have you explored your interest in finance?",
        "answer": (
            "Banks look for genuine curiosity and initiative. Strong examples: "
            "(1) Coffee chats with analysts/associates — show you've done the work. "
            "(2) Finance clubs: RCFA, TSIC, UTFA — mention specific roles. "
            "(3) Personal investing: even a small portfolio shows initiative. "
            "(4) Reading: Bloomberg, Financial Times, Globe and Mail, WSJ. "
            "(5) Courses: financial modeling bootcamp, CFA prep. "
            "Specificity wins. 'I've been following RBC's advisory role in the Rogers-Shaw merger' "
            "is far stronger than 'I follow the markets.'"
        ),
    },
    # ─────────────────────────────────────────
    # BEHAVIORAL — Asset Management Specific
    # ─────────────────────────────────────────
    {
        "category": "Behavioral",
        "subcategory": "Asset Management",
        "difficulty": "Easy",
        "question": "Why asset management instead of investment banking?",
        "answer": (
            "Authentic answer: (1) Long-term investing perspective vs. transactional focus of IB. "
            "(2) Directly managing capital and building conviction around investments. "
            "(3) Depth over breadth — becoming an expert in specific sectors or asset classes. "
            "(4) Better work-life balance at most AM firms vs. IB. "
            "Show you understand the difference in day-to-day work: "
            "IB = deal execution (pitching, modeling, marketing); "
            "AM = research, portfolio construction, risk management, performance attribution."
        ),
    },
    {
        "category": "Behavioral",
        "subcategory": "Asset Management",
        "difficulty": "Medium",
        "question": "Pitch me a stock.",
        "answer": (
            "Structure: (1) Company overview: what does it do, size, industry. "
            "(2) Investment thesis: why is it undervalued or poised for growth? 2-3 specific catalysts. "
            "(3) Valuation: current trading multiple vs. peers vs. intrinsic value (rough DCF or EV/EBITDA). "
            "(4) Key risks: what could make you wrong? "
            "(5) Target price / return expectation and time horizon. "
            "Avoid popular names (Apple, Tesla) — pick something you have genuine conviction about. "
            "Canadian examples: Shopify (high growth), CNR (infrastructure moat), "
            "Suncor (energy value play), Brookfield (asset-light compounder)."
        ),
    },
    {
        "category": "Behavioral",
        "subcategory": "Asset Management",
        "difficulty": "Hard",
        "question": "What is a PE ratio and what are its limitations as a valuation metric?",
        "answer": (
            "P/E = Price / Earnings per share. Simple, widely used, intuitive. "
            "Limitations: (1) EPS can be manipulated through accounting choices. "
            "(2) Ignores capital structure — companies with different debt levels not comparable. "
            "(3) Meaningless for companies with negative earnings (growth stocks, cyclicals in downturns). "
            "(4) Doesn't account for growth — a high P/E may be cheap if growth rate is high (PEG ratio helps). "
            "(5) Look-back vs. look-forward: trailing P/E uses past; forward P/E uses analyst estimates. "
            "Better alternatives: EV/EBITDA (capital structure neutral), EV/FCF, or sum-of-the-parts."
        ),
    },
    # ─────────────────────────────────────────
    # FIT — Consulting
    # ─────────────────────────────────────────
    {
        "category": "Behavioral",
        "subcategory": "Consulting",
        "difficulty": "Easy",
        "question": "Why consulting?",
        "answer": (
            "Strong answer: (1) Exposure to diverse industries and business problems in compressed time. "
            "(2) Rapid skill development: structured problem-solving, client communication, "
            "hypothesis-driven analysis. (3) Impact at senior levels early in career. "
            "Differentiate by tying to your story: 'My experience in [role] showed me I enjoy "
            "diagnosing business problems and developing solutions, which is exactly what consultants do.' "
            "Show understanding of consultant lifestyle: heavy travel, client work, fast-paced project cycles."
        ),
    },
    {
        "category": "Behavioral",
        "subcategory": "Consulting",
        "difficulty": "Medium",
        "question": "How would you estimate the market size of coffee shops in Toronto?",
        "answer": (
            "Market sizing / guesstimate. Structure first: Top-down or Bottom-up. "
            "Bottom-up example: Toronto population ~3M. Average household = 2.5 people → ~1.2M households. "
            "Assume 60% visit a coffee shop at least once per week → 720K regular visitors. "
            "Average spend = $7 per visit, 2x per week → $14/week/person. "
            "Total weekly spend: 720K × $14 = ~$10M/week → ~$500M/year. "
            "Sanity check: ~3,000 coffee shops in Toronto × $500K average revenue = $1.5B. "
            "Show your reasoning clearly, state assumptions, check for reasonableness."
        ),
    },
    # ─────────────────────────────────────────
    # TECHNICAL — Private Equity
    # ─────────────────────────────────────────
    {
        "category": "Technical",
        "subcategory": "Private Equity",
        "difficulty": "Hard",
        "question": "What is a management buyout (MBO) and how does it differ from a standard LBO?",
        "answer": (
            "MBO = LBO where the existing management team is the buyer (or co-investor with PE). "
            "Similarities: heavy leverage, PE sponsor leads, same LBO mechanics. "
            "Differences: management has insider knowledge → better due diligence, less information asymmetry. "
            "Risk: management team conflicts of interest (they set the price and buy it). "
            "Advantage: management already incentivized and aligned. "
            "MBOs common in founder exits, carve-outs, or public-to-private transactions. "
            "Example: Dell's 2013 $24B go-private was a founder-led MBO with Silver Lake."
        ),
    },
    {
        "category": "Technical",
        "subcategory": "Private Equity",
        "difficulty": "Medium",
        "question": "What is a portfolio company add-on acquisition and why do PE firms pursue them?",
        "answer": (
            "Add-on (bolt-on): PE-backed platform company acquires smaller company in same/adjacent space. "
            "Strategic rationale: (1) Multiple arbitrage — buy smaller company at lower EV/EBITDA, "
            "combined platform valued at higher multiple. (2) Revenue synergies: cross-sell, enter new markets. "
            "(3) Cost synergies: eliminate overlapping functions. (4) Scale economies. "
            "(5) Geographic expansion. "
            "Example: buy a US software company at 8x EBITDA as add-on to platform trading at 12x → "
            "creates immediate value through multiple arbitrage. "
            "Common in fragmented industries: HVAC, dental, veterinary, insurance."
        ),
    },
    {
        "category": "Technical",
        "subcategory": "Private Equity",
        "difficulty": "Hard",
        "question": "What is a dividend recapitalization and when would a PE firm use it?",
        "answer": (
            "Div recap: portfolio company takes on new debt to pay a special dividend to the PE sponsor, "
            "returning capital without requiring a full exit. "
            "Why PE uses it: (1) Lock in gains before exit, especially if market conditions are uncertain. "
            "(2) Return capital to LP investors who may need liquidity. "
            "(3) Can reset the IRR clock (earlier return → higher IRR). "
            "Risks: increases leverage on portfolio company, reduces financial flexibility, "
            "may signal PE firm is extracting value at the expense of company health. "
            "Common in favorable debt market environments (low rates, loose covenants)."
        ),
    },
    # ─────────────────────────────────────────
    # TECHNICAL — Asset Management
    # ─────────────────────────────────────────
    {
        "category": "Technical",
        "subcategory": "Asset Management",
        "difficulty": "Medium",
        "question": "What is alpha and how does it differ from beta?",
        "answer": (
            "Beta (β): measures a portfolio's or stock's sensitivity to the market. "
            "β = 1 → moves with market. β > 1 → more volatile than market. β < 1 → less volatile. "
            "Alpha (α): excess return above what beta predicts. "
            "If market returns 10%, your portfolio beta = 1.2, and you return 14% → "
            "alpha = 14% - 12% (beta-adjusted expected return) = 2%. "
            "Goal of active management = generate positive alpha. "
            "Most active managers don't beat their benchmark net of fees (Sharpe ratio matters). "
            "Factor models (Fama-French): add size, value, momentum to explain alpha."
        ),
    },
    {
        "category": "Technical",
        "subcategory": "Asset Management",
        "difficulty": "Medium",
        "question": "What is the Sharpe ratio and why is it important?",
        "answer": (
            "Sharpe Ratio = (Portfolio Return - Risk-Free Rate) / Portfolio Standard Deviation. "
            "Measures risk-adjusted returns — how much excess return per unit of risk taken. "
            "Higher Sharpe = better risk-adjusted performance. "
            "Sharpe > 1 is generally good; Sharpe > 2 is excellent; Sharpe > 3 is exceptional. "
            "Limitation: uses standard deviation (assumes normal distribution) → underestimates "
            "tail risk (crashes). Alternative: Sortino ratio (only penalizes downside volatility). "
            "Used by allocators (endowments, pensions) to compare funds."
        ),
    },
    {
        "category": "Technical",
        "subcategory": "Asset Management",
        "difficulty": "Easy",
        "question": "What is the difference between active and passive investing?",
        "answer": (
            "Passive (index) investing: buy all stocks in an index (S&P 500, TSX 60), match market returns, "
            "minimize costs. Goal: capture market beta. Low fee (~0.03-0.20% MER). "
            "Active investing: portfolio manager selects specific securities aiming to beat the benchmark. "
            "Higher fees (~0.50-2%+ MER). "
            "Evidence: most active managers underperform their benchmark over 10+ years net of fees (SPIVA data). "
            "However: active management more competitive in less efficient markets "
            "(small cap, emerging markets, private credit). "
            "Current trend: passive has taken market share from active significantly since 2010."
        ),
    },
    {
        "category": "Technical",
        "subcategory": "Asset Management",
        "difficulty": "Hard",
        "question": "Walk me through how you would construct a simple equity portfolio.",
        "answer": (
            "Step 1: Define investment objective and constraints (return target, risk tolerance, liquidity, "
            "time horizon, regulatory constraints). "
            "Step 2: Asset allocation — broad decision on equities vs. bonds vs. alternatives. "
            "Step 3: Sector/factor allocation — overweight/underweight sectors vs. benchmark. "
            "Step 4: Security selection — bottom-up fundamental analysis or quantitative screening. "
            "Step 5: Position sizing — Kelly criterion, equal-weight, or conviction-based. "
            "Step 6: Risk management — tracking error, factor exposures, concentration limits. "
            "Step 7: Monitor and rebalance — performance attribution, benchmark comparison."
        ),
    },
    # ─────────────────────────────────────────
    # NETWORKING
    # ─────────────────────────────────────────
    {
        "category": "Behavioral",
        "subcategory": "Networking",
        "difficulty": "Easy",
        "question": "How do you approach a coffee chat with a Bay Street analyst?",
        "answer": (
            "Before: research their background (LinkedIn, deal history), prepare 5-7 thoughtful questions. "
            "Opening: brief intro, thank them for their time, state clear purpose. "
            "Questions to ask: day-to-day work, path to their role, advice for recruiting, "
            "their favourite aspect of the firm's culture, a deal they worked on. "
            "Don'ts: don't ask salary, don't be pushy about referrals, don't make it about you the whole time. "
            "After: send a thank-you email within 24 hours with a specific callback to the conversation. "
            "Key: genuine curiosity > scripted questions."
        ),
    },
    {
        "category": "Behavioral",
        "subcategory": "Networking",
        "difficulty": "Medium",
        "question": "How many coffee chats should you do before applying and how do you track them?",
        "answer": (
            "Recommended: 3-5 coffee chats per firm you're serious about, ideally including at least "
            "one analyst, one associate, and someone in the specific group you're targeting. "
            "Quality > quantity. One great coffee chat with a senior person who remembers your name "
            "is worth more than 10 generic calls. "
            "Tracking: use a CRM-style spreadsheet (or Helio's contact tracker) — "
            "name, firm, date, key talking points, follow-up sent, referral potential. "
            "Follow up at recruiting events and reference previous conversations. "
            "Your goal: be a known name before the application portal opens."
        ),
    },
    # ─────────────────────────────────────────
    # CASE FRAMEWORKS
    # ─────────────────────────────────────────
    {
        "category": "Technical",
        "subcategory": "Case Interview",
        "difficulty": "Medium",
        "question": "A company's profits are declining. How would you diagnose the issue?",
        "answer": (
            "Profit = Revenue - Costs. Start with this decomposition: "
            "Revenue side: Is revenue down? If yes — volume or price? Which product/segment/geography? "
            "Market-wide issue or company-specific? "
            "Cost side: If revenue is stable but margins are down — which cost line is growing? "
            "COGS (raw materials, labor, supply chain)? SG&A (headcount, marketing)? "
            "R&D? One-time items? "
            "Then: competitive dynamics (market share), macro factors, operational issues. "
            "Structure your analysis before diving into specific hypotheses. "
            "Always lead with: 'I'd like to break this into revenue and costs — is that OK?'"
        ),
    },
    {
        "category": "Technical",
        "subcategory": "Case Interview",
        "difficulty": "Hard",
        "question": "Should our company enter the Canadian electric vehicle market?",
        "answer": (
            "Market entry framework: (1) Market attractiveness — TAM, growth rate, profitability, "
            "competitive intensity. Canadian EV market: growing but dominated by Tesla, GM, Ford. "
            "(2) Company fit — do we have capabilities, technology, brand, channels? "
            "(3) Entry strategy — greenfield (build), acquisition, partnership/JV? "
            "(4) Financial analysis — NPV of entry, payback period, IRR vs. hurdle rate. "
            "(5) Risks — regulatory (ZEV mandate), supply chain (battery sourcing), incumbents. "
            "Conclusion: synthesize into a recommendation with 3 supporting points. "
            "In consulting: always lead with your recommendation, then support it."
        ),
    },
    # ─────────────────────────────────────────
    # TECHNICAL — Restructuring
    # ─────────────────────────────────────────
    {
        "category": "Technical",
        "subcategory": "Restructuring",
        "difficulty": "Hard",
        "question": "What is a debt restructuring and what are the main options available to a distressed company?",
        "answer": (
            "Debt restructuring: renegotiating terms of existing debt obligations to avoid bankruptcy. "
            "Options: (1) Out-of-court restructuring (consensual) — extend maturities, reduce coupons, "
            "convert debt to equity (debt-for-equity swap). Faster and cheaper than court process. "
            "(2) CCAA protection (Canadian) or Chapter 11 (US) — court-supervised reorganization. "
            "Company continues operating while restructuring plan is developed. "
            "(3) Liquidation (Chapter 7 / BIA) — assets sold, proceeds distributed to creditors in priority. "
            "Priority: secured creditors → unsecured creditors → preferred equity → common equity. "
            "Restructuring bankers (Rothschild, Lazard, Evercore) advise on both debtor and creditor sides."
        ),
    },
    {
        "category": "Technical",
        "subcategory": "Restructuring",
        "difficulty": "Medium",
        "question": "What is the priority of claims in a bankruptcy?",
        "answer": (
            "Absolute Priority Rule (APR): claims must be paid in full before junior claims receive anything. "
            "Order: (1) Secured creditors (first lien, second lien) — have collateral. "
            "(2) Administrative expenses (legal fees, DIP financing). "
            "(3) Priority unsecured claims (employee wages, pension obligations). "
            "(4) General unsecured creditors (trade creditors, senior notes). "
            "(5) Subordinated debt. (6) Preferred shareholders. (7) Common equity. "
            "Recovery rates (typical): first lien ~85%, second lien ~50%, unsecured ~30%, equity ~0% "
            "in most distressed scenarios. Know this cold for restructuring or credit roles."
        ),
    },
    # ─────────────────────────────────────────
    # TECHNICAL — Accounting (advanced)
    # ─────────────────────────────────────────
    {
        "category": "Technical",
        "subcategory": "Accounting",
        "difficulty": "Hard",
        "question": "How does a stock-based compensation (SBC) expense affect the three financial statements?",
        "answer": (
            "Income Statement: SBC is recognized as an operating expense (reduces EBIT and net income). "
            "Cash Flow Statement: SBC is a non-cash charge → added back in operating activities. "
            "So operating cash flow is HIGHER than net income by the SBC amount. "
            "Balance Sheet: Additional paid-in capital (equity) increases by SBC amount. "
            "Key nuance: when options/RSUs vest, new shares are issued → dilutes existing shareholders. "
            "Many tech companies report 'non-GAAP EPS' that excludes SBC — controversial. "
            "In IB: use diluted share count (includes options) when calculating equity value."
        ),
    },
    {
        "category": "Technical",
        "subcategory": "Accounting",
        "difficulty": "Hard",
        "question": "What is deferred revenue and how does it appear on financial statements?",
        "answer": (
            "Deferred revenue = cash received before service/product is delivered. A liability. "
            "Common in: SaaS (annual subscriptions), airlines (ticket sales), magazines. "
            "Income Statement: NOT recognized as revenue until earned. "
            "Balance Sheet: Deferred revenue = current liability (if earned within 1 year). "
            "Cash Flow Statement: Collection of cash = positive operating cash flow even before revenue is recognized. "
            "Why it matters: Companies with large deferred revenue have high earnings quality — "
            "cash comes in before revenue recognition. Watch for aggressive revenue recognition policies."
        ),
    },
    # ─────────────────────────────────────────
    # TECHNICAL — Sector-Specific
    # ─────────────────────────────────────────
    {
        "category": "Technical",
        "subcategory": "Energy",
        "difficulty": "Medium",
        "question": "How do you value an oil and gas company? What metrics are unique to the sector?",
        "answer": (
            "O&G companies valued differently from industrials: "
            "(1) NAV (Net Asset Value): PV of proved reserves (1P, 2P) discounted at 10% (PV10). "
            "Most fundamental O&G metric. "
            "(2) EV/DACF: EV divided by Debt-Adjusted Cash Flow (normalized for debt service). "
            "(3) EV/BOE/D: EV per barrel of oil equivalent produced per day. "
            "(4) Reserve life index: proved reserves / current production. "
            "Traditional EV/EBITDA still used but less meaningful — capex varies hugely. "
            "Key macro factor: WTI oil price assumption + differential (WCS discount for Alberta). "
            "Understand F&D costs (finding and development) per barrel for efficiency comparison."
        ),
    },
    {
        "category": "Technical",
        "subcategory": "Mining",
        "difficulty": "Medium",
        "question": "What is NAV in a mining context and what are key mining valuation metrics?",
        "answer": (
            "NAV (Net Asset Value) = PV of mine's after-tax free cash flows minus initial capex, "
            "discounted at a risk-adjusted rate (typically 5-10%). "
            "Key metrics: (1) P/NAV: price relative to net asset value. Quality miners trade at 1x-1.5x P/NAV. "
            "(2) EV/oz (for gold): EV per ounce of reserves. "
            "(3) AISC (All-In Sustaining Cost) per ounce: total cost to produce one ounce. "
            "Lower AISC = more profitable. Global gold AISC ~$1,200-1,400/oz. "
            "(4) Reserve grade: grams per tonne — higher grade = better economics. "
            "Key macro: gold price, exchange rates (C$/US$), diesel/energy costs."
        ),
    },
    {
        "category": "Technical",
        "subcategory": "Real Estate",
        "difficulty": "Medium",
        "question": "How are REITs valued and what metrics matter most?",
        "answer": (
            "REITs (Real Estate Investment Trusts) — key metrics: "
            "(1) FFO (Funds from Operations) = Net income + D&A - gains on sales. "
            "Primary earnings metric for REITs (depreciation distorts earnings for real estate). "
            "(2) AFFO (Adjusted FFO) = FFO minus maintenance capex. Better cash flow proxy. "
            "(3) P/FFO: price-to-FFO multiple (analogous to P/E). "
            "(4) NAV per unit: value of property portfolio net of debt. Compare to market price. "
            "(5) Cap rate: NOI / Property Value. Lower cap rate = higher valuation. "
            "(6) NAVPU discount/premium: if REIT trades at discount to NAV, may be undervalued. "
            "Canadian REITs: RioCan, Chartwell, Allied Properties, SmartCentres."
        ),
    },
    # ─────────────────────────────────────────
    # MENTAL MATH & ESTIMATION
    # ─────────────────────────────────────────
    {
        "category": "Technical",
        "subcategory": "Mental Math",
        "difficulty": "Easy",
        "question": "If a company has $100M revenue and 20% EBITDA margins, what is EBITDA? If it trades at 10x EV/EBITDA, what is the EV?",
        "answer": (
            "EBITDA = Revenue × EBITDA margin = $100M × 20% = $20M. "
            "EV = EBITDA × multiple = $20M × 10x = $200M. "
            "If net debt = $40M → Equity Value = $200M - $40M = $160M. "
            "If 10M shares outstanding → share price = $160M / 10M = $16. "
            "Always label your numbers and units. Show your work step by step. "
            "Sanity check: 20% EBITDA margin is healthy for an industrial; high for consumer; "
            "normal for software."
        ),
    },
    {
        "category": "Technical",
        "subcategory": "Mental Math",
        "difficulty": "Medium",
        "question": "A company generates $50M FCF and grows at 3% annually. WACC is 9%. What is the terminal value?",
        "answer": (
            "Gordon Growth Model: TV = FCF × (1+g) / (WACC - g) "
            "= $50M × (1.03) / (0.09 - 0.03) "
            "= $51.5M / 0.06 "
            "= $858M. "
            "To get present value of TV (if it's the year-5 terminal): PV = $858M / (1.09)^5 ≈ $858M / 1.54 ≈ $557M. "
            "This shows why small changes in WACC and g have massive impact on TV — "
            "hence why it's the most sensitive assumption in a DCF."
        ),
    },
]
