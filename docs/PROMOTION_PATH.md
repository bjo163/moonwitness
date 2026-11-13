# MoonWitness Promotion Path

> Canonical promotion strategy for all feature, integration, database, and release work.

## Branch Architecture

```text
feature/*  ──PR──▶  dev  ──auto──▶  main  ──auto──▶  release
     │                 │                │
     │                 │                └── Production release branch (auto-promoted)
     │                 └── Integration and certification branch
     └── Ephemeral feature/fix work
```

| Branch | Purpose | CI |
|---|---|---|
| `feature/*` | Feature development and fixes | Foundation CI |
| `dev` | Integration | Foundation CI (single fast gate) |
| `main` | Production candidate | Auto Release (promotes from dev, bumps patch, tags, releases) |

## Stage 1: Feature → Dev

Requirements:

- Foundation CI is green for the exact feature SHA.
- Audit, Lint, Typecheck, Test, and Build all pass.
- Required review is approved.
- Branch is up to date and conflict free.

Foundation CI runs on `ubuntu-latest` (hardcoded) — no runner indirection.

## Stage 2: Dev → Main (Automatic)

Trigger: **Foundation CI completes successfully on `dev` push**.

Requirements:
- Stage 1 requirements remain green on the exact `dev` candidate.
- Integration/regression checks pass (covered by Foundation CI).

The Auto Release workflow (`.github/workflows/release.yml`, triggered by `workflow_run` on Foundation CI success):
1. Promotes `dev` into `main` (`-X theirs` merge, dev wins on conflicts).
2. Bumps root `package.json` patch version with `[skip ci]` commit message.
3. Creates and pushes version tag (e.g., `v0.3.2`).
4. Creates GitHub Release with auto-generated notes.
5. Syncs the version bump back to `dev` (fast-forward, `[skip ci]` prevents re-trigger).

No manual tag creation or PR needed for normal releases.

## Stage 3: Main → Release (Automatic, part of Stage 2)

See Stage 2 — the same Auto Release workflow creates the tag and GitHub Release.

## CI/CD Workflows

### Foundation CI — `.github/workflows/foundation-ci.yml`

Triggers on pushes to `dev`, pull requests to `main`/`dev`, and manual dispatch. Every validation job is blocking. **Single cheap gate** (Audit, Lint, Typecheck, Test, Build + PR report).

Runner: hardcoded `ubuntu-latest`.

### Production PostgreSQL Certification — `.github/workflows/witness-postgres-certification.yml`

**Manual only** (`workflow_dispatch`). Heavy certification (clean PostgreSQL 18, db:install, db:verify, Witness graph, backup/restore, API boot, /health/ready, quality/security regressions) is parked to manual runs per "Thin CI" principle. Run explicitly for database/deployment-sensitive changes.

### Auto Release — `.github/workflows/release.yml`

Triggers on `workflow_run` (Foundation CI completed on `dev`) and manual dispatch. Single job handles promote + bump + tag + release + dev sync. Runner: `ubuntu-latest`.

### Manual Verification — `.github/workflows/manual-verification.yml`

Triggers on manual dispatch only. Python microservices + E2E browser flows (salvaged from old Foundation CI).

## Deployment Promotion

Production deployment must use the canonical scripts:

```text
scripts/deploy-prod.sh
scripts/deploy-prod.ps1
```

For Docker Compose they validate configuration, build the deployable artifacts, start PostgreSQL/Redis, execute `db:install`, execute `db:verify`, then start API and portals. The API container is built from the same `apps/api/Dockerfile` used by PostgreSQL certification.

Production deployment is triggered automatically by the owner's webhook on `main` push (after Auto Release promotes and releases).

## Emergency Hotfix

```text
main -> hotfix/* -> PR -> main -> Auto Release (tag+release) -> dev sync
                  |
                  -> PR -> dev
```

Emergency fixes remain minimal, reviewed, tested, released, and reconciled back into `dev` and active work.

## Branch Protection Target

For both `dev` and `main`:

- No branch protection required for the automatic pipeline (GITHUB_TOKEN pushes to unprotected branches).
- If protection is added later, the Auto Release workflow would need a PAT with `contents: write` to push `main` and trigger the release chain.
