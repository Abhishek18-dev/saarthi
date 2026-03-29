"""Vectorizer — converts user profiles to dense semantic embeddings.

The SentenceTransformer model is loaded **once** at module level so
every subsequent call is a fast forward pass (~5-15 ms per user on
CPU).  The ``all-MiniLM-L6-v2`` model is only ~80 MB, making it
ideal for laptop-scale demos.
"""

from __future__ import annotations

from typing import Any

import numpy as np
from sentence_transformers import SentenceTransformer

from app.config import settings
from app.core.logger import logger

# ── Global model singleton ──────────────────────────────────────────
_model: SentenceTransformer | None = None


def _get_model() -> SentenceTransformer:
    """Lazy-load the SentenceTransformer model (once per process)."""
    global _model
    if _model is None:
        logger.info("Loading embedding model '%s' …", settings.embedding_model)
        _model = SentenceTransformer(settings.embedding_model)
        logger.info("Embedding model loaded successfully")
    return _model


# ── Profile → text ──────────────────────────────────────────────────

def user_to_text(user: dict[str, Any]) -> str:
    """Convert a user profile dict into a single descriptive string.

    The string deliberately interleaves skills, level, goal, bio, and
    interests so the language model can capture both *keyword* and
    *contextual* meaning.

    Example output
    --------------
    "Skills: React, JavaScript, CSS. Level: Beginner.
     Goal: Project. Bio: Frontend enthusiast building interactive UIs.
     Interests: web development, UI/UX, open source."
    """
    skills = ", ".join(user.get("skills", []))
    level = user.get("level", "Unknown")
    goal = user.get("goal", "General")
    bio = user.get("bio", "")
    interests = ", ".join(user.get("interests", []))

    parts: list[str] = [
        f"Skills: {skills}",
        f"Level: {level}",
        f"Goal: {goal}",
    ]
    if bio:
        parts.append(f"Bio: {bio}")
    if interests:
        parts.append(f"Interests: {interests}")

    return ". ".join(parts) + "."


# ── Embedding ───────────────────────────────────────────────────────

def embed_text(text: str) -> np.ndarray:
    """Return the embedding vector for a single text string.

    Returns a 1-D numpy array of shape ``(384,)`` for MiniLM-L6-v2.
    """
    model = _get_model()
    return model.encode(text, convert_to_numpy=True)  # type: ignore[return-value]


def embed_texts(texts: list[str]) -> np.ndarray:
    """Batch-embed multiple texts.

    Returns a 2-D numpy array of shape ``(N, 384)``.
    """
    model = _get_model()
    return model.encode(texts, convert_to_numpy=True, show_progress_bar=False)  # type: ignore[return-value]


def embed_user(user: dict[str, Any]) -> np.ndarray:
    """Convenience: profile dict → embedding vector."""
    return embed_text(user_to_text(user))


def embed_users(users: list[dict[str, Any]]) -> np.ndarray:
    """Batch-embed a list of user profiles."""
    texts = [user_to_text(u) for u in users]
    return embed_texts(texts)
