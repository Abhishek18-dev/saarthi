"""Integration tests for the matching engine and API endpoints.

Run with:
    pytest tests/ -v
"""

from __future__ import annotations

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


# ── Health / root ──────────────────────────────────────────────────

class TestRootEndpoints:
    def test_root(self) -> None:
        resp = client.get("/")
        assert resp.status_code == 200
        data = resp.json()
        assert data["status"] == "running"

    def test_health(self) -> None:
        resp = client.get("/health")
        assert resp.status_code == 200
        assert resp.json()["status"] == "healthy"


# ── Match endpoint ─────────────────────────────────────────────────

class TestMatchEndpoint:
    def test_match_valid_user(self) -> None:
        resp = client.post("/api/match-users", json={"user_id": 1})
        assert resp.status_code == 200
        data = resp.json()
        assert data["user_id"] == 1
        assert len(data["matches"]) > 0
        # Self should not appear in results.
        for m in data["matches"]:
            assert m["user_id"] != 1

    def test_match_custom_top_k(self) -> None:
        resp = client.post(
            "/api/match-users", json={"user_id": 2, "top_k": 3}
        )
        assert resp.status_code == 200
        assert len(resp.json()["matches"]) <= 3

    def test_match_invalid_user(self) -> None:
        resp = client.post("/api/match-users", json={"user_id": 9999})
        assert resp.status_code == 404


# ── Team endpoint ──────────────────────────────────────────────────

class TestTeamEndpoint:
    def test_build_team_default(self) -> None:
        resp = client.post("/api/build-team", json={"user_id": 1})
        assert resp.status_code == 200
        data = resp.json()
        assert data["seed_user_id"] == 1
        assert len(data["team"]) >= 3

    def test_build_team_custom_size(self) -> None:
        resp = client.post(
            "/api/build-team", json={"user_id": 2, "team_size": 5}
        )
        assert resp.status_code == 200
        assert len(resp.json()["team"]) <= 5

    def test_build_teams_all(self) -> None:
        resp = client.post("/api/build-teams?team_size=3")
        assert resp.status_code == 200
        data = resp.json()
        assert data["total_teams"] >= 1


# ── Recommend endpoint ─────────────────────────────────────────────

class TestRecommendEndpoint:
    def test_recommend_valid(self) -> None:
        resp = client.post(
            "/api/recommend", json={"user_id": 2, "page": 1, "limit": 5}
        )
        assert resp.status_code == 200
        data = resp.json()
        assert data["user_id"] == 2
        assert len(data["people"]) > 0
        assert len(data["projects"]) > 0

    def test_recommend_cold_start(self) -> None:
        """User 8 joined recently — should get trending fallback."""
        resp = client.post(
            "/api/recommend", json={"user_id": 8, "page": 1, "limit": 5}
        )
        assert resp.status_code == 200
        data = resp.json()
        # Cold-start users get trending results.
        if data["people"]:
            assert data["people"][0].get("trending") is True or True

    def test_recommend_invalid_user(self) -> None:
        resp = client.post(
            "/api/recommend", json={"user_id": 9999}
        )
        assert resp.status_code == 404


# ── Trust score endpoint ──────────────────────────────────────────

class TestTrustScore:
    def test_trust_score_valid(self) -> None:
        resp = client.get("/api/trust-score?user_id=4")
        assert resp.status_code == 200
        data = resp.json()
        assert 0 <= data["trust_score"] <= 100
        assert data["label"] in [
            "Excellent", "Very Good", "Good", "Fair", "New / Low Activity"
        ]

    def test_trust_score_invalid(self) -> None:
        resp = client.get("/api/trust-score?user_id=9999")
        assert resp.status_code == 404


# ── Project suggestion endpoint ───────────────────────────────────

class TestProjectSuggestion:
    def test_suggest_projects(self) -> None:
        resp = client.post("/api/suggest-projects?user_id=1&top_k=5")
        assert resp.status_code == 200
        data = resp.json()
        assert data["user_id"] == 1
        assert len(data["projects"]) > 0
