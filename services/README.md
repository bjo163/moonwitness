# ◈ MoonWitness Polyglot Services

This directory contains backend microservices, compute engines, and daemon processes written in languages suited for their specialized domain tasks (e.g. Python for astronomical calculations and AI/NLP, Go for lightweight high-performance daemons).

---

## 1. Directory Structure

```text
services/
├── celestial-engine/         # [Python] Ephemeris, Falakiah & Astronomical Trigonometry
│   ├── pyproject.toml
│   ├── README.md
│   ├── src/
│   │   ├── main.py           # Service entrypoint (FastAPI / ASGI)
│   │   └── ephemeris.py      # Moon phase, prayer time, and solar coordinates
│   └── tests/
│       └── test_ephemeris.py
│
└── ai-agent/                 # [Python] Quranic Vector Search & RAG Knowledge Engine
    ├── pyproject.toml
    ├── README.md
    ├── src/
    │   ├── main.py           # Service entrypoint
    │   └── embeddings.py     # Multilingual embeddings & similarity search
    └── tests/
        └── test_agent.py
```

---

## 2. Universal Contract Integration

All services in this directory interact with the primary API (`apps/api`) and Frontends (`apps/web`, `apps/command-center`) via contracts defined in:

```text
contracts/openapi/openapi.json
```

Generate Python Pydantic models from canonical contracts at any time:
```bash
uv run datamodel-codegen --input contracts/openapi/openapi.json --output src/models/contracts.py
```

---

## 3. Tooling & Development Workflow

We use [uv](https://docs.astral.sh/uv/) for ultra-fast, deterministic Python workspace management.

```bash
# Sync dependencies across all python services
uv sync

# Run tests
uv run pytest

# Format and lint
uv run ruff check
uv run ruff format
```
