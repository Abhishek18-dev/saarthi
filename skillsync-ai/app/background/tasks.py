"""Background tasks for heavy / async operations.

In a production deployment these would be pushed to a proper task
queue (Celery, ARQ, etc.).  For the hackathon demo we use FastAPI's
built-in ``BackgroundTasks`` to run them after the response is sent.
"""

from __future__ import annotations

import time
from typing import Any

from app.core.logger import logger
from app.services.matching.vectorizer import embed_users
from app.services.matching.similarity import compute_similarity_matrix
from app.services.common.utils import load_users, invalidate_caches


def precompute_embeddings() -> dict[str, Any]:
    """Pre-compute and cache all user embeddings + similarity matrix.

    Called at startup or on-demand to warm the vector cache so the
    first real request is fast.
    """
    logger.info("Background: pre-computing embeddings …")
    start = time.perf_counter()

    users = load_users()
    embeddings = embed_users(users)
    sim_matrix = compute_similarity_matrix(embeddings)

    elapsed = time.perf_counter() - start
    logger.info(
        "Background: embeddings ready — %d users, %.2fs elapsed",
        len(users),
        elapsed,
    )
    return {
        "users": len(users),
        "embedding_shape": list(embeddings.shape),
        "sim_matrix_shape": list(sim_matrix.shape),
        "elapsed_seconds": round(elapsed, 3),
    }


def refresh_data() -> None:
    """Invalidate caches and re-load data from disk.

    Useful after the mock JSON files are edited without restarting
    the server.
    """
    logger.info("Background: refreshing data caches …")
    invalidate_caches()
    # Re-warm.
    precompute_embeddings()
    logger.info("Background: data refresh complete")


def log_match_event(
    user_id: int,
    matches: list[dict[str, Any]],
) -> None:
    """Log a matching event for analytics (placeholder).

    In production this would write to a database or event stream.
    """
    logger.info(
        "Analytics: user %d matched with %d users — top score %.4f",
        user_id,
        len(matches),
        matches[0]["similarity_score"] if matches else 0.0,
    )
