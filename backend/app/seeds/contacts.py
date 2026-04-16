"""
Demo Bay Street networking contacts for seeding a new user's contact list.
DEMO_CONTACTS is a list of dicts; date fields are intentionally omitted here
and computed dynamically in seed_demo_contacts() so today's date is always correct.
"""

from datetime import date, timedelta

# Each entry mirrors the Contact model fields (except user_id / firm_id / id).
# follow_up_date is a timedelta offset from today, resolved at call time.
# Use None where a field should be left blank.

DEMO_CONTACTS_TEMPLATE = [
    {
        "name": "James Whitfield",
        "title": "Analyst, Equity Capital Markets",
        "firm_name": "TD Securities",
        "email": None,
        "linkedin_url": "https://www.linkedin.com/in/james-whitfield-tds",
        "how_met": "RCFA networking night (March 2024)",
        "date_met_offset": -90,          # days relative to today
        "last_contact_offset": -14,
        "follow_up_offset": 7,
        "notes": (
            "Really helpful — walked me through ECM recruiting timeline at TD. "
            "Said to reach back out after summer. Strong contact for the M&A desk referral."
        ),
        "warmth": "Warm",
    },
    {
        "name": "Priya Nair",
        "title": "Associate, M&A Advisory",
        "firm_name": "RBC Capital Markets",
        "email": "p.nair@rbc.com",
        "linkedin_url": "https://www.linkedin.com/in/priya-nair-rbccm",
        "how_met": "LinkedIn cold outreach — responded after 2nd message",
        "date_met_offset": -60,
        "last_contact_offset": -7,
        "follow_up_offset": 14,
        "notes": (
            "30-min coffee chat over Zoom. Gave detailed breakdown of superday process. "
            "Suggested connecting with her MD before applying. Very warm — offered to refer."
        ),
        "warmth": "Hot",
    },
    {
        "name": "Derek Huang",
        "title": "Investment Banking Analyst",
        "firm_name": "BMO Capital Markets",
        "email": None,
        "linkedin_url": None,
        "how_met": "UofT Finance Club speaker panel (February 2024)",
        "date_met_offset": -120,
        "last_contact_offset": -45,
        "follow_up_offset": 30,
        "notes": (
            "Met briefly after the panel. Exchanged emails but no follow-up coffee chat yet. "
            "Focused on industrials coverage. Reach out before BMO recruitment opens."
        ),
        "warmth": "Cold",
    },
    {
        "name": "Sophie Tremblay",
        "title": "Analyst, Investment Banking",
        "firm_name": "Goldman Sachs",
        "email": None,
        "linkedin_url": "https://www.linkedin.com/in/sophie-tremblay-gs",
        "how_met": "LinkedIn cold outreach",
        "date_met_offset": -30,
        "last_contact_offset": -30,
        "follow_up_offset": 21,
        "notes": (
            "Toronto IBD analyst in TMT group. Haven't had a call yet — follow up to schedule. "
            "GS recruits very early; she said September is when everything moves."
        ),
        "warmth": "Cold",
    },
    {
        "name": "Amir Hashemi",
        "title": "Investment Analyst",
        "firm_name": "CPP Investments",
        "email": "a.hashemi@cppib.com",
        "linkedin_url": "https://www.linkedin.com/in/amir-hashemi-cppib",
        "how_met": "TSIC alumni coffee chat",
        "date_met_offset": -45,
        "last_contact_offset": -10,
        "follow_up_offset": 10,
        "notes": (
            "Great conversation about the Student Investment Program. "
            "Stressed that deal experience and quant skills matter most. "
            "Offered to pass along my resume to the recruiting team. Follow up with updated CV."
        ),
        "warmth": "Hot",
    },
    {
        "name": "Natalie Chen",
        "title": "Analyst, Private Equity",
        "firm_name": "Brookfield Asset Management",
        "email": None,
        "linkedin_url": "https://www.linkedin.com/in/natalie-chen-bam",
        "how_met": "RCFA Brookfield case competition (January 2024)",
        "date_met_offset": -100,
        "last_contact_offset": -20,
        "follow_up_offset": 14,
        "notes": (
            "Judged our team at the case comp — left a strong impression. "
            "She specifically said to reach back out. Real estate infra team. "
            "Case interview is a key screen at Brookfield."
        ),
        "warmth": "Warm",
    },
    {
        "name": "Marcus O'Brien",
        "title": "Associate",
        "firm_name": "Onex Corporation",
        "email": None,
        "linkedin_url": "https://www.linkedin.com/in/marcus-obrien-onex",
        "how_met": "LinkedIn outreach — 1 degree connection via TSIC alum",
        "date_met_offset": -15,
        "last_contact_offset": -15,
        "follow_up_offset": 45,
        "notes": (
            "Just accepted his connect request. No call yet. "
            "Onex typically hires 2nd-year IB analysts — worth maintaining relationship for post-IB exit."
        ),
        "warmth": "Cold",
    },
    {
        "name": "Rachel Kim",
        "title": "Business Analyst",
        "firm_name": "McKinsey & Company",
        "email": "r.kim@mckinsey.com",
        "linkedin_url": None,
        "how_met": "Coffee chat arranged through UofT Rotman referral",
        "date_met_offset": -55,
        "last_contact_offset": -25,
        "follow_up_offset": 5,
        "notes": (
            "Rotman Commerce 2022 grad. Gave thorough breakdown of McKinsey case interview structure. "
            "Recommended practicing 60+ cases and using Victor Cheng framework. "
            "Offered to do a mock case — need to follow up to schedule."
        ),
        "warmth": "Warm",
    },
    {
        "name": "Tyler Bowen",
        "title": "Summer Analyst (returning)",
        "firm_name": "Scotiabank Global Banking & Markets",
        "email": None,
        "linkedin_url": "https://www.linkedin.com/in/tyler-bowen-gfin",
        "how_met": "Mutual friend introduction at Sigma Chi alumni event",
        "date_met_offset": -20,
        "last_contact_offset": -5,
        "follow_up_offset": 7,
        "notes": (
            "Returning SA at Scotia GBM next summer — fixed income desk. "
            "Very candid about SA experience and comp. "
            "Said their process is more relaxed than TD/RBC. Great contact for Scotia referral."
        ),
        "warmth": "Hot",
    },
    {
        "name": "Isabel Rodrigues",
        "title": "Investment Analyst, Real Assets",
        "firm_name": "OMERS",
        "email": None,
        "linkedin_url": "https://www.linkedin.com/in/isabel-rodrigues-omers",
        "how_met": "OMERS campus info session (October 2023)",
        "date_met_offset": -180,
        "last_contact_offset": -60,
        "follow_up_offset": None,          # no follow-up scheduled yet
        "notes": (
            "Met at their campus info session. Exchanged business cards. "
            "Haven't followed up properly — relationship gone cold. "
            "Infrastructure and real estate team. Reach out before next OMERS recruiting cycle."
        ),
        "warmth": "Cold",
    },
]


def build_demo_contacts(user_id) -> list[dict]:
    """
    Return a list of Contact field dicts for the given user_id.
    Dates are resolved relative to today so they're always current.
    """
    today = date.today()

    contacts = []
    for tmpl in DEMO_CONTACTS_TEMPLATE:
        follow_up_offset = tmpl["follow_up_offset"]
        contacts.append(
            {
                "user_id": user_id,
                "firm_id": None,
                "name": tmpl["name"],
                "title": tmpl["title"],
                "firm_name": tmpl["firm_name"],
                "email": tmpl["email"],
                "linkedin_url": tmpl["linkedin_url"],
                "how_met": tmpl["how_met"],
                "date_met": today + timedelta(days=tmpl["date_met_offset"]),
                "last_contact": today + timedelta(days=tmpl["last_contact_offset"]),
                "follow_up_date": (
                    today + timedelta(days=follow_up_offset)
                    if follow_up_offset is not None
                    else None
                ),
                "notes": tmpl["notes"],
                "warmth": tmpl["warmth"],
            }
        )
    return contacts
