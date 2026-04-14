from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .database import init_db
from .controllers import auth, clients, proposals, contracts, invoices, bookings, dashboard


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(title="Helio API", lifespan=lifespan)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url, "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router)
app.include_router(clients.router)
app.include_router(proposals.router)
app.include_router(contracts.router)
app.include_router(invoices.router)
app.include_router(bookings.router)
app.include_router(dashboard.router)


@app.get("/", tags=["health"])
def health_check():
    return {"status": "ok"}
