# ◈ apps/api — Backend Transport Engine & Domain Services

```
╔══════════════════════════════════════════════════════════════════════════╗
║  APPLICATION:    apps/api                                                ║
║  SYSTEM VERSION: MoonWitness OS V9.0 (Divine Operating System Matrix)    ║
║  APP VERSION:    9.0.0                                                   ║
║  PORT:           4000 (APP_PORTS.API_BACKEND)                            ║
║  CLASSIFICATION: TIER 6 — BACKEND REST, RPC & SSE TELEMETRY SERVICE      ║
║  STATUS:         ████████████████████████████████ ACTIVE (SOVEREIGN)     ║
╚══════════════════════════════════════════════════════════════════════════╝
```

The primary backend engine and real-time telemetry service for MoonWitness OS, powered by `@moon/server`, `@moon/orm`, and the core domain engines (`@moon/witness`, `@moon/base`, `@moon/mizan`, `@moon/khidra`, `@moon/cab`, `@moon/performance`).

---

## 🚀 Running Locally

```bash
# Start API Service on Port 4000 with hot reload
pnpm --filter api dev

# Full database setup: migrations + canonical seed + demo data
pnpm db:install

# Verify migrations and seed integrity
pnpm db:verify
```

---

## ⚙️ Environment Variables

| Variable | Description | Default |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string; SQLite remains available for local development | `postgres://localhost:5432/moonwitness` |
| `JWT_SECRET` | Secret key for signing and verifying tokens | `your-secret-key` |
| `API_PORT` | Port for the HTTP / SSE API | `4000` |
| `BOOTSTRAP_ADMIN_EMAIL` | Superuser bootstrap email | `operator@moonwitness.org` |
| `EMBEDDING_API_URL` | OpenAI-compatible embeddings endpoint; optional | Unset |
| `EMBEDDING_API_KEY` | Credential for the configured embedding provider; optional | Unset |
| `EMBEDDING_PROVIDER` | Provider identifier recorded in embedding metadata | `openai-compatible` |
| `EMBEDDING_MODEL` | Embedding model identifier | Unset |
| `EMBEDDING_MODEL_VERSION` | Immutable model/version identifier recorded with results | Unset |
| `EMBEDDING_DIMENSIONS` | Expected vector dimension | Unset |
| `EMBEDDING_TEXT_NORMALIZATION_VERSION` | Text preprocessing contract version | `arabic-normalization.v1` |

Canonical lexical search reads the Witness graph. Hybrid/vector search remains
unavailable until a canonical vector index is provisioned and certified; setting
an embedding provider alone does not enable production RAG.

---

## 🧪 Verification
```bash
pnpm --filter api typecheck
```
