# PostgreSQL 18 + pgvector Certification

## Overview

The PostgreSQL certification validates a clean database lifecycle and the exact same pps/api/Dockerfile artifact used by production Compose.

## Certification Workflow

.github/workflows/witness-postgres-certification.yml runs on:
- Pull requests to dev/main\n- Pushes to dev/main\n- Weekly schedule
- Manual dispatch

## Certification Steps

1. Fresh PostgreSQL 18 container (pgvector/pgvector:0.8.7-pg18)
2. Build exact-candidate pps/api/Dockerfile\n3. db:install — schema migrations and seed data
4. db:verify — schema integrity and data validation
5. Witness graph certification
6. Backup/restore smoke test
7. API boot
8. /health/ready readiness check
9. Quality/security regression checks

## Required for Promotion

For dev → main, require Production PostgreSQL 18 Certification for:
- Database changes
- API runtime changes
- Migration changes
- Deployment-sensitive changes

## Local Certification

\ash
pnpm certify:postgres
\\n
This runs the same certification steps locally against a fresh PostgreSQL container.
