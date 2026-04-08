from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.routers import auth, users, groups, expenses, settlements, activities
# Import all models so Base.metadata knows about them
import app.models  # noqa: F401


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables on startup (for SQLite dev/test; production uses Alembic)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield


app = FastAPI(
    title="Splitwise Multi-Currency API",
    version="0.1.0",
    docs_url="/api/docs",
    openapi_url="/api/openapi.json",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(groups.router)
app.include_router(expenses.router)
app.include_router(settlements.router)
app.include_router(activities.router)


@app.get("/api/health")
async def health():
    return {"status": "ok"}
