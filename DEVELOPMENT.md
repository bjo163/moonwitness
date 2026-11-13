# MoonWitness Development Workflow

Status: **Canonical** for branch, validation, database, and promotion flow.

## Branch model

```text
feature
   |
   v
  dev  ──(auto)──▶  main  ──(auto)──▶  release
```

### `main`

Stable/release branch. Normal development does not happen directly on `main`; it receives changes automatically after integration and verification on `dev` and should remain deployable.

### `dev`

Integration branch. Completed feature work lands here for integration, regression, migration, and cross-addon verification before automatic promotion to `main`.

### `feature`

Active development branch. New features, fixes, refactors, and experiments remain here until their applicable checks and review are complete.

## Promotion flow (Automatic)

```text
feature
  -> test + review + Foundation CI
  -> dev (push)
  -> Foundation CI completes successfully on dev
  -> Auto Release workflow triggers automatically:
     1. promotes dev → main (-X theirs, dev wins)
     2. bumps patch version [skip ci]
     3. creates & pushes version tag (vX.Y.Z)
     4. creates GitHub Release (auto-generated notes)
     5. syncs version bump back to dev (fast-forward, [skip ci])
```

Do not skip `dev` for ordinary work. The automatic pipeline handles the rest.

## Database workflow

Canonical production-safe commands:

```text
pnpm db:install
pnpm --filter=api db:verify
```

`db:install` applies pending migrations, validates canonical seed artifacts, loads required base data, and seeds the Witness graph core. Demo/sample data is separate and is loaded only through the explicit demo paths or flags.

`db:verify` checks migration integrity and canonical seed integrity without treating application startup as a schema-mutation mechanism.

Production deployment must complete both install and verification before application services are promoted. The canonical deployment scripts enforce this for Docker Compose and PM2 paths.

Production deployment is triggered automatically by the owner's webhook on `main` push (after Auto Release).

## CI policy

The canonical workflow is:

```text
.github/workflows/foundation-ci.yml
```

Foundation CI runs on pushes to `dev`, pull requests to `main`/`dev`, and manual dispatch. **Runner is hardcoded to `ubuntu-latest`** (no `CI_RUNNER` indirection).

Audit implementation and test commands are documented in [scripts/README.md](scripts/README.md).
Run `pnpm test:scripts` for focused audit regression coverage.

Every Foundation CI check is blocking:

```text
pnpm install --frozen-lockfile
node scripts/audit-rules.mjs
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

The workflow checks out the exact pull-request head SHA for validation. A failed Audit, Lint, Typecheck, Test, or Build check blocks promotion.

The Production PostgreSQL Certification workflow is:

```text
.github/workflows/witness-postgres-certification.yml
```

It validates a clean PostgreSQL lifecycle using the same `apps/api/Dockerfile` artifact used by production Compose:

```text
fresh PostgreSQL
-> build exact candidate API image
-> db:install
-> db:verify
-> Witness graph certification
-> backup/restore smoke
-> API boot
-> /health/ready
-> quality/security regressions
```

**It runs only on manual dispatch** (`workflow_dispatch`). Database or deployment-sensitive changes should be certified manually via dispatch before or after promotion; the automatic pipeline does not block on it.

Additional manual workflow: `.github/workflows/manual-verification.yml` (Python microservices + E2E browser flows).

## Change discipline

Before coding:

1. Identify the owning addon/package.
2. Confirm the change follows `ARCHITECTURE.md`.
3. Prefer an existing canonical mechanism over a parallel abstraction.
4. For data changes, identify transaction, security, and migration impact.
5. Add or update tests with behavior changes.

## Commit guidance

Prefer focused conventional commits, for example:

```text
docs: define addon contract
fix(orm): create real transaction context
fix(security): fail closed on missing grants
refactor(server): keep REST handler transport-only
feat(cab): add wisdom model
```

Avoid mixing unrelated UI, ORM, migration, and domain work in one commit.

## Definition of done

A feature is ready for `dev` when its applicable lint, typecheck, tests, build, architecture, security, transaction, and migration checks pass and Foundation CI is green.

A `dev` candidate is ready for `main` when Foundation CI is green — the Auto Release workflow handles promotion and versioning automatically. For database/deployment-sensitive changes, manually run PostgreSQL Certification workflow before or after.

A release is deployable only when the production deployment path can build the intended artifacts, apply and verify migrations, pass readiness checks, and start the public portals reproducibly.

## Emergency fixes

If an urgent production fix must begin from `main`, reconcile the resulting fix back into `dev` and active feature work so branch history does not diverge. The next automatic promotion will include it.
