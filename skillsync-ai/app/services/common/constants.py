"""Shared constants used across services."""

from __future__ import annotations

# ── Experience-level hierarchy (used for level-match scoring) ──────
LEVEL_ORDER: dict[str, int] = {
    "Beginner": 1,
    "Intermediate": 2,
    "Advanced": 3,
}

# Maximum value a level can take — used to normalise level distance.
MAX_LEVEL_DISTANCE: int = max(LEVEL_ORDER.values()) - min(LEVEL_ORDER.values())

# ── Skill → suggested project mapping (fallback when project DB is
#    thin or the user's skills don't overlap enough) ─────────────────
SKILL_PROJECT_MAP: dict[str, list[str]] = {
    "React": ["Portfolio Website", "Todo App", "Dashboard UI"],
    "JavaScript": ["Browser Extension", "Quiz Game", "Chat Widget"],
    "Python": ["CLI Tool", "Web Scraper", "REST API"],
    "Machine Learning": ["Prediction System", "Chatbot", "Recommender"],
    "Node.js": ["REST API Server", "Real-time Chat", "Task Queue"],
    "Django": ["Blog Platform", "E-commerce Backend", "CMS"],
    "FastAPI": ["Microservice", "ML API", "Webhook Relay"],
    "Flutter": ["Expense Tracker", "Weather App", "Notes App"],
    "Java": ["Inventory System", "Banking App", "Scheduler"],
    "TypeScript": ["Component Library", "Form Builder", "CLI Tool"],
    "TensorFlow": ["Image Classifier", "Style Transfer", "Object Detector"],
    "Deep Learning": ["GAN Art Generator", "Speech Recognition", "Text Summariser"],
    "Docker": ["CI/CD Pipeline", "Container Orchestrator", "Dev Environment"],
    "SQL": ["Analytics Dashboard", "Reporting Tool", "Data Warehouse"],
    "GraphQL": ["Blog API", "E-commerce API", "Social Feed"],
    "Vue.js": ["Admin Panel", "Portfolio Site", "Landing Page"],
    "CSS": ["Design System", "Animation Library", "Theme Builder"],
    "MongoDB": ["User Directory", "Content Store", "Event Logger"],
}
