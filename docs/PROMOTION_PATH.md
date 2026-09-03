# MoonWitness Promotion Path

> Canonical promotion strategy for all feature, integration, database, and release work.

## Branch Architecture

```text
feature/*  ──PR──▶  dev  ──PR──▶  main  ──tag──▶  release
     │                 │                │
     │                 │                └── Production release branch
     │                 └── Integration and certification branch
     └── Ephemeral feature/fix work
```

| Branch | Purpose | CI |
|---|---|---|
| `feature/*` | Feature development and fixes | Foundation CI |
| `dev` | Integration | Foundation CI + PostgreSQL certification when applicable |
| `main` | Production candidate | Foundation CI + PostgreSQL certification + release-on-tag |

## Stage 1: Feature → Dev

Requirements:

- Foundation CI is green for the exact feature SHA.
- Audit, Lint, Typecheck, Test, and Build all pass.
- Required review is approved.
- Branch is up to date and conflict free.

Foundation CI uses `CI_RUNNER` when configured and otherwise defaults to `ubuntu-latest`, so promotion does not silently depend on one offline self-hosted machine.

## Stage 2: Dev → Main

Requirements:

- Stage 1 requirements remain green on the exact `dev` candidate.
- Integration/regression checks pass.
- Production PostgreSQL Certification passes for database, API-runtime, migration, or deployment-sensitive changes.
- Changelog/versioning are ready where applicable.

The certification path proves:

```text
fresh PostgreSQL 18
-> exact-candidate apps/api/Dockerfile
-> db:install
-> db:verify
-> Witness graph certification
-> backup/restore
-> API boot
-> /health/ready
-> quality/security regressions
```

## Stage 3: Main → Release

Trigger: semantic version tag (`v*.*.*` or prerelease variant).

Requirements:

- Stage 2 requirements are satisfied.
- Release Verify passes build, typecheck, and tests.
- Publish remains dry-run until intentional publishing is enabled.
- Draft GitHub Release is generated for review.

## CI/CD Workflows

### Foundation CI — `.github/workflows/foundation-ci.yml`

Triggers on pushes, pull requests, and manual dispatch. Every validation job is blocking.

### Production PostgreSQL Certification — `.github/workflows/witness-postgres-certification.yml`

Triggers on pull requests to `dev`/`main`, pushes to `dev`/`main`, weekly schedule, and manual dispatch. This is the authoritative clean-database and production API certification gate.

### Release — `.github/workflows/release.yml`

Triggers on release tags. Runner selection follows the same `CI_RUNNER` override with `ubuntu-latest` fallback.

The former duplicate `.github/workflows/ci.yml` is intentionally removed. Foundation CI is the single fast validation authority, preventing duplicate jobs and ambiguous green statuses.

## Deployment Promotion

Production deployment must use the canonical scripts:

```text
scripts/deploy-prod.sh
scripts/deploy-prod.ps1
```

For Docker Compose they validate configuration, build the deployable artifacts, start PostgreSQL/Redis, execute `db:install`, execute `db:verify`, then start API and portals. The API container is built from the same `apps/api/Dockerfile` used by PostgreSQL certification.

## Emergency Hotfix

```text
main -> hotfix/* -> PR -> main -> tag
                  |
                  -> PR -> dev
```

Emergency fixes remain minimal, reviewed, tested, released, and reconciled back into `dev` and active work.

## Branch Protection Target

For both `dev` and `main`:

- require pull request;
- require review;
- require branch up to date where practical;
- require Foundation CI checks: `Constitutional & UI Audit`, `Lint`, `Typecheck`, `Test`, `Build`;
- block force pushes and branch deletion.

For `dev → main`, additionally require `Production PostgreSQL 18 Certification` when repository settings permit required checks.
