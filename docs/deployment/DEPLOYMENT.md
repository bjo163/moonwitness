# MoonWitness Production Deployment

## Overview

MoonWitness uses a canonical deployment runner that executes the complete production lifecycle.

## Prerequisites

- Docker and Docker Compose (Linux/Windows)
- Node.js 22 (enforced via CI)
- PostgreSQL 18 + pgvector 0.8.7 (via Docker image)
- Redis 7
- .env.production with all required secrets

## Canonical Deployment Commands

### Linux
\ash
./scripts/deploy-prod.sh
\\n
### Windows / PowerShell
\powershell
./scripts/deploy-prod.ps1
\\n
## Deployment Sequence

The runner performs:

1. Pull exact production branch
2. Frozen dependency install (pnpm install --frozen-lockfile)
3. Typecheck + Tests
4. Build
5. Production config validation
6. Prod-check (ode packages/cli/mw.mjs prod-check)
7. Build deployable containers
8. Start PostgreSQL + Redis
9. Database install (pnpm --filter=api db:install)
10. Database verify (pnpm --filter=api db:verify)
11. Start API
12. Wait for API health dependency
13. Start Command Center + Web

## Pre-Flight Checks

\ash
pnpm release:check
pnpm certify:knowledge
pnpm audit:ci
pnpm turbo build
node packages/cli/mw.mjs prod-check
\

## Health Checks

| Service | Endpoint | Expected |
|---------|----------|----------|
| API liveness | GET /livez |  |
| API readiness | GET /health/ready |  with DB ready |
| Database status | GET /db/status | connected |
| Corpus health | GET /api/witness/corpus/health | healthy |

## Database Lifecycle

\ash
pnpm --filter=api db:install
pnpm --filter=api db:verify
\\n
Production application startup is **not** a substitute for migrations.

## Rollback Discipline

Application rollback and database rollback are separate decisions.

1. Identify exact deployed Git SHA/tag and database state
2. Preserve database backup before schema-sensitive rollout
3. Prefer forward-compatible application fixes
4. Restore only from verified backup/restore procedure
5. Re-run readiness and portal smoke checks after recovery

## Corpus Promotion

Corpus release changes remain independently verifiable:

1. Verify release/checksum and schema compatibility
2. Ingest snapshot/provenance state
3. Refresh canonical search projection atomically
4. Verify corpus status and health endpoints
