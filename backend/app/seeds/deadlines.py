from datetime import date

DEADLINES = [
    # US Bulge Brackets - recruit earliest
    {
        "firm_name": "Goldman Sachs",
        "role": "Summer Analyst - Investment Banking",
        "type": "IB",
        "cycle": "Summer 2027",
        "application_open": date(2026, 8, 15),
        "application_deadline": date(2026, 10, 15),
        "networking_season_start": date(2026, 8, 1),
        "notes": (
            "Apply the moment applications open — spots fill fast. "
            "HireVue sent within days of applying."
        ),
        "source_url": "https://www.goldmansachs.com/careers/students",
    },
    {
        "firm_name": "Morgan Stanley",
        "role": "Summer Analyst - Investment Banking",
        "type": "IB",
        "cycle": "Summer 2027",
        "application_open": date(2026, 8, 15),
        "application_deadline": date(2026, 10, 31),
        "networking_season_start": date(2026, 8, 1),
        "notes": (
            "Apply early — rolling basis. HireVue first round, then superday in Nov/Dec."
        ),
        "source_url": "https://www.morganstanley.com/people/students",
    },
    {
        "firm_name": "JP Morgan",
        "role": "Summer Analyst - Investment Banking",
        "type": "IB",
        "cycle": "Summer 2027",
        "application_open": date(2026, 9, 1),
        "application_deadline": date(2026, 10, 31),
        "networking_season_start": date(2026, 8, 15),
        "notes": (
            "Video interview first round. Strong campus presence through JP Morgan FORCE."
        ),
        "source_url": "https://careers.jpmorgan.com/us/en/students",
    },
    {
        "firm_name": "Barclays",
        "role": "Summer Analyst - Investment Banking",
        "type": "IB",
        "cycle": "Summer 2027",
        "application_open": date(2026, 9, 1),
        "application_deadline": date(2026, 11, 15),
        "notes": "Online assessment first. Then video interview.",
        "source_url": "https://home.barclays/careers/students",
    },
    # Canadian Big 5 - recruit in Jan-Feb
    {
        "firm_name": "TD Securities",
        "role": "Summer Analyst - Investment Banking",
        "type": "IB",
        "cycle": "Summer 2027",
        "application_open": date(2027, 1, 5),
        "application_deadline": date(2027, 1, 31),
        "networking_season_start": date(2026, 9, 1),
        "notes": (
            "Network heavily Sept-Dec before apps open. "
            "Attend RCFA TD info session in Oct. Interviews in February."
        ),
        "source_url": "https://jobs.td.com/en-CA/students",
    },
    {
        "firm_name": "RBC Capital Markets",
        "role": "Summer Analyst - Capital Markets",
        "type": "IB",
        "cycle": "Summer 2027",
        "application_open": date(2027, 1, 5),
        "application_deadline": date(2027, 2, 1),
        "networking_season_start": date(2026, 9, 1),
        "notes": (
            "Superday in February. Group exercise + individual interviews. "
            "Know RBC's recent deals."
        ),
        "source_url": "https://jobs.rbc.com/ca/en/students",
    },
    {
        "firm_name": "BMO Capital Markets",
        "role": "Summer Analyst - Investment Banking",
        "type": "IB",
        "cycle": "Summer 2027",
        "application_open": date(2026, 12, 15),
        "application_deadline": date(2027, 1, 20),
        "networking_season_start": date(2026, 9, 1),
        "notes": (
            "Earliest of Big 5 — apps open in December. HireVue then superday in January."
        ),
        "source_url": "https://jobs.bmo.com/ca/en/students",
    },
    {
        "firm_name": "Scotiabank Global Banking & Markets",
        "role": "Summer Analyst - Global Banking",
        "type": "IB",
        "cycle": "Summer 2027",
        "application_open": date(2027, 1, 10),
        "application_deadline": date(2027, 2, 7),
        "networking_season_start": date(2026, 9, 15),
        "notes": (
            "Strong in LatAm. Ask about global coverage in interviews. "
            "Technical + behavioural rounds."
        ),
        "source_url": "https://jobs.scotiabank.com/students",
    },
    {
        "firm_name": "CIBC Capital Markets",
        "role": "Summer Analyst - Investment Banking",
        "type": "IB",
        "cycle": "Summer 2027",
        "application_open": date(2027, 1, 15),
        "application_deadline": date(2027, 2, 15),
        "networking_season_start": date(2026, 10, 1),
        "notes": "Less competitive than TD/RBC. Good first-choice IB if targeting Big 5.",
        "source_url": "https://cibccm.com/en/about/careers",
    },
    # Elite Boutiques
    {
        "firm_name": "Rothschild & Co",
        "role": "Summer Analyst - M&A Advisory",
        "type": "IB",
        "cycle": "Summer 2027",
        "application_open": date(2027, 1, 15),
        "application_deadline": date(2027, 2, 20),
        "networking_season_start": date(2026, 10, 1),
        "notes": "Pure advisory shop. Demonstrate M&A passion. Smaller class than big banks.",
        "source_url": "https://www.rothschildandco.com/en/careers",
    },
    # Asset Management
    {
        "firm_name": "Brookfield Asset Management",
        "role": "Investment Analyst - Real Assets",
        "type": "AM",
        "cycle": "Summer 2027",
        "application_open": date(2027, 1, 1),
        "application_deadline": date(2027, 2, 28),
        "networking_season_start": date(2026, 9, 1),
        "notes": (
            "Case study required. Know Brookfield's infrastructure/real estate strategy. "
            "TSIC alumni often get referrals."
        ),
        "source_url": "https://bam.brookfield.com/careers",
    },
    {
        "firm_name": "CPP Investments",
        "role": "Summer Associate - Investment",
        "type": "AM",
        "cycle": "Summer 2027",
        "application_open": date(2026, 11, 1),
        "application_deadline": date(2027, 1, 15),
        "networking_season_start": date(2026, 9, 1),
        "notes": (
            "Apply via their student program portal. Earlier deadline than most. "
            "Strong pension fund culture."
        ),
        "source_url": "https://www.cppinvestments.com/careers",
    },
    {
        "firm_name": "OMERS",
        "role": "Summer Analyst - Private Equity",
        "type": "AM",
        "cycle": "Summer 2027",
        "application_open": date(2027, 1, 10),
        "application_deadline": date(2027, 2, 10),
        "notes": "Good culture and WLB. Strong pension mandate. Case interview standard.",
        "source_url": "https://www.omers.com/careers",
    },
    # Consulting
    {
        "firm_name": "McKinsey & Company",
        "role": "Business Analyst - Undergraduate",
        "type": "Consulting",
        "cycle": "Summer 2027",
        "application_open": date(2026, 9, 1),
        "application_deadline": date(2026, 10, 1),
        "networking_season_start": date(2026, 8, 15),
        "notes": (
            "Case interview is everything. Use McKinsey's problem solving game. "
            "Apply via campus portal."
        ),
        "source_url": "https://www.mckinsey.com/careers/students",
    },
    {
        "firm_name": "Boston Consulting Group",
        "role": "Associate - Undergraduate",
        "type": "Consulting",
        "cycle": "Summer 2027",
        "application_open": date(2026, 9, 1),
        "application_deadline": date(2026, 10, 15),
        "networking_season_start": date(2026, 8, 15),
        "notes": "BCG Casey chatbot for practice. Collaborative culture. Earlier deadline than Bain.",
        "source_url": "https://www.bcg.com/careers/students",
    },
    {
        "firm_name": "Bain & Company",
        "role": "Associate Consultant Intern",
        "type": "Consulting",
        "cycle": "Summer 2027",
        "application_open": date(2026, 9, 15),
        "application_deadline": date(2026, 10, 31),
        "networking_season_start": date(2026, 9, 1),
        "notes": (
            "Friendliest MBB. Strong PE consulting in Toronto. "
            "Coffee chat before applying helps a lot."
        ),
        "source_url": "https://www.bain.com/careers/students",
    },
    # ── More Consulting ──────────────────────────────────────────────
    {
        "firm_name": "Oliver Wyman",
        "role": "Consultant Intern",
        "type": "Consulting",
        "cycle": "Summer 2027",
        "application_open": date(2026, 9, 1),
        "application_deadline": date(2026, 10, 31),
        "networking_season_start": date(2026, 8, 15),
        "notes": (
            "Finance-focused consulting. Strong FS practice in Toronto. "
            "Case interview required. Less brand recognition = less competition than MBB."
        ),
        "source_url": "https://www.oliverwyman.com/careers/students",
    },
    {
        "firm_name": "EY-Parthenon",
        "role": "Strategy Analyst Intern",
        "type": "Consulting",
        "cycle": "Summer 2027",
        "application_open": date(2026, 9, 15),
        "application_deadline": date(2026, 11, 1),
        "networking_season_start": date(2026, 9, 1),
        "notes": (
            "Strong PE due diligence practice. Apply through EY campus portal. "
            "Good alternative to MBB for finance-focused consulting."
        ),
        "source_url": "https://www.ey.com/en_ca/careers/students",
    },
    # ── Pension Funds ────────────────────────────────────────────────
    {
        "firm_name": "Ontario Teachers' Pension Plan",
        "role": "Summer Analyst - Investment Management",
        "type": "AM",
        "cycle": "Summer 2027",
        "application_open": date(2026, 11, 1),
        "application_deadline": date(2027, 1, 31),
        "networking_season_start": date(2026, 9, 1),
        "notes": (
            "Extremely competitive. Network through campus events. "
            "Strong direct investing — expect case study on a real asset. "
            "One of Canada's most prestigious internship destinations."
        ),
        "source_url": "https://www.otpp.com/en-ca/about/careers",
    },
    {
        "firm_name": "PSP Investments",
        "role": "Summer Analyst - Private Equity",
        "type": "PE",
        "cycle": "Summer 2027",
        "application_open": date(2026, 11, 15),
        "application_deadline": date(2027, 1, 20),
        "networking_season_start": date(2026, 9, 15),
        "notes": (
            "Montreal-based. Some Toronto exposure. French preferred but not required. "
            "Good alternative to OMERS/OTPP for PE aspirants."
        ),
        "source_url": "https://www.investpsp.com/en/careers",
    },
    # ── Elite Boutiques ──────────────────────────────────────────────
    {
        "firm_name": "Lazard",
        "role": "Summer Analyst - Financial Advisory",
        "type": "IB",
        "cycle": "Summer 2027",
        "application_open": date(2027, 1, 15),
        "application_deadline": date(2027, 2, 28),
        "networking_season_start": date(2026, 10, 1),
        "notes": (
            "Very small Toronto team. Strong restructuring and M&A. "
            "Get a referral through networking if possible. "
            "Almost all advisory — no ECM/DCM."
        ),
        "source_url": "https://www.lazard.com/careers/students-graduates",
    },
    {
        "firm_name": "Evercore",
        "role": "Summer Analyst - Investment Banking",
        "type": "IB",
        "cycle": "Summer 2027",
        "application_open": date(2026, 9, 1),
        "application_deadline": date(2026, 10, 31),
        "networking_season_start": date(2026, 8, 1),
        "notes": (
            "Apply to US offices (NY) as Canadian presence is limited. "
            "Extremely competitive. Pure advisory — excellent deal quality."
        ),
        "source_url": "https://www.evercore.com/careers",
    },
    # ── Networking Events (early-cycle) ─────────────────────────────
    {
        "firm_name": "Goldman Sachs",
        "role": "Insight Program / Off-cycle",
        "type": "IB",
        "cycle": "Fall 2026",
        "application_open": date(2026, 4, 1),
        "application_deadline": date(2026, 5, 15),
        "networking_season_start": date(2026, 3, 1),
        "notes": (
            "Goldman's Insight Program for first-year students. "
            "Apply in April for summer program. Good brand exposure before main recruiting."
        ),
        "source_url": "https://www.goldmansachs.com/careers/students/programs",
    },
    {
        "firm_name": "TD Securities",
        "role": "First Year Insight Program",
        "type": "IB",
        "cycle": "Summer 2026",
        "application_open": date(2026, 3, 1),
        "application_deadline": date(2026, 4, 15),
        "networking_season_start": date(2026, 2, 15),
        "notes": (
            "TD's diversity and insight programs for first-year students. "
            "Excellent way to build TD relationship early. Apply in March."
        ),
        "source_url": "https://jobs.td.com/en-CA/students",
    },
    {
        "firm_name": "RBC Capital Markets",
        "role": "Diversity in Banking Program",
        "type": "IB",
        "cycle": "Summer 2026",
        "application_open": date(2026, 3, 15),
        "application_deadline": date(2026, 4, 30),
        "networking_season_start": date(2026, 3, 1),
        "notes": (
            "RBC's first-year diversity program. Great way to get RBC exposure before "
            "the main SA recruiting cycle. Leads to expedited SA interviews in Year 2."
        ),
        "source_url": "https://jobs.rbc.com/ca/en/students",
    },
    # ── Asset Management ─────────────────────────────────────────────
    {
        "firm_name": "BlackRock",
        "role": "Summer Analyst - Portfolio Analytics",
        "type": "AM",
        "cycle": "Summer 2027",
        "application_open": date(2026, 9, 1),
        "application_deadline": date(2026, 10, 31),
        "networking_season_start": date(2026, 8, 15),
        "notes": (
            "Apply via BlackRock campus portal. Aladdin platform knowledge is a plus. "
            "Good for quant-oriented students. Less traditional finance, more data/risk analytics."
        ),
        "source_url": "https://careers.blackrock.com/students",
    },
    {
        "firm_name": "Brookfield Asset Management",
        "role": "Investment Analyst - Credit",
        "type": "AM",
        "cycle": "Summer 2027",
        "application_open": date(2026, 12, 1),
        "application_deadline": date(2027, 2, 15),
        "networking_season_start": date(2026, 9, 1),
        "notes": (
            "Brookfield's credit team (separate from real assets team). "
            "Good alternative application if real assets role is highly competitive."
        ),
        "source_url": "https://bam.brookfield.com/careers",
    },
]
