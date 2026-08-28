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
| `DATABASE_URL` | PostgreSQL connection string with pgvector | `postgres://localhost:5432/moonwitness` |
| `JWT_SECRET` | Secret key for signing and verifying tokens | `your-secret-key` |
| `API_PORT` | Port for the HTTP / SSE API | `4000` |
| `BOOTSTRAP_ADMIN_EMAIL` | Superuser bootstrap email | `operator@moonwitness.org` |

---

## 🧪 Verification
```bash
pnpm --filter api typecheck
```
