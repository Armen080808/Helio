from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .database import init_db, SessionLocal
from .scheduler import start_scheduler, stop_scheduler
from .seeds.runner import seed_all
from .services.jobs import fetch_and_store_jobs
from .controllers import (
    auth, firms, pipeline, contacts, deadlines, questions,
    prep, gpa, events, market, news, jobs, community, dashboard, alumni, admin,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Init DB tables
    init_db()
    # Seed static data
    db = SessionLocal()
    try:
        seed_all(db)
    finally:
        db.close()
    # Initial job scrape (background thread — market data comes from seed above)
    import threading
    def _initial_job_fetch():
        db2 = SessionLocal()
        try:
            fetch_and_store_jobs(db2)
        finally:
            db2.close()
    threading.Thread(target=_initial_job_fetch, daemon=True).start()
    # Start background scheduler
    start_scheduler()
    yield
    stop_scheduler()


app = FastAPI(title="alyo API — UofT Finance Platform", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url, "http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(firms.router)
app.include_router(pipeline.router)
app.include_router(contacts.router)
app.include_router(deadlines.router)
app.include_router(questions.router)
app.include_router(prep.router)
app.include_router(gpa.router)
app.include_router(events.router)
app.include_router(market.router)
app.include_router(news.router)
app.include_router(jobs.router)
app.include_router(community.router)
app.include_router(dashboard.router)
app.include_router(alumni.router)
app.include_router(admin.router)


@app.get("/", tags=["health"])
def health():
    return {"status": "ok", "app": "alyo", "version": "2.0"}
