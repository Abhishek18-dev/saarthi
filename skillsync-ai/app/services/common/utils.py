"""Common utility functions used by multiple services.

Handles JSON-based data loading/caching so services never need to
worry about file I/O directly.

Safety: ``load_users`` and ``load_projects`` return *copies* of the
cached data so callers cannot accidentally mutate the shared cache.
"""

from __future__ import annotations

import copy
import json
from functools import lru_cache
from typing import Any

from app.config import USERS_JSON, PROJECTS_JSON
from app.core.logger import logger


# ── Data loaders ────────────────────────────────────────────────────

@lru_cache(maxsize=1)
def _load_users_raw() -> tuple[dict[str, Any], ...]:
    """Internal: load users from disk and freeze as a tuple.

    Using a tuple prevents accidental mutation of the cached object.
    """
    logger.info("Loading users from %s", USERS_JSON)
    with open(USERS_JSON, "r", encoding="utf-8") as fh:
        users: list[dict[str, Any]] = json.load(fh)
    logger.info("Loaded %d users", len(users))
    return tuple(users)


def load_users() -> list[dict[str, Any]]:
    """Return a fresh list copy of all users (safe to mutate)."""
    return [copy.copy(u) for u in _load_users_raw()]


def load_users_frozen() -> tuple[dict[str, Any], ...]:
    """Return the cached tuple directly (fast, read-only access)."""
    return _load_users_raw()


@lru_cache(maxsize=1)
def _load_projects_raw() -> tuple[dict[str, Any], ...]:
    """Internal: load projects from disk and freeze as a tuple."""
    logger.info("Loading projects from %s", PROJECTS_JSON)
    with open(PROJECTS_JSON, "r", encoding="utf-8") as fh:
        projects: list[dict[str, Any]] = json.load(fh)
    logger.info("Loaded %d projects", len(projects))
    return tuple(projects)


def load_projects() -> list[dict[str, Any]]:
    """Return a fresh list copy of all projects."""
    return [copy.copy(p) for p in _load_projects_raw()]


def load_projects_frozen() -> tuple[dict[str, Any], ...]:
    """Return the cached tuple directly (fast, read-only access)."""
    return _load_projects_raw()


# ── Index helpers ──────────────────────────────────────────────────

@lru_cache(maxsize=1)
def build_user_index() -> dict[int, int]:
    """Return a dict mapping user_id → index in the users list.

    Cached for the lifetime of the data.  O(1) look-up instead of
    O(N) linear scan every time.
    """
    return {u["id"]: idx for idx, u in enumerate(_load_users_raw())}


def get_user_by_id(user_id: int) -> dict[str, Any] | None:
    """Retrieve a single user by their integer ID.

    Uses the index map for O(1) look-up.
    """
    idx = build_user_index().get(user_id)
    if idx is None:
        return None
    return dict(_load_users_raw()[idx])  # shallow copy


def invalidate_caches() -> None:
    """Clear all cached data — useful after a data refresh."""
    _load_users_raw.cache_clear()
    _load_projects_raw.cache_clear()
    build_user_index.cache_clear()

    # Also invalidate the embedding cache.
    from app.services.matching.vectorizer import EmbeddingCache
    EmbeddingCache.invalidate()

    logger.info("All data & embedding caches invalidated")
