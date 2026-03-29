"""Common utility functions used by multiple services.

Handles JSON-based data loading/caching so services never need to
worry about file I/O directly.
"""

from __future__ import annotations

import json
from functools import lru_cache
from typing import Any

from app.config import USERS_JSON, PROJECTS_JSON
from app.core.logger import logger


# ── Data loaders ────────────────────────────────────────────────────

@lru_cache(maxsize=1)
def load_users() -> list[dict[str, Any]]:
    """Load and cache the mock users database from JSON.

    The result is cached for the lifetime of the process so repeated
    calls are essentially free.
    """
    logger.info("Loading users from %s", USERS_JSON)
    with open(USERS_JSON, "r", encoding="utf-8") as fh:
        users: list[dict[str, Any]] = json.load(fh)
    logger.info("Loaded %d users", len(users))
    return users


@lru_cache(maxsize=1)
def load_projects() -> list[dict[str, Any]]:
    """Load and cache the mock projects database from JSON."""
    logger.info("Loading projects from %s", PROJECTS_JSON)
    with open(PROJECTS_JSON, "r", encoding="utf-8") as fh:
        projects: list[dict[str, Any]] = json.load(fh)
    logger.info("Loaded %d projects", len(projects))
    return projects


def get_user_by_id(user_id: int) -> dict[str, Any] | None:
    """Retrieve a single user by their integer ID.

    Returns *None* when no user with the given ID exists.
    """
    for user in load_users():
        if user["id"] == user_id:
            return user
    return None


def invalidate_caches() -> None:
    """Clear all cached data — useful after a data refresh."""
    load_users.cache_clear()
    load_projects.cache_clear()
    logger.info("Data caches invalidated")
