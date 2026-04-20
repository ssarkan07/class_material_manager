from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine
import models

# Import all routers
from routers import years, subjects, files

# ── Create all database tables on startup ──────────────────────────────────────
# This reads models.py and creates any tables that don't exist yet in Supabase PostgreSQL.
# It is safe to run multiple times — it never drops existing tables.
models.Base.metadata.create_all(bind=engine)

# ── Create the FastAPI app ─────────────────────────────────────────────────────
app = FastAPI(
    title="Class Material Manager API",
    description="Backend API for managing class materials, subjects, and files.",
    version="1.0.0",
)

# ── CORS Middleware ────────────────────────────────────────────────────────────
# This is REQUIRED so your React app (localhost:5173) can call this API (localhost:8000).
# Without this, the browser will block all requests with a 'CORS error'.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",   # Vite dev server
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],           # Allows GET, POST, PUT, DELETE, etc.
    allow_headers=["*"],
)

# ── Register all routers ───────────────────────────────────────────────────────
app.include_router(years.router)
app.include_router(subjects.router)
app.include_router(files.router)


# ── Health check endpoint ──────────────────────────────────────────────────────
@app.get("/", tags=["Root"])
def root():
    """
    GET /
    Simple health check. Open http://localhost:8000 to confirm the backend is running.
    """
    return {"message": "Class Material Manager API is running!", "docs": "/docs"}
