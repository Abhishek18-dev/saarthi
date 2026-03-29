"""Hybrid Recommender — blends multiple signals into a single score.

Scoring formula
---------------
    final = (skill_sim * 0.50)
          + (level_match * 0.20)
          + (goal_match * 0.10)
          + (activity * 0.20)

Cold-start handling
-------------------
Users who joined within ``settings.cold_start_days`` have sparse
activity data.  For these users we fall back to *trending* — the most
active users on the platform — so the new user still sees useful
recommendations on day one.
"""

from __future__ import annotations

from typing import Any

import numpy as np

from app.config import settings
from app.core.logger import logger
from app.services.common.constants import LEVEL_ORDER, MAX_LEVEL_DISTANCE
from app.services.common.utils import load_users, get_user_by_id
from app.services.matching.vectorizer import embed_users
from app.services.matching.similarity import compute_similarity_matrix


# ── Public API ──────────────────────────────────────────────────────

def get_recommendations(
    user_id: int,
    page: int = 1,
    limit: int = 10,
) -> list[dict[str, Any]]:
    """Return a paginated list of recommended people for *user_id*.

    For cold-start users the list is replaced by *trending* users.
    """
    limit = min(limit, settings.max_limit)
    target = get_user_by_id(user_id)
    if target is None:
        raise ValueError(f"User with id={user_id} not found")

    # Cold-start detection.
    if target.get("joined_days_ago", 0) <= settings.cold_start_days:
        logger.info("Cold-start detected for user %d — returning trending", user_id)
        return _trending_users(user_id, page, limit)

    users = load_users()

    # 1. Semantic similarity scores.
    embeddings = embed_users(users)
    sim_matrix = compute_similarity_matrix(embeddings)
    user_idx = next(i for i, u in enumerate(users) if u["id"] == user_id)

    scored: list[tuple[dict[str, Any], float]] = []
    for idx, other in enumerate(users):
        if other["id"] == user_id:
            continue

        skill_sim = float(sim_matrix[user_idx][idx])
        level_score = _level_match_score(target, other)
        goal_score = _goal_match_score(target, other)
        activity_score = _activity_score(other)

        final = (
            skill_sim * settings.weight_skill_similarity
            + level_score * settings.weight_level_match
            + goal_score * settings.weight_goal_match
            + activity_score * settings.weight_activity
        )
        scored.append((other, final))

    # Sort descending by final score.
    scored.sort(key=lambda x: x[1], reverse=True)

    # Paginate.
    start = (page - 1) * limit
    end = start + limit
    page_slice = scored[start:end]

    results: list[dict[str, Any]] = []
    for user, score in page_slice:
        results.append(
            {
                "user_id": user["id"],
                "name": user.get("name", f"User {user['id']}"),
                "skills": user.get("skills", []),
                "level": user.get("level", "Unknown"),
                "goal": user.get("goal", "General"),
                "recommendation_score": round(score, 4),
                "breakdown": {
                    "skill_similarity": round(
                        float(sim_matrix[user_idx][
                            next(j for j, u in enumerate(users) if u["id"] == user["id"])
                        ]) * settings.weight_skill_similarity, 4
                    ),
                    "level_match": round(
                        _level_match_score(target, user) * settings.weight_level_match, 4
                    ),
                    "goal_match": round(
                        _goal_match_score(target, user) * settings.weight_goal_match, 4
                    ),
                    "activity": round(
                        _activity_score(user) * settings.weight_activity, 4
                    ),
                },
            }
        )

    logger.info(
        "Recommendations for user %d — page %d, showing %d results",
        user_id,
        page,
        len(results),
    )
    return results


# ── Scoring helpers ─────────────────────────────────────────────────

def _level_match_score(target: dict, other: dict) -> float:
    """Score how well experience levels align (0..1).

    Identical levels → 1.0; maximum distance → 0.0.
    """
    t_level = LEVEL_ORDER.get(target.get("level", ""), 1)
    o_level = LEVEL_ORDER.get(other.get("level", ""), 1)
    if MAX_LEVEL_DISTANCE == 0:
        return 1.0
    distance = abs(t_level - o_level)
    return 1.0 - (distance / MAX_LEVEL_DISTANCE)


def _goal_match_score(target: dict, other: dict) -> float:
    """Binary match — 1.0 if goals are identical, else 0.3."""
    return 1.0 if target.get("goal") == other.get("goal") else 0.3


def _activity_score(user: dict) -> float:
    """Mock activity signal normalised to [0, 1].

    Uses ``days_active``, ``contributions``, and recency.
    """
    activity = user.get("activity", {})
    days_active = activity.get("days_active", 0)
    contributions = activity.get("contributions", 0)
    last_active = activity.get("last_active_days_ago", 30)

    # Recency boost: active today → 1.0, active 30+ days ago → ~0.0
    recency = max(0.0, 1.0 - (last_active / 30.0))

    # Normalise raw counts (soft cap at 100).
    activity_raw = min((days_active + contributions) / 100.0, 1.0)

    return 0.6 * activity_raw + 0.4 * recency


def _trending_users(
    exclude_id: int,
    page: int,
    limit: int,
) -> list[dict[str, Any]]:
    """Return the most active users as a cold-start fallback."""
    users = load_users()
    others = [u for u in users if u["id"] != exclude_id]

    # Sort by activity score descending.
    others.sort(key=lambda u: _activity_score(u), reverse=True)

    start = (page - 1) * limit
    end = start + limit

    return [
        {
            "user_id": u["id"],
            "name": u.get("name", f"User {u['id']}"),
            "skills": u.get("skills", []),
            "level": u.get("level", "Unknown"),
            "goal": u.get("goal", "General"),
            "recommendation_score": round(_activity_score(u), 4),
            "trending": True,
        }
        for u in others[start:end]
    ]
