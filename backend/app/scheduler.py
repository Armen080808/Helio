from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from .database import SessionLocal
from .services.market import fetch_and_store_market_data
from .services.news import fetch_and_store_news
from .services.jobs import fetch_and_store_jobs

scheduler = BackgroundScheduler(timezone="America/Toronto")


def _with_db(fn):
    def wrapper():
        db = SessionLocal()
        try:
            fn(db)
        finally:
            db.close()
    return wrapper


def start_scheduler():
    # Market data: weekdays at 4:30pm ET (after TSX close)
    scheduler.add_job(
        _with_db(fetch_and_store_market_data),
        CronTrigger(day_of_week="mon-fri", hour=16, minute=30, timezone="America/Toronto"),
        id="market_data",
        replace_existing=True,
    )

    # News: every 4 hours
    scheduler.add_job(
        _with_db(fetch_and_store_news),
        CronTrigger(hour="0,4,8,12,16,20", minute=0),
        id="news",
        replace_existing=True,
    )

    # Jobs: daily at 8am ET
    scheduler.add_job(
        _with_db(fetch_and_store_jobs),
        CronTrigger(hour=8, minute=0, timezone="America/Toronto"),
        id="jobs",
        replace_existing=True,
    )

    scheduler.start()
    print("[SCHEDULER] Started — market@4:30pm ET, news every 4h, jobs@8am ET")


def stop_scheduler():
    if scheduler.running:
        scheduler.shutdown()
