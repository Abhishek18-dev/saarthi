# SkillSync AI 🧠

> AI-powered skill matching & recommendation platform built with FastAPI,
> SentenceTransformers, and scikit-learn.  Runs on a normal laptop — no GPU required.

---

## 🚀 Quick Start

```bash
# 1. Create virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS / Linux

# 2. Install dependencies
pip install -r requirements.txt

# 3. Run the server
uvicorn app.main:app --reload

# 4. Open the docs
#    http://127.0.0.1:8000/docs
```

> **Note:** The first startup downloads the `all-MiniLM-L6-v2` model (~80 MB).
> Subsequent starts are instant.

---

## 📡 API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/` | Root — API status |
| `GET` | `/health` | Health check |
| `POST` | `/api/match-users` | Find semantically similar users |
| `POST` | `/api/build-team` | Build a team around a seed user |
| `POST` | `/api/build-teams` | Auto-partition users into teams |
| `POST` | `/api/recommend` | Hybrid people + project recommendations |
| `GET` | `/api/trust-score` | Calculate user trust score |
| `POST` | `/api/suggest-projects` | Project suggestions by skill match |

---

## 🧪 Example Requests

### Match Users
```bash
curl -X POST http://127.0.0.1:8000/api/match-users \
  -H "Content-Type: application/json" \
  -d '{"user_id": 1, "top_k": 5}'
```

### Get Recommendations
```bash
curl -X POST http://127.0.0.1:8000/api/recommend \
  -H "Content-Type: application/json" \
  -d '{"user_id": 2, "page": 1, "limit": 5}'
```

### Build Team
```bash
curl -X POST http://127.0.0.1:8000/api/build-team \
  -H "Content-Type: application/json" \
  -d '{"user_id": 1, "team_size": 4}'
```

### Trust Score
```bash
curl http://127.0.0.1:8000/api/trust-score?user_id=4
```

---

## 🏗️ Architecture

```
app/
├── main.py                      # FastAPI entry point + lifespan
├── config.py                    # Centralised settings
├── dependencies.py              # Shared DI helpers
├── api/
│   ├── match_routes.py          # Matching endpoints
│   └── recommend_routes.py      # Recommendation endpoints
├── schemas/
│   ├── user_schema.py           # User profile schema
│   ├── match_schema.py          # Match request/response
│   └── recommend_schema.py      # Recommendation request/response
├── services/
│   ├── matching/
│   │   ├── vectorizer.py        # Profile → embedding (SentenceTransformer)
│   │   ├── similarity.py        # Cosine similarity computation
│   │   ├── matcher.py           # Top-K match orchestrator
│   │   └── team_builder.py      # Greedy team clustering
│   ├── recommendation/
│   │   ├── recommender.py       # Hybrid scoring engine
│   │   ├── project_suggester.py # Jaccard project matching
│   │   └── trust_score.py       # Activity + ratings trust score
│   ├── llm_utils/
│   │   ├── prompt_templates.py  # Ready-to-use LLM prompts
│   │   └── llm_client.py       # Pluggable LLM client
│   └── common/
│       ├── constants.py         # Shared constants & mappings
│       └── utils.py             # Data loading & caching
├── background/
│   └── tasks.py                 # Background processing
├── core/
│   ├── logger.py                # Structured logging
│   └── security.py              # Auth placeholder
└── ml_models/                   # Reserved for custom models
data/
├── users.json                   # Mock user database (10 users)
└── projects.json                # Mock project database (12 projects)
tests/
└── test_matching.py             # Integration test suite
```

---

## ⚙️ Tech Stack

| Component | Technology |
|-----------|-----------|
| Framework | FastAPI |
| Embeddings | SentenceTransformers (`all-MiniLM-L6-v2`) |
| Similarity | scikit-learn (cosine similarity) |
| Vectors | NumPy |
| Validation | Pydantic v2 |
| Database | JSON (mock) |

---

## 🧠 How It Works

### Matching Engine
1. Each user profile is converted to a descriptive text string
2. SentenceTransformer encodes it into a 384-dim dense vector
3. Cosine similarity finds the closest matches
4. Results are ranked and returned

### Recommendation Engine
Hybrid scoring formula:
```
Final Score = (Skill Similarity × 0.50)
            + (Level Match × 0.20)
            + (Goal Match × 0.10)
            + (Activity Weight × 0.20)
```

### Cold Start Handling
New users (< 14 days) automatically receive trending user recommendations
instead of similarity-based ones.

### Team Builder
Greedy similarity-based clustering that picks the most similar available
user at each step, building balanced teams of 3-5 members with
auto-assigned roles.

---

## 🧪 Running Tests

```bash
pip install pytest httpx
pytest tests/ -v
```

---

## 📝 License

MIT
