"""Matcher — orchestrates vectorization + similarity to find top
matches for a given user.

This is the primary entry-point other layers call.
"""

from __future__ import annotations

from typing import Any

from app.config import settings
from app.core.logger import logger
from app.services.common.utils import load_users, get_user_by_id
from app.services.matching.vectorizer import embed_users
from app.services.matching.similarity import (
    compute_similarity_matrix,
    get_top_similar,
)


def get_matches(
    user_id: int,
    top_k: int | None = None,
) -> list[dict[str, Any]]:
    """Return the top-K most similar users for *user_id*.

    Parameters
    ----------
    user_id : int
        ID of the requesting user.
    top_k : int, optional
        Number of matches to return.  Falls back to
        ``settings.default_top_k``.

    Returns
    -------
    list[dict]
        Each dict contains ``user_id``, ``name``, ``skills``,
        ``level``, ``goal``, and ``similarity_score``.

    Raises
    ------
    ValueError
        If *user_id* does not exist in the database.
    """
    if top_k is None:
        top_k = settings.default_top_k

    users = load_users()
    target_user = get_user_by_id(user_id)
    if target_user is None:
        raise ValueError(f"User with id={user_id} not found")

    # Determine the index of the target user inside the users list.
    user_index: int | None = None
    for idx, u in enumerate(users):
        if u["id"] == user_id:
            user_index = idx
            break

    if user_index is None:
        raise ValueError(f"User with id={user_id} not found in list")

    logger.info(
        "Computing matches for user %d (%s) — top_k=%d",
        user_id,
        target_user.get("name", "unknown"),
        top_k,
    )

    # 1. Embed all users in one batch for efficiency.
    embeddings = embed_users(users)

    # 2. Build similarity matrix.
    sim_matrix = compute_similarity_matrix(embeddings)

    # 3. Retrieve top-K (excluding self).
    top_indices = get_top_similar(sim_matrix, user_index, top_k=top_k)

    # 4. Package results.
    results: list[dict[str, Any]] = []
    for idx, score in top_indices:
        matched_user = users[idx]
        results.append(
            {
                "user_id": matched_user["id"],
                "name": matched_user.get("name", f"User {matched_user['id']}"),
                "skills": matched_user.get("skills", []),
                "level": matched_user.get("level", "Unknown"),
                "goal": matched_user.get("goal", "General"),
                "similarity_score": round(score, 4),
            }
        )

    logger.info(
        "Returned %d matches for user %d", len(results), user_id
    )
    return results
