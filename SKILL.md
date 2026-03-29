---
name: industry-ready-ai-ml-coding
summary: Produce production-grade AI/ML code with strong engineering standards, reproducibility, testing, and deployment readiness.
---

# Industry-Ready AI/ML Coding Skill

Use this skill when asked to design, implement, review, or improve AI/ML systems intended for real-world production use.

## What This Skill Produces

- Clean, modular, maintainable AI/ML code
- Reproducible training and evaluation pipelines
- Strong data validation and leakage prevention
- Clear metrics, experiment tracking hooks, and error analysis
- Deployment-ready inference interfaces with observability and safety checks
- Documentation and tests that support handoff and long-term maintenance

## Inputs to Collect First

Collect and confirm these before coding. If missing, state assumptions explicitly.

1. Business objective and success metric
2. Problem type: classification, regression, ranking, retrieval, NLP, CV, etc.
3. Data contract: schema, volume, frequency, quality expectations, PII/security constraints
4. Runtime constraints: latency, throughput, memory/cost budget, hardware target
5. Deployment environment: batch, streaming, API, edge, offline
6. Governance requirements: explainability, fairness, compliance, auditability

## Workflow

### 1. Scope and Acceptance Criteria

- Translate request into measurable requirements.
- Define done criteria: model quality thresholds, latency limits, reliability targets.
- List explicit non-goals to avoid overbuilding.

Completion checks:

- Success metrics are measurable and testable.
- Assumptions and risks are documented.

### 2. Architecture and Project Structure

- Propose a minimal but scalable architecture.
- Split code into clear modules (example):
  - `data/` for ingestion and validation
  - `features/` for transformations
  - `models/` for model logic
  - `training/` for train/eval loops
  - `inference/` for serving path
  - `tests/` for unit/integration checks
- Keep interfaces stable via typed inputs/outputs.

Completion checks:

- Boundaries between data, modeling, and serving are clear.
- Components are independently testable.

### 3. Data Quality and Validation

- Validate schema, nullability, ranges, duplicates, drift-sensitive fields.
- Add fail-fast checks for corrupt or missing data.
- Guard against target leakage and split contamination.
- Use deterministic split strategy with fixed random seeds.

Completion checks:

- Data validation runs before training.
- Leakage checks are explicit.

### 4. Baseline First, Then Increment

- Build a simple, strong baseline before complex models.
- Compare improvements against baseline with the same data split and metrics.
- Use ablation-friendly design so each change is measurable.

Decision points:

- If baseline underperforms badly, inspect data and labeling before model complexity.
- If metric improves but latency/cost violates constraints, optimize or roll back.

Completion checks:

- Baseline metric and final metric are both reported.
- Incremental gains are attributable to specific changes.

### 5. Training and Reproducibility

- Pin dependency versions.
- Set and log seeds for deterministic behavior when possible.
- Capture config in one place (YAML or structured config module).
- Save artifacts with metadata: model version, data version, feature version, metric snapshot.

Completion checks:

- Another engineer can reproduce core training results.
- Artifacts are traceable to code and config.

### 6. Evaluation, Error Analysis, and Robustness

- Report appropriate metrics for the problem (for example: AUC/F1/PR, MAE/RMSE, NDCG).
- Evaluate on stratified slices and edge cases.
- Include confusion/error buckets and representative failure examples.
- Add robustness checks where relevant: perturbation, missing features, class imbalance stress.

Completion checks:

- Performance is validated on both aggregate and critical slices.
- Known failure modes are documented with mitigations.

### 7. Inference and Deployment Readiness

- Separate training-time and inference-time code paths cleanly.
- Enforce input schema at inference boundary.
- Add predictable error handling and meaningful responses.
- Include observability hooks: request counts, latency, model/version tags, error rates.

Decision points:

- If online latency is strict, prefer lighter model or optimize serving path.
- If explainability is mandatory, select model/techniques that support explanations.

Completion checks:

- Inference path is deterministic and validated.
- Monitoring signals are defined.

### 8. Testing Strategy

- Unit tests: feature transforms, preprocessing logic, utility functions.
- Integration tests: training pipeline, inference endpoint, artifact loading.
- Regression tests: ensure no silent metric degradation.
- Data contract tests: schema and critical constraints.

Completion checks:

- Core modules have automated tests.
- CI-ready test commands are documented.

### 9. Security, Privacy, and Compliance

- Avoid hardcoded secrets.
- Redact sensitive fields from logs.
- Minimize data retention and follow least-privilege access patterns.
- Respect domain-specific compliance requirements.

Completion checks:

- Sensitive data handling is explicit.
- Logging and storage follow policy constraints.

### 10. Documentation and Handoff

- Provide concise README with:
  - setup and run steps
  - training and evaluation commands
  - inference usage examples
  - model limitations and operational playbook
- Add upgrade notes for retraining and rollback process.

Completion checks:

- A new engineer can run, evaluate, and serve with docs only.

## Output Style Requirements for the Assistant

When using this skill, responses should:

1. Start with a concrete implementation plan
2. Produce code that is modular, typed when applicable, and testable
3. Include tests and usage examples with each non-trivial component
4. State assumptions and trade-offs clearly
5. Highlight risks, failure modes, and mitigation steps
6. Avoid toy shortcuts unless explicitly requested

## Quality Gate (Must Pass Before Marking Complete)

A solution is considered complete only if all are true:

1. Functional correctness: code runs and meets task requirements
2. Reproducibility: config/dependencies/seeds are explicit
3. Evaluation rigor: appropriate metrics + slice/error analysis
4. Production readiness: inference validation + observability basics
5. Maintainability: clear structure, docs, and tests

## Example Prompts This Skill Should Handle

- "Build a production-grade churn prediction pipeline with training, evaluation, and FastAPI inference service."
- "Refactor this notebook-style fraud model into a testable Python package with CI-ready checks."
- "Design an ML retraining workflow with data validation, model versioning, and rollback strategy."
- "Improve this recommendation model codebase for reliability, monitoring, and deployment safety."

## Anti-Patterns to Avoid

- Mixing exploratory notebook code with production serving logic
- Reporting only one metric without segment analysis
- Ignoring data leakage and split hygiene
- Overfitting to benchmark without operational constraints
- Shipping without tests, docs, or observability
