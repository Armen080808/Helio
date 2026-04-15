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
]
