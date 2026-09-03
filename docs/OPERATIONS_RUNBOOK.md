# ◈ MOONWITNESS OS — PRODUCTION OPERATIONS RUNBOOK

## 1. Production Topology

```text
PostgreSQL 18 + Redis 7
        |
        v
MoonWitness API :4000
        |
        +-------------------+
        |                   |
        v                   v
Public Portal :3000    Command Center :3001
        |                   |
        +---------+---------+
                  |
               NGINX/TLS
```

The API production artifact is `apps/api/Dockerfile`. PostgreSQL certification builds that same artifact before release promotion. Web and Command Center use the root portal `Dockerfile`.

## 2. Standard Deployment Procedure

Do not invoke `docker compose up` or `pm2 reload` as the normal production procedure. Use the canonical OS-specific deployment runner so migration/install verification cannot be skipped.

### Linux

```bash
./scripts/deploy-prod.sh
```

### Windows / PowerShell

```powershell
./scripts/deploy-prod.ps1
```

The deployment runner performs:

```text
pull exact production branch
-> frozen dependency install
-> typecheck + tests
-> build
-> production config validation
-> prod-check
-> build deployable containers
-> start PostgreSQL + Redis
-> db:install
-> db:verify
-> start API
-> wait for API health dependency
-> start Command Center + Web
```

For Docker deployments `.env.production` is mandatory. Required secret values remain outside source control.

For PM2 deployments, `DATABASE_URL` and `JWT_SECRET` must already be exported in the production environment; database install and verification run before PM2 reload.

## 3. Pre-Flight Checks

The deploy runner already executes the critical gates. For manual diagnosis:

```bash
pnpm release:check
pnpm certify:knowledge
pnpm audit:ci
pnpm turbo build
node cli/mw.mjs prod-check
```

## 4. Database Lifecycle

Canonical commands:

```bash
pnpm --filter=api db:install
pnpm --filter=api db:verify
```

Production application startup is not a substitute for migrations. A deployment that cannot complete `db:install` and `db:verify` must stop before API/portal promotion.

## 5. Health Checks

| Service | Endpoint | Expected |
|---|---|---|
| API liveness | `GET http://localhost:4000/livez` | `200` |
| API readiness | `GET http://localhost:4000/health/ready` | `200` with DB ready |
| API readiness alias | `GET http://localhost:4000/readyz` | `200` |
| Database status | `GET http://localhost:4000/db/status` | connected |
| Corpus health | `GET http://localhost:4000/api/witness/corpus/health` | healthy |

Docker Compose uses `/health/ready` as the API health check. Web and Command Center depend on API health before startup.

## 6. Upgrade / Rollback Discipline

Application rollback and database rollback are separate decisions.

1. Identify the exact deployed Git SHA/tag and database state.
2. Preserve a database backup before schema-sensitive rollout.
3. Prefer forward-compatible application fixes when migrations are not safely reversible.
4. Restore a database only from a verified backup/restore procedure and only when rollback semantics require it.
5. Re-run readiness and portal smoke checks after recovery.

The PostgreSQL certification workflow includes a backup/restore smoke test for the exact candidate artifact.

## 7. Corpus Promotion

Corpus release changes remain independently verifiable:

1. verify release/checksum and schema compatibility;
2. ingest snapshot/provenance state;
3. refresh canonical search projection atomically;
4. verify corpus status and health endpoints.

## 8. Incident Handling

- Stop promotion immediately on failed migration, verification, readiness, or exact-SHA CI/certification.
- Preserve sanitized diagnostics; never copy secret values into issues or CI comments.
- Record the failing SHA and the exact failed gate.
- Apply fixes through `feature -> dev -> main` unless the documented emergency hotfix flow is required.
