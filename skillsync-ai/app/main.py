"""SkillSync AI — FastAPI application entry point.

Run with:
    uvicorn app.main:app --reload

Interactive docs:
    http://127.0.0.1:8000/docs     (Swagger UI)
    http://127.0.0.1:8000/redoc    (ReDoc)
"""

from __future__ import annotations

from contextlib import asynccontextmanager
from typing import AsyncIterator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.match_routes import router as match_router
from app.api.recommend_routes import router as recommend_router
from app.background.tasks import precompute_embeddings
from app.config import settings
from app.core.logger import logger


# ── Lifespan ────────────────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    """Startup / shutdown lifecycle hook.

    On startup we pre-compute embeddings so the first request is fast.
    """
    logger.info("🚀 Starting %s v%s", settings.app_name, settings.app_version)
    try:
        precompute_embeddings()
        logger.info("✅ Embedding cache warmed successfully")
    except Exception:
        logger.warning("⚠️  Embedding warm-up failed — will compute on first request")
    yield
    logger.info("👋 Shutting down %s", settings.app_name)


# ── App factory ─────────────────────────────────────────────────────

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description=(
        "AI-powered skill matching and recommendation platform. "
        "Uses SentenceTransformers for semantic understanding, "
        "hybrid scoring for recommendations, and greedy clustering "
        "for team building."
    ),
    lifespan=lifespan,
)

# ── CORS (allow everything for hackathon demo) ─────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Mount routers ──────────────────────────────────────────────────
app.include_router(match_router, prefix="/api")
app.include_router(recommend_router, prefix="/api")

# Compatibility aliases without the /api prefix.
app.include_router(match_router, include_in_schema=False)
app.include_router(recommend_router, include_in_schema=False)


# ── Root endpoints ─────────────────────────────────────────────────

@app.get("/", tags=["meta"])
def root() -> dict:
    """Landing endpoint — confirms the API is live."""
    return {
        "app": settings.app_name,
        "version": settings.app_version,
        "docs": "/docs",
        "status": "running",
    }


@app.get("/health", tags=["meta"])
def health_check() -> dict:
    """Health-check endpoint for uptime monitors."""
    return {"status": "healthy"}
