"""Project Suggester — recommends projects that fit a user's skill set.

Two-pronged strategy:
1. **Database match** — Rank projects in the mock DB by the Jaccard
   overlap between the project's ``required_skills`` and the user's
   ``skills``.
2. **Fallback map** — If the DB yields fewer than *min_results*
   suggestions, pad with entries from the curated
   ``SKILL_PROJECT_MAP`` in constants.
"""

from __future__ import annotations

from typing import Any

from app.core.logger import logger
from app.services.common.constants import SKILL_PROJECT_MAP
from app.services.common.utils import load_projects, get_user_by_id


def suggest_projects(
    user_id: int,
    top_k: int = 5,
    min_results: int = 3,
) -> list[dict[str, Any]]:
    """Return project suggestions tailored to *user_id*.

    Parameters
    ----------
    user_id : int
        Target user.
    top_k : int
        Maximum suggestions to return.
    min_results : int
        Minimum results — if the DB produces fewer, the fallback map
        fills the gap.

    Returns
    -------
    list[dict]
        Each dict has ``title``, ``description``, ``required_skills``,
        ``match_score``, and ``source``.
    """
    user = get_user_by_id(user_id)
    if user is None:
        raise ValueError(f"User with id={user_id} not found")

    user_skills = set(s.lower() for s in user.get("skills", []))
    results: list[dict[str, Any]] = []

    # ── Strategy 1: database projects ──────────────────────────────
    projects = load_projects()
    scored: list[tuple[dict[str, Any], float]] = []
    for proj in projects:
        proj_skills = set(s.lower() for s in proj.get("required_skills", []))
        if not proj_skills:
            continue
        # Jaccard similarity.
        intersection = user_skills & proj_skills
        union = user_skills | proj_skills
        jaccard = len(intersection) / len(union) if union else 0.0
        if jaccard > 0:
            scored.append((proj, jaccard))

    scored.sort(key=lambda x: x[1], reverse=True)

    for proj, score in scored[:top_k]:
        results.append(
            {
                "title": proj["title"],
                "description": proj.get("description", ""),
                "required_skills": proj.get("required_skills", []),
                "difficulty": proj.get("difficulty", "Unknown"),
                "category": proj.get("category", "General"),
                "match_score": round(score, 4),
                "source": "database",
            }
        )

    # ── Strategy 2: fallback map ───────────────────────────────────
    if len(results) < min_results:
        seen_titles = {r["title"].lower() for r in results}
        for skill in user.get("skills", []):
            if len(results) >= top_k:
                break
            ideas = SKILL_PROJECT_MAP.get(skill, [])
            for idea in ideas:
                if idea.lower() not in seen_titles and len(results) < top_k:
                    results.append(
                        {
                            "title": idea,
                            "description": f"Suggested project based on your {skill} skill",
                            "required_skills": [skill],
                            "difficulty": user.get("level", "Beginner"),
                            "category": "Suggested",
                            "match_score": 0.5,
                            "source": "skill_map",
                        }
                    )
                    seen_titles.add(idea.lower())

    logger.info(
        "Suggested %d projects for user %d", len(results), user_id
    )
    return results
