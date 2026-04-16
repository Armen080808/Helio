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
        "question": "Walk me through Bay Street IBD recruiting — timeline, process, and what banks look for.",
        "answer": (
            "Timeline: Big 5 banks (TD, RBC, BMO, Scotia, CIBC) recruit January-February for summer. "
            "National Bank and boutiques (Lazard, Evercore, Rothschild) recruit slightly later or on a rolling basis. "
            "Process: (1) Networking — coffee chats with analysts/associates from Sept-Dec are critical. "
            "Cold emails, LinkedIn, alumni events (RCFA Bay Street Day). "
            "(2) Resume drop — Jan, typically through firm portals. GPA cutoff ~3.0-3.5 depending on firm. "
            "(3) First-round interview — technical + fit; video or phone. "
            "(4) Superday — in-person or video with 4-6 back-to-back interviews. "
            "What banks look for: Financial modelling skills (DCF, comps), market awareness, "
            "deal knowledge (read Globe & Mail, Financial Post daily), genuine interest in the group's coverage, "
            "and demonstrated networking effort. "
            "Comp: Big 5 summer analysts earn ~$70-90K CAD annualized all-in. "
            "Exit ops: Strong path to PE (Onex, Brookfield), credit funds, and Corp Dev."
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

    # ═════════════════════════════════════════
    # EXERCISES — Worked numerical problems
    # ═════════════════════════════════════════

    # ── DCF ──────────────────────────────────
    {
        "category": "Exercise",
        "subcategory": "DCF",
        "difficulty": "Hard",
        "question": (
            "DCF Exercise — NorthernCo Industries\n\n"
            "NorthernCo is a Canadian industrial company. Use the following assumptions:\n\n"
            "  Projected Free Cash Flows (Years 1–5): $48M, $55M, $62M, $68M, $73M\n"
            "  WACC: 9.5%\n"
            "  Terminal growth rate: 2.5%\n"
            "  Net Debt: $115M\n"
            "  Shares outstanding: 22M\n\n"
            "Calculate: (a) PV of FCFs, (b) Terminal Value using Gordon Growth Model, "
            "(c) PV of Terminal Value, (d) Enterprise Value, (e) Equity Value, (f) Implied share price."
        ),
        "answer": (
            "Step 1 — Discount each FCF at WACC of 9.5%:\n"
            "  Year 1: $48M ÷ 1.095¹  = $43.8M\n"
            "  Year 2: $55M ÷ 1.095²  = $45.8M\n"
            "  Year 3: $62M ÷ 1.095³  = $47.2M\n"
            "  Year 4: $68M ÷ 1.095⁴  = $47.3M\n"
            "  Year 5: $73M ÷ 1.095⁵  = $46.4M\n"
            "  → Sum of PV(FCFs) = $230.5M\n\n"
            "Step 2 — Terminal Value (Gordon Growth Model):\n"
            "  TV = FCF₅ × (1 + g) ÷ (WACC − g)\n"
            "  TV = $73M × 1.025 ÷ (0.095 − 0.025)\n"
            "  TV = $74.825M ÷ 0.07 = $1,068.9M\n\n"
            "Step 3 — PV of Terminal Value:\n"
            "  PV(TV) = $1,068.9M ÷ 1.095⁵ = $1,068.9M ÷ 1.5742 = $679.0M\n\n"
            "Step 4 — Enterprise Value:\n"
            "  EV = $230.5M + $679.0M = $909.5M\n\n"
            "Step 5 — Equity Value:\n"
            "  Equity Value = EV − Net Debt = $909.5M − $115M = $794.5M\n\n"
            "Step 6 — Share Price:\n"
            "  Price = $794.5M ÷ 22M shares = $36.11 per share\n\n"
            "Sanity check: TV represents $679M ÷ $909.5M = 74.7% of EV — typical for a DCF. "
            "Small WACC changes swing value significantly: at 8.5% WACC, EV would be ~$1,060M."
        ),
    },
    {
        "category": "Exercise",
        "subcategory": "DCF",
        "difficulty": "Hard",
        "question": (
            "DCF Sensitivity Exercise — MapleLeaf Software Inc.\n\n"
            "MapleLeaf Software is a Toronto-based SaaS company. Base case assumptions:\n\n"
            "  Year 5 FCF (terminal year): $80M\n"
            "  WACC: 10%\n"
            "  Terminal growth rate: 3%\n"
            "  Sum of PV(FCFs Years 1–5): $210M\n"
            "  Net Debt: −$50M (net cash position)\n"
            "  Shares outstanding: 30M\n\n"
            "(a) Calculate base-case Enterprise Value and share price.\n"
            "(b) Recalculate EV if WACC rises to 12% (same terminal FCF and growth rate).\n"
            "(c) Recalculate EV if terminal growth rate falls to 1% (WACC stays at 10%).\n"
            "(d) What does this tell you about DCF sensitivity?"
        ),
        "answer": (
            "Part (a) — Base Case:\n"
            "  TV = $80M × 1.03 ÷ (0.10 − 0.03) = $82.4M ÷ 0.07 = $1,177.1M\n"
            "  PV(TV) = $1,177.1M ÷ 1.10⁵ = $1,177.1M ÷ 1.6105 = $730.9M\n"
            "  EV = $210M + $730.9M = $940.9M\n"
            "  Equity Value = $940.9M − (−$50M) = $990.9M\n"
            "  Share price = $990.9M ÷ 30M = $33.03\n\n"
            "Part (b) — WACC = 12%:\n"
            "  TV = $80M × 1.03 ÷ (0.12 − 0.03) = $82.4M ÷ 0.09 = $915.6M\n"
            "  PV(TV) = $915.6M ÷ 1.12⁵ = $915.6M ÷ 1.7623 = $519.6M\n"
            "  EV ≈ $185M (adj. FCF PVs) + $519.6M = ~$704M\n"
            "  → EV drops from $941M to ~$704M — a 25% decline for just +200bps in WACC\n\n"
            "Part (c) — g = 1%:\n"
            "  TV = $80M × 1.01 ÷ (0.10 − 0.01) = $80.8M ÷ 0.09 = $897.8M\n"
            "  PV(TV) = $897.8M ÷ 1.10⁵ = $557.5M\n"
            "  EV = $210M + $557.5M = $767.5M\n"
            "  → EV drops from $941M to $768M — an 18% decline for −200bps in growth rate\n\n"
            "Part (d) — Key Insight:\n"
            "  Terminal value drives 70–80% of DCF value. WACC and growth rate assumptions are "
            "  the most leveraged inputs — small changes produce massive EV swings. "
            "  Always run a WACC vs. g sensitivity table in any real model."
        ),
    },

    # ── WACC ─────────────────────────────────
    {
        "category": "Exercise",
        "subcategory": "WACC",
        "difficulty": "Hard",
        "question": (
            "WACC Calculation Exercise — MapleRidge Mining Corp.\n\n"
            "Calculate the WACC for MapleRidge Mining using the following data:\n\n"
            "  Capital structure:  Equity = $800M (market value)   Debt = $400M (market value)\n"
            "  Risk-free rate (10-yr GoC bond): 3.4%\n"
            "  Equity risk premium (market): 5.5%\n"
            "  MapleRidge's beta (levered): 1.35\n"
            "  Pre-tax cost of debt: 6.2%\n"
            "  Corporate tax rate: 26.5%\n\n"
            "Show all steps."
        ),
        "answer": (
            "Step 1 — Capital structure weights:\n"
            "  Total capital V = $800M + $400M = $1,200M\n"
            "  E/V = $800M ÷ $1,200M = 66.7%\n"
            "  D/V = $400M ÷ $1,200M = 33.3%\n\n"
            "Step 2 — Cost of equity (CAPM):\n"
            "  Re = Rf + β × (Market Risk Premium)\n"
            "  Re = 3.4% + 1.35 × 5.5%\n"
            "  Re = 3.4% + 7.425% = 10.825%\n\n"
            "Step 3 — After-tax cost of debt:\n"
            "  Rd(after-tax) = 6.2% × (1 − 0.265) = 6.2% × 0.735 = 4.557%\n\n"
            "Step 4 — WACC:\n"
            "  WACC = (E/V × Re) + (D/V × Rd × (1−T))\n"
            "  WACC = (0.667 × 10.825%) + (0.333 × 4.557%)\n"
            "  WACC = 7.220% + 1.517% = 8.74%\n\n"
            "Interpretation: Every dollar of capital invested must return at least 8.74% "
            "to create value for MapleRidge's investors. "
            "The tax shield reduces effective debt cost from 6.2% to 4.56%."
        ),
    },

    # ── LBO Returns ──────────────────────────
    {
        "category": "Exercise",
        "subcategory": "LBO Returns",
        "difficulty": "Hard",
        "question": (
            "LBO Returns Exercise — CedarCrest Holdings\n\n"
            "A private equity firm acquires CedarCrest Holdings with the following terms:\n\n"
            "  Purchase price:          $500M  (10x EBITDA on $50M LTM EBITDA)\n"
            "  Debt financing:          $300M  (6x EBITDA, 7% PIK interest)\n"
            "  Equity check:            $200M\n"
            "  Hold period:             5 years\n"
            "  Exit EBITDA (Year 5):    $80M   (EBITDA grows from $50M at ~10% CAGR)\n"
            "  Exit multiple:           10x EV/EBITDA\n"
            "  Debt outstanding at exit: $210M (after partial paydown from FCF)\n\n"
            "(a) Calculate exit Enterprise Value.\n"
            "(b) Calculate exit Equity Value.\n"
            "(c) Calculate MOIC (Multiple on Invested Capital).\n"
            "(d) Calculate approximate IRR. (Hint: use the rule of 72 or the IRR formula.)"
        ),
        "answer": (
            "Part (a) — Exit Enterprise Value:\n"
            "  EV_exit = Exit EBITDA × Exit Multiple = $80M × 10x = $800M\n\n"
            "Part (b) — Exit Equity Value:\n"
            "  Equity_exit = EV_exit − Debt_exit = $800M − $210M = $590M\n\n"
            "Part (c) — MOIC:\n"
            "  MOIC = Equity_exit ÷ Equity_check = $590M ÷ $200M = 2.95x\n\n"
            "Part (d) — IRR (5-year hold):\n"
            "  Exact IRR: solve for r in: $200M × (1+r)⁵ = $590M\n"
            "  → (1+r)⁵ = 2.95\n"
            "  → (1+r) = 2.95^(1/5) = 1.2415\n"
            "  → r = 24.2% IRR\n\n"
            "Quick check with rule of 72: 72 ÷ 24 ≈ 3 years to double, so ~3x in 5 years ≈ consistent.\n\n"
            "Key drivers of return:\n"
            "  · EBITDA growth ($50M → $80M): contributed ~$300M to EV\n"
            "  · Debt paydown ($300M → $210M): freed $90M of equity value\n"
            "  · Multiple held flat at 10x (no multiple expansion/contraction)"
        ),
    },
    {
        "category": "Exercise",
        "subcategory": "LBO Returns",
        "difficulty": "Hard",
        "question": (
            "LBO Sensitivity Exercise — Leverage vs. Returns\n\n"
            "A PE firm is evaluating two financing structures for a $600M acquisition "
            "(target EBITDA: $60M, purchase multiple: 10x).\n\n"
            "  Structure A:  $240M equity (40%) + $360M debt (60%)\n"
            "  Structure B:  $180M equity (30%) + $420M debt (70%)\n\n"
            "In both cases:\n"
            "  Exit EBITDA (Year 5): $90M at 10x exit multiple → EV_exit = $900M\n"
            "  Assume debt is fully repaid from FCF by exit in Structure A, "
            "  but $80M remains outstanding at exit in Structure B (higher interest burden).\n\n"
            "(a) Calculate exit equity value and MOIC for both structures.\n"
            "(b) Calculate approximate IRR for both structures.\n"
            "(c) Which structure produces higher returns and why?"
        ),
        "answer": (
            "Part (a) — Exit Equity Values:\n"
            "  Structure A: EV_exit = $900M, Debt_exit = $0\n"
            "    → Equity_exit = $900M − $0 = $900M\n"
            "    → MOIC_A = $900M ÷ $240M = 3.75x\n\n"
            "  Structure B: EV_exit = $900M, Debt_exit = $80M\n"
            "    → Equity_exit = $900M − $80M = $820M\n"
            "    → MOIC_B = $820M ÷ $180M = 4.56x\n\n"
            "Part (b) — IRRs (5-year hold):\n"
            "  Structure A: (1+r)⁵ = 3.75 → r = 3.75^0.2 − 1 = 30.3% IRR\n"
            "  Structure B: (1+r)⁵ = 4.56 → r = 4.56^0.2 − 1 = 35.4% IRR\n\n"
            "Part (c) — Insight:\n"
            "  Structure B (higher leverage) generates 5.1 ppt more IRR despite a lower MOIC "
            "  in raw dollar terms per equity dollar invested. The smaller equity check amplifies "
            "  percentage returns. However: Structure B carries higher bankruptcy risk — "
            "  any shortfall in FCF may breach debt covenants. The optimal leverage "
            "  balances return amplification against distress risk."
        ),
    },

    # ── Accretion / Dilution ─────────────────
    {
        "category": "Exercise",
        "subcategory": "Accretion / Dilution",
        "difficulty": "Hard",
        "question": (
            "Accretion/Dilution Exercise — ScotiaTech acquiring Maple Software\n\n"
            "ScotiaTech (acquirer) wants to acquire Maple Software (target). "
            "Use the following data:\n\n"
            "  Acquirer:  Net Income = $200M   |  Shares O/S = 100M   |  Share Price = $40\n"
            "  Target:    Net Income = $30M    |  Purchase Price = $300M (all-stock deal)\n"
            "  Synergies (after-tax): $10M per year\n"
            "  New shares issued = Purchase Price ÷ Acquirer Share Price = $300M ÷ $40 = 7.5M shares\n\n"
            "(a) Calculate acquirer's standalone EPS.\n"
            "(b) Calculate combined net income (including synergies).\n"
            "(c) Calculate new share count post-acquisition.\n"
            "(d) Calculate pro forma EPS.\n"
            "(e) Is the deal accretive or dilutive? By how much?"
        ),
        "answer": (
            "Part (a) — Standalone EPS:\n"
            "  EPS_standalone = Net Income ÷ Shares = $200M ÷ 100M = $2.00\n\n"
            "Part (b) — Combined Net Income:\n"
            "  Combined NI = Acquirer NI + Target NI + Synergies\n"
            "             = $200M + $30M + $10M = $240M\n\n"
            "Part (c) — New Share Count:\n"
            "  New shares issued = $300M ÷ $40 = 7.5M shares\n"
            "  Total shares = 100M + 7.5M = 107.5M\n\n"
            "Part (d) — Pro Forma EPS:\n"
            "  EPS_pro_forma = $240M ÷ 107.5M = $2.233\n\n"
            "Part (e) — Accretion/Dilution:\n"
            "  Change in EPS = $2.233 − $2.00 = +$0.233\n"
            "  Accretion = +$0.233 ÷ $2.00 = +11.7% accretive\n\n"
            "Why accretive? Target's earnings yield = $30M ÷ $300M = 10%. "
            "Acquirer's P/E = $40 ÷ $2.00 = 20x → earnings yield = 5%. "
            "Target is cheaper on an earnings yield basis + synergies push it further accretive. "
            "Rule: deal is accretive when target earnings yield > acquirer's cost of equity."
        ),
    },
    {
        "category": "Exercise",
        "subcategory": "Accretion / Dilution",
        "difficulty": "Hard",
        "question": (
            "Mixed Financing Accretion/Dilution — Financing Mix Matters\n\n"
            "AcquireCo (P/E = 15x, Net Income = $300M, Shares = 150M) "
            "acquires TargetCo for $500M.\n"
            "TargetCo Net Income = $25M. No synergies.\n\n"
            "Evaluate three financing scenarios:\n"
            "  Case 1: 100% cash (cost of cash = 5% pre-tax, tax rate 25%)\n"
            "  Case 2: 100% stock (new shares issued at AcquireCo price of $30/share)\n"
            "  Case 3: 50% cash / 50% stock\n\n"
            "(a) Calculate combined net income, share count, and EPS for each case.\n"
            "(b) Determine if each case is accretive or dilutive.\n"
            "(c) What general rule does this illustrate?"
        ),
        "answer": (
            "Acquirer standalone: EPS = $300M ÷ 150M = $2.00/share\n\n"
            "─── Case 1: 100% Cash ───\n"
            "  After-tax interest cost = $500M × 5% × (1 − 25%) = $18.75M\n"
            "  Combined NI = $300M + $25M − $18.75M = $306.25M\n"
            "  Shares unchanged = 150M\n"
            "  EPS = $306.25M ÷ 150M = $2.042 → +2.1% ACCRETIVE\n\n"
            "─── Case 2: 100% Stock ───\n"
            "  New shares = $500M ÷ $30 = 16.67M\n"
            "  Total shares = 150M + 16.67M = 166.67M\n"
            "  Combined NI = $300M + $25M = $325M (no interest cost)\n"
            "  EPS = $325M ÷ 166.67M = $1.950 → −2.5% DILUTIVE\n\n"
            "─── Case 3: 50/50 Mix ───\n"
            "  Cash portion ($250M): after-tax cost = $250M × 5% × 0.75 = $9.375M\n"
            "  Stock portion ($250M): new shares = $250M ÷ $30 = 8.33M\n"
            "  Total shares = 150M + 8.33M = 158.33M\n"
            "  Combined NI = $300M + $25M − $9.375M = $315.625M\n"
            "  EPS = $315.625M ÷ 158.33M = $1.994 → −0.3% (essentially neutral)\n\n"
            "Key Insight:\n"
            "  Cash financing is accretive because the after-tax cost of debt (3.75%) is less than "
            "  the target's earnings yield ($25M ÷ $500M = 5%). Stock is dilutive because issuing "
            "  shares at 15x P/E (6.7% earnings yield) is cheaper than the target's 5% earnings "
            "  yield — wait, actually stock is dilutive here because more shares are issued than "
            "  the earnings they bring. The break-even comes when target earnings yield = acquirer "
            "  after-tax financing cost."
        ),
    },

    # ── EV Bridge ────────────────────────────
    {
        "category": "Exercise",
        "subcategory": "Enterprise Value",
        "difficulty": "Medium",
        "question": (
            "EV to Equity Value Bridge Exercise\n\n"
            "You are building a football field valuation for RockStar Mining (TSX: RSM). "
            "The comps analysis gives you an EV range of $800M – $1,100M.\n\n"
            "RSM's balance sheet (most recent quarter):\n"
            "  Total debt:                      $220M\n"
            "  Less: Cash and cash equivalents: ($45M)\n"
            "  Preferred shares (market value): $30M\n"
            "  Minority interest (book value):  $15M\n"
            "  Diluted shares outstanding:       85M\n\n"
            "(a) Calculate Net Debt.\n"
            "(b) Calculate Equity Value range from the EV range.\n"
            "(c) Calculate implied share price range.\n"
            "(d) If RSM currently trades at $8.50, is it cheap or expensive vs. your comps?"
        ),
        "answer": (
            "Part (a) — Net Debt:\n"
            "  Net Debt = Total Debt + Preferred + Minority Interest − Cash\n"
            "  Net Debt = $220M + $30M + $15M − $45M = $220M\n\n"
            "Part (b) — Equity Value Range:\n"
            "  Equity Value = Enterprise Value − Net Debt\n"
            "  Low:  $800M − $220M = $580M\n"
            "  High: $1,100M − $220M = $880M\n\n"
            "Part (c) — Implied Share Price Range:\n"
            "  Low:  $580M ÷ 85M shares = $6.82 per share\n"
            "  High: $880M ÷ 85M shares = $10.35 per share\n"
            "  Midpoint: ($6.82 + $10.35) ÷ 2 = $8.59 per share\n\n"
            "Part (d) — Current Price vs. Comps:\n"
            "  RSM trades at $8.50 vs. implied range of $6.82 – $10.35. "
            "  The stock is trading near the midpoint of the comps range — fairly valued. "
            "  It's above the low end (not cheap) but below the high end (not expensive). "
            "  Conclusion: inline with peers; upside exists if RSM re-rates to top-quartile multiple."
        ),
    },

    # ── 3-Statement Accounting ───────────────
    {
        "category": "Exercise",
        "subcategory": "3-Statement Accounting",
        "difficulty": "Hard",
        "question": (
            "3-Statement Impact Exercise\n\n"
            "A company (tax rate 30%) takes out a $100M 5-year term loan at 8% annual interest "
            "to buy new manufacturing equipment worth $100M (straight-line depreciation over 5 years).\n\n"
            "Show the Year 1 impact on all three financial statements:\n"
            "  (a) Income Statement\n"
            "  (b) Cash Flow Statement\n"
            "  (c) Balance Sheet\n\n"
            "Assume the loan is drawn and equipment purchased on Day 1 of the year, "
            "and the entire year of interest and depreciation is recognized in Year 1."
        ),
        "answer": (
            "─── (a) Income Statement ───\n"
            "  Depreciation expense:     −$20M  ($100M ÷ 5 years)\n"
            "  Interest expense:         −$8M   ($100M × 8%)\n"
            "  Pre-tax impact:           −$28M\n"
            "  Tax benefit (30%):        +$8.4M\n"
            "  Net Income impact:        −$19.6M\n\n"
            "─── (b) Cash Flow Statement ───\n"
            "  Operating Activities:\n"
            "    Net Income:             −$19.6M\n"
            "    Add back Depreciation:  +$20.0M  (non-cash)\n"
            "    CFO impact:             +$0.4M (tax shield benefit only)\n\n"
            "  Investing Activities:\n"
            "    Purchase of equipment:  −$100M\n\n"
            "  Financing Activities:\n"
            "    Proceeds from debt:     +$100M\n\n"
            "  Net Change in Cash:       +$0.4M (the tax shield on depreciation + interest)\n\n"
            "─── (c) Balance Sheet ───\n"
            "  Assets:\n"
            "    PP&E (gross):           +$100M\n"
            "    Accumulated Depreciation: −$20M\n"
            "    Net PP&E:               +$80M\n"
            "    Cash:                   +$0.4M (from net cash flow above)\n\n"
            "  Liabilities:\n"
            "    Long-term debt:         +$100M\n\n"
            "  Equity:\n"
            "    Retained Earnings:      −$19.6M (net income impact)\n\n"
            "Check: ΔAssets = +$80.4M | ΔLiabilities + ΔEquity = +$100M − $19.6M = +$80.4M ✓"
        ),
    },
    {
        "category": "Exercise",
        "subcategory": "3-Statement Accounting",
        "difficulty": "Medium",
        "question": (
            "Working Capital Impact Exercise\n\n"
            "CanadaCo reports the following changes in working capital during the year:\n\n"
            "  Accounts Receivable:    increased by $40M\n"
            "  Inventory:              decreased by $15M\n"
            "  Accounts Payable:       increased by $25M\n"
            "  Accrued liabilities:    decreased by $10M\n\n"
            "Net Income for the year = $80M. Depreciation = $20M. No capex or financing changes.\n\n"
            "(a) Calculate the change in Net Working Capital.\n"
            "(b) Calculate Operating Cash Flow.\n"
            "(c) Did working capital consume or release cash? By how much?\n"
            "(d) What does an increase in A/R signal about cash collection?"
        ),
        "answer": (
            "Part (a) — Change in NWC:\n"
            "  NWC = (A/R + Inventory) − (A/P + Accrued)\n"
            "  ΔNWC = (+$40M − $15M) − (+$25M − $10M)\n"
            "       = +$25M − $15M = +$10M increase in NWC\n\n"
            "Part (b) — Operating Cash Flow (indirect method):\n"
            "  CFO = Net Income + D&A − ΔNWC\n"
            "      = $80M + $20M − $10M = $90M\n\n"
            "  Breakdown of working capital items on CFS:\n"
            "    A/R +$40M → cash USE of $40M  (collected less than earned)\n"
            "    Inventory −$15M → cash SOURCE of $15M  (sold without replacing)\n"
            "    A/P +$25M → cash SOURCE of $25M  (delayed payments to suppliers)\n"
            "    Accrued −$10M → cash USE of $10M  (paid previously accrued expenses)\n"
            "    Net WC impact on cash: −$40M + $15M + $25M − $10M = −$10M\n\n"
            "Part (c): NWC increased by $10M → consumed $10M of cash.\n\n"
            "Part (d): Rising A/R means the company recognized revenue but has not yet "
            "collected the cash — a mismatch between earnings and actual cash receipts. "
            "If A/R grows faster than revenue, it may signal: slow-paying customers, "
            "channel stuffing, or deteriorating credit quality."
        ),
    },

    # ── Comps Analysis ───────────────────────
    {
        "category": "Exercise",
        "subcategory": "Comparable Companies",
        "difficulty": "Medium",
        "question": (
            "Comparable Company Analysis Exercise\n\n"
            "You are valuing TargetCo, a Canadian mid-market industrial company. "
            "Its LTM financials: Revenue = $180M, EBITDA = $45M.\n\n"
            "Comparable companies trade at these multiples:\n\n"
            "  Company A:   EV/Revenue = 1.8x   EV/EBITDA = 9.5x\n"
            "  Company B:   EV/Revenue = 2.2x   EV/EBITDA = 11.0x\n"
            "  Company C:   EV/Revenue = 1.5x   EV/EBITDA = 8.0x\n"
            "  Company D:   EV/Revenue = 2.0x   EV/EBITDA = 10.5x\n\n"
            "(a) Calculate the mean and median EV/Revenue and EV/EBITDA multiples.\n"
            "(b) Apply mean and median multiples to TargetCo to get implied EV range.\n"
            "(c) If TargetCo's Net Debt = $60M and shares = 10M, calculate the implied share price range.\n"
            "(d) Which multiple would you weight more heavily, and why?"
        ),
        "answer": (
            "Part (a) — Multiples Summary:\n"
            "  EV/Revenue: 1.8x, 2.2x, 1.5x, 2.0x\n"
            "    Mean = (1.8+2.2+1.5+2.0)÷4 = 7.5÷4 = 1.875x\n"
            "    Median = (1.8+2.0)÷2 = 1.90x  (middle two of sorted: 1.5, 1.8, 2.0, 2.2)\n\n"
            "  EV/EBITDA: 9.5x, 11.0x, 8.0x, 10.5x\n"
            "    Mean = (9.5+11.0+8.0+10.5)÷4 = 39÷4 = 9.75x\n"
            "    Median = (9.5+10.5)÷2 = 10.0x\n\n"
            "Part (b) — Implied EV Range for TargetCo:\n"
            "  EV/Revenue (mean 1.875x):  $180M × 1.875 = $337.5M\n"
            "  EV/Revenue (median 1.90x): $180M × 1.90  = $342.0M\n"
            "  EV/EBITDA (mean 9.75x):   $45M  × 9.75  = $438.8M\n"
            "  EV/EBITDA (median 10.0x): $45M  × 10.0  = $450.0M\n"
            "  → Implied EV range: ~$338M – $450M\n\n"
            "Part (c) — Share Price Range:\n"
            "  Equity Value = EV − Net Debt\n"
            "  Low:  $338M − $60M = $278M ÷ 10M = $27.80\n"
            "  High: $450M − $60M = $390M ÷ 10M = $39.00\n\n"
            "Part (d): Weight EV/EBITDA more heavily for industrial companies. "
            "EV/Revenue ignores profitability (two companies with same revenue but different "
            "margins would incorrectly receive the same implied EV). EBITDA normalizes for "
            "depreciation and capital structure, making it superior for industrials. "
            "Use EV/Revenue as a secondary check or for pre-profitability companies."
        ),
    },

    # ── Debt Paydown Schedule ────────────────
    {
        "category": "Exercise",
        "subcategory": "LBO Debt Schedule",
        "difficulty": "Hard",
        "question": (
            "LBO Debt Paydown Schedule Exercise — PineCrest Packaging\n\n"
            "A PE firm acquires PineCrest Packaging for $400M with the following structure:\n\n"
            "  Term Loan A:  $200M at 7.0% — mandatory amortization $20M/year\n"
            "  Senior Notes: $100M at 9.0% — interest only (bullet maturity Year 5)\n"
            "  Equity:       $100M\n\n"
            "PineCrest generates $60M EBITDA, with interest coverage, taxes (25%), and "
            "D&A of $15M. Capex = $10M/year. ΔWorking Capital = 0.\n\n"
            "Build the Year 1 debt schedule:\n"
            "(a) Calculate EBIT, then Net Income.\n"
            "(b) Calculate FCF available for debt service.\n"
            "(c) Calculate year-end debt balances after mandatory amortization."
        ),
        "answer": (
            "Part (a) — P&L (Year 1):\n"
            "  EBITDA:                 $60.0M\n"
            "  D&A:                   −$15.0M\n"
            "  EBIT:                   $45.0M\n"
            "  Interest — Term Loan A: −$14.0M  ($200M × 7%)\n"
            "  Interest — Sr. Notes:   −$9.0M   ($100M × 9%)\n"
            "  EBT:                    $22.0M\n"
            "  Taxes (25%):            −$5.5M\n"
            "  Net Income:             $16.5M\n\n"
            "Part (b) — Free Cash Flow:\n"
            "  Net Income:             $16.5M\n"
            "  + D&A (non-cash):       +$15.0M\n"
            "  − Capex:                −$10.0M\n"
            "  − ΔWorking Capital:      $0.0M\n"
            "  FCF before debt service: $21.5M\n\n"
            "Part (c) — Debt Balances:\n"
            "  Term Loan A:\n"
            "    Opening balance:     $200.0M\n"
            "    Mandatory amort:     −$20.0M\n"
            "    Optional cash sweep: −$1.5M  (remaining $21.5M FCF − $20M mandatory)\n"
            "    Closing balance:     $178.5M\n\n"
            "  Senior Notes:\n"
            "    Opening balance:     $100.0M\n"
            "    No amortization (bullet maturity)\n"
            "    Closing balance:     $100.0M\n\n"
            "  Total debt at year-end: $178.5M + $100M = $278.5M\n"
            "  (vs. $300M at entry — $21.5M reduction in Year 1)"
        ),
    },

    # ── Capital Structure / EPS ──────────────
    {
        "category": "Exercise",
        "subcategory": "Capital Structure",
        "difficulty": "Medium",
        "question": (
            "Debt vs. Equity Financing — EPS Impact Exercise\n\n"
            "MapleTech Corp. needs to raise $200M to fund a new product line. "
            "It is evaluating two options:\n\n"
            "  Option A: Issue $200M of debt at 6% interest rate\n"
            "  Option B: Issue 8M new shares at $25 per share\n\n"
            "Current situation:\n"
            "  Net Income (standalone):    $100M\n"
            "  Shares outstanding:         50M\n"
            "  Tax rate:                   26.5%\n"
            "  Expected EBIT increase from new product: $20M\n\n"
            "(a) Calculate EPS under each option.\n"
            "(b) Which option is better for existing shareholders and why?\n"
            "(c) At what EBIT increase would the two options produce equal EPS (break-even)?"
        ),
        "answer": (
            "Standalone EPS = $100M ÷ 50M = $2.00\n\n"
            "─── Option A: Debt Financing ───\n"
            "  After-tax interest = $200M × 6% × (1 − 26.5%) = $12M × 0.735 = $8.82M\n"
            "  Additional EBIT contribution (after-tax) = $20M × (1 − 26.5%) = $14.70M\n"
            "  NI impact = $14.70M − $8.82M = +$5.88M\n"
            "  New NI = $100M + $5.88M = $105.88M\n"
            "  Shares unchanged = 50M\n"
            "  EPS_A = $105.88M ÷ 50M = $2.118\n\n"
            "─── Option B: Equity Financing ───\n"
            "  No interest cost. Additional EBIT (after-tax) = $14.70M\n"
            "  New NI = $100M + $14.70M = $114.70M\n"
            "  New shares = 50M + 8M = 58M\n"
            "  EPS_B = $114.70M ÷ 58M = $1.977\n\n"
            "Part (b): Option A (debt) is better for existing shareholders — $2.118 vs $1.977. "
            "Debt financing is EPS-accretive when the after-tax return on invested capital "
            "($14.70M ÷ $200M = 7.35%) exceeds the after-tax cost of debt (4.41%). ✓\n\n"
            "Part (c) — Break-even EBIT:\n"
            "  Let x = EBIT increase. Break-even when EPS_A = EPS_B:\n"
            "  ($100M + x×0.735 − $8.82M) ÷ 50M = ($100M + x×0.735) ÷ 58M\n"
            "  Solve: 58×(91.18M + 0.735x) = 50×(100M + 0.735x)\n"
            "  5,288.44 + 42.63x = 5,000 + 36.75x\n"
            "  5.88x = −288.44 → x = −$49.1M\n"
            "  Interpretation: Debt is always better here given the NI base — the break-even "
            "only occurs at deeply negative EBIT scenarios."
        ),
    },

    # ── Sharpe Ratio ─────────────────────────
    {
        "category": "Exercise",
        "subcategory": "Asset Management",
        "difficulty": "Medium",
        "question": (
            "Portfolio Risk-Return Exercise — Sharpe Ratio & Asset Allocation\n\n"
            "You are comparing two equity funds for a pension allocation:\n\n"
            "  Fund A:  Annual return = 14.5%   Standard deviation = 18%\n"
            "  Fund B:  Annual return = 11.0%   Standard deviation = 9%\n"
            "  Risk-free rate (1-yr GoC T-bill): 3.5%\n\n"
            "(a) Calculate the Sharpe Ratio for each fund.\n"
            "(b) Which fund is more efficient on a risk-adjusted basis?\n"
            "(c) If you allocate $300M to the better Sharpe fund, what is the expected "
            "dollar return in Year 1?\n"
            "(d) A benchmark index returned 12% with a std dev of 10%. Calculate the "
            "Sharpe ratio for the benchmark and determine which fund beats it."
        ),
        "answer": (
            "Part (a) — Sharpe Ratios:\n"
            "  Sharpe = (Return − Risk-Free Rate) ÷ Standard Deviation\n\n"
            "  Fund A: (14.5% − 3.5%) ÷ 18% = 11.0% ÷ 18% = 0.611\n"
            "  Fund B: (11.0% − 3.5%) ÷  9% = 7.5% ÷ 9%   = 0.833\n\n"
            "Part (b): Fund B has a higher Sharpe ratio (0.833 vs 0.611), meaning it generates "
            "more return per unit of risk. For a pension fund focused on risk-adjusted returns, "
            "Fund B is the superior allocation despite its lower absolute return.\n\n"
            "Part (c) — Dollar Return from Fund B:\n"
            "  Expected return = $300M × 11.0% = $33.0M in Year 1\n\n"
            "Part (d) — Benchmark Sharpe:\n"
            "  Benchmark: (12% − 3.5%) ÷ 10% = 8.5% ÷ 10% = 0.850\n\n"
            "  Fund A Sharpe (0.611) < Benchmark (0.850) → Fund A UNDERPERFORMS\n"
            "  Fund B Sharpe (0.833) < Benchmark (0.850) → Fund B slightly UNDERPERFORMS\n"
            "  Conclusion: Neither fund beats the benchmark on a risk-adjusted basis — "
            "  allocating to a low-cost index product may be optimal."
        ),
    },

    # ── Merger Model ─────────────────────────
    {
        "category": "Exercise",
        "subcategory": "Merger Analysis",
        "difficulty": "Hard",
        "question": (
            "Full Merger Model Exercise — RiverRock Capital acquiring CoastalCo\n\n"
            "RiverRock Capital (acquirer) is acquiring CoastalCo (target) for $600M in a "
            "50% cash / 50% stock deal. Use the data below:\n\n"
            "  RiverRock:  NI = $250M   |  Shares = 125M   |  Price = $40   |  P/E = 20x\n"
            "  CoastalCo:  NI = $40M    |  No debt\n"
            "  Cash portion: $300M borrowed at 5% (tax rate 27%)\n"
            "  Stock portion: $300M worth of RiverRock shares issued at $40\n"
            "  Pre-tax synergies: $15M/year\n\n"
            "(a) Calculate incremental interest expense (after-tax).\n"
            "(b) Calculate new shares issued and total share count.\n"
            "(c) Calculate pro forma combined Net Income.\n"
            "(d) Calculate pro forma EPS and % change from standalone.\n"
            "(e) Is the deal accretive or dilutive?"
        ),
        "answer": (
            "Acquirer standalone EPS = $250M ÷ 125M = $2.00\n\n"
            "Part (a) — After-tax interest (cash portion):\n"
            "  Gross interest = $300M × 5% = $15.0M\n"
            "  After-tax = $15.0M × (1 − 0.27) = $10.95M\n\n"
            "Part (b) — New shares issued:\n"
            "  Stock portion = $300M ÷ $40 per share = 7.5M new shares\n"
            "  Total shares = 125M + 7.5M = 132.5M\n\n"
            "Part (c) — Pro Forma Net Income:\n"
            "  RiverRock NI:                +$250.00M\n"
            "  CoastalCo NI:                +$40.00M\n"
            "  After-tax synergies:         +$10.95M  ($15M × 0.73)\n"
            "  After-tax interest cost:     −$10.95M\n"
            "  Pro Forma NI:                $290.00M\n\n"
            "Part (d) — Pro Forma EPS:\n"
            "  EPS_proforma = $290.0M ÷ 132.5M = $2.189\n"
            "  Change = ($2.189 − $2.00) ÷ $2.00 = +9.5% ACCRETIVE\n\n"
            "Part (e): Deal is accretive by 9.5% due to synergies offsetting the cost of "
            "financing. Without synergies: NI = $250M + $40M − $10.95M = $279.05M; "
            "EPS = $279.05M ÷ 132.5M = $2.107 — still slightly accretive (+5.4%) because "
            "CoastalCo's earnings yield ($40M ÷ $600M = 6.7%) > after-tax cash cost (3.65%)."
        ),
    },

    # ── Mental Math / Estimation ─────────────
    {
        "category": "Exercise",
        "subcategory": "Mental Math",
        "difficulty": "Medium",
        "question": (
            "Mental Math / Quick Valuation Exercise\n\n"
            "Answer the following without a calculator — show your working:\n\n"
            "(a) A company has $250M revenue and 22% EBITDA margins. It trades at 11x EV/EBITDA. "
            "    Net Debt = $80M. Shares = 15M. What is the share price?\n\n"
            "(b) A bank has a P/E of 12x and earns $5.50 in EPS. What is the share price?\n\n"
            "(c) An LBO target generates $40M EBITDA. The PE firm pays 9x entry. "
            "    They finance 60% with debt. How big is the equity check?\n\n"
            "(d) A bond with face value $1,000 has a 5% coupon and matures in 3 years. "
            "    If market rates rise to 7%, is the bond worth more or less than $1,000? Why?"
        ),
        "answer": (
            "Part (a) — Share Price:\n"
            "  EBITDA = $250M × 22% = $55M\n"
            "  EV = $55M × 11x = $605M\n"
            "  Equity Value = $605M − $80M = $525M\n"
            "  Share Price = $525M ÷ 15M = $35.00\n\n"
            "Part (b) — Bank Share Price:\n"
            "  Price = P/E × EPS = 12 × $5.50 = $66.00\n\n"
            "Part (c) — LBO Equity Check:\n"
            "  Purchase price = $40M × 9x = $360M\n"
            "  Debt = 60% × $360M = $216M\n"
            "  Equity check = 40% × $360M = $144M\n\n"
            "Part (d) — Bond Price Direction:\n"
            "  The bond is worth LESS than $1,000. When market rates rise above the coupon (5% < 7%), "
            "  existing bonds become less attractive — investors demand a discount to achieve the "
            "  higher market yield. Price and yield move inversely. "
            "  Rough calc: the bond's fair price ≈ $947 (PV of coupons + face at 7% discount rate)."
        ),
    },

    # ── Break-Even / Margin ──────────────────
    {
        "category": "Exercise",
        "subcategory": "Break-Even Analysis",
        "difficulty": "Medium",
        "question": (
            "Break-Even & Margin Analysis Exercise — GreatLakes Manufacturing\n\n"
            "GreatLakes Manufacturing produces industrial widgets. Cost structure:\n\n"
            "  Selling price per unit:    $120\n"
            "  Variable cost per unit:    $75\n"
            "  Fixed costs per year:      $4.5M\n"
            "  Current production:        150,000 units/year\n\n"
            "(a) Calculate contribution margin per unit and contribution margin ratio.\n"
            "(b) Calculate the break-even volume (units).\n"
            "(c) Calculate revenue and EBIT at current production.\n"
            "(d) A new customer offers to buy 20,000 additional units at $90/unit. "
            "    Should GreatLakes accept? Show your reasoning."
        ),
        "answer": (
            "Part (a) — Contribution Margin:\n"
            "  CM per unit = Price − Variable Cost = $120 − $75 = $45\n"
            "  CM ratio = $45 ÷ $120 = 37.5%\n\n"
            "Part (b) — Break-Even Volume:\n"
            "  Break-even units = Fixed Costs ÷ CM per unit\n"
            "                   = $4,500,000 ÷ $45 = 100,000 units\n"
            "  GreatLakes needs to sell 100,000 units just to cover fixed costs.\n\n"
            "Part (c) — Current Revenue & EBIT:\n"
            "  Revenue = 150,000 × $120 = $18,000,000\n"
            "  Variable Costs = 150,000 × $75 = $11,250,000\n"
            "  Contribution = $18,000,000 − $11,250,000 = $6,750,000\n"
            "  EBIT = $6,750,000 − $4,500,000 fixed = $2,250,000\n"
            "  EBIT margin = $2.25M ÷ $18M = 12.5%\n\n"
            "Part (d) — Special Order Decision:\n"
            "  Accept IF the incremental CM > 0 (assuming spare capacity exists).\n"
            "  Incremental CM = ($90 − $75) × 20,000 = $15 × 20,000 = $300,000\n"
            "  Fixed costs don't change (spare capacity assumed) → $300K pure profit.\n"
            "  Decision: YES, accept the order. It increases EBIT by $300K (from $2.25M to $2.55M).\n"
            "  Caveat: Only accept if GreatLakes has capacity and the special price won't "
            "  undercut their standard $120 price with existing customers."
        ),
    },
]
