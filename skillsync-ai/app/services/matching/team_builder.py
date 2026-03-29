"""Team Builder — form balanced teams using similarity clustering.

Strategy
--------
1. Embed all users.
2. Pick a seed user (the requester).
3. Greedily add the most similar users until the team reaches
   the desired size.
4. Optionally build multiple teams by repeating the process with
   remaining users.

This is intentionally simple — a K-Means or spectral-clustering
approach could replace it for larger pools, but greedy selection
is fast, deterministic, and easy to explain in a hackathon demo.
"""

from __future__ import annotations

from typing import Any

import numpy as np

from app.config import settings
from app.core.logger import logger
from app.services.common.utils import load_users, get_user_by_id
from app.services.matching.vectorizer import embed_users
from app.services.matching.similarity import compute_similarity_matrix


def build_team(
    user_id: int,
    team_size: int | None = None,
) -> list[dict[str, Any]]:
    """Build a single team around *user_id*.

    Parameters
    ----------
    user_id : int
        Seed user for the team.
    team_size : int, optional
        Desired team size (clamped between ``team_min_size`` and
        ``team_max_size`` from settings).

    Returns
    -------
    list[dict]
        Ordered list of team members starting with the seed user.
    """
    if team_size is None:
        team_size = settings.team_min_size
    team_size = max(settings.team_min_size, min(team_size, settings.team_max_size))

    users = load_users()
    target = get_user_by_id(user_id)
    if target is None:
        raise ValueError(f"User with id={user_id} not found")

    # Find seed index.
    seed_index: int = next(
        i for i, u in enumerate(users) if u["id"] == user_id
    )

    logger.info(
        "Building team of %d around user %d (%s)",
        team_size,
        user_id,
        target.get("name", ""),
    )

    embeddings = embed_users(users)
    sim_matrix = compute_similarity_matrix(embeddings)

    # Greedy team construction.
    selected_indices: list[int] = [seed_index]
    remaining = set(range(len(users))) - {seed_index}

    while len(selected_indices) < team_size and remaining:
        # Score each remaining user by average similarity to selected.
        best_idx = -1
        best_score = -1.0
        for idx in remaining:
            avg_sim = float(
                np.mean([sim_matrix[idx][s] for s in selected_indices])
            )
            if avg_sim > best_score:
                best_score = avg_sim
                best_idx = idx
        if best_idx == -1:
            break
        selected_indices.append(best_idx)
        remaining.discard(best_idx)

    team: list[dict[str, Any]] = []
    for idx in selected_indices:
        member = users[idx]
        team.append(
            {
                "user_id": member["id"],
                "name": member.get("name", f"User {member['id']}"),
                "skills": member.get("skills", []),
                "level": member.get("level", "Unknown"),
                "role": _suggest_role(member),
            }
        )

    logger.info("Team assembled: %s", [m["name"] for m in team])
    return team


def build_multiple_teams(
    team_size: int | None = None,
) -> list[list[dict[str, Any]]]:
    """Partition all users into balanced teams.

    Iterates through users that haven't been assigned yet, using each
    unassigned user as the next seed.
    """
    if team_size is None:
        team_size = settings.team_min_size
    team_size = max(settings.team_min_size, min(team_size, settings.team_max_size))

    users = load_users()
    embeddings = embed_users(users)
    sim_matrix = compute_similarity_matrix(embeddings)

    assigned: set[int] = set()
    teams: list[list[dict[str, Any]]] = []

    for seed_idx in range(len(users)):
        if seed_idx in assigned:
            continue

        current_team_indices: list[int] = [seed_idx]
        assigned.add(seed_idx)
        remaining = set(range(len(users))) - assigned

        while len(current_team_indices) < team_size and remaining:
            best_idx = -1
            best_score = -1.0
            for idx in remaining:
                avg_sim = float(
                    np.mean([sim_matrix[idx][s] for s in current_team_indices])
                )
                if avg_sim > best_score:
                    best_score = avg_sim
                    best_idx = idx
            if best_idx == -1:
                break
            current_team_indices.append(best_idx)
            assigned.add(best_idx)
            remaining.discard(best_idx)

        team: list[dict[str, Any]] = []
        for idx in current_team_indices:
            member = users[idx]
            team.append(
                {
                    "user_id": member["id"],
                    "name": member.get("name", f"User {member['id']}"),
                    "skills": member.get("skills", []),
                    "level": member.get("level", "Unknown"),
                    "role": _suggest_role(member),
                }
            )
        teams.append(team)

    logger.info("Built %d teams from %d users", len(teams), len(users))
    return teams


# ── Helpers ─────────────────────────────────────────────────────────

def _suggest_role(user: dict[str, Any]) -> str:
    """Heuristically assign a team role based on profile attributes."""
    level = user.get("level", "Beginner")
    goal = user.get("goal", "")

    if level == "Advanced" or goal == "Mentor":
        return "Team Lead"
    if goal == "Research":
        return "Researcher"
    if any(
        s.lower() in ("react", "vue.js", "flutter", "css", "tailwind css")
        for s in user.get("skills", [])
    ):
        return "Frontend / UI"
    if any(
        s.lower() in ("python", "django", "fastapi", "node.js", "java", "spring boot")
        for s in user.get("skills", [])
    ):
        return "Backend / API"
    return "Contributor"
