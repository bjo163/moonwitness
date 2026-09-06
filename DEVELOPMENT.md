# MoonWitness Development Workflow

Status: **Canonical** for branch, validation, database, and promotion flow.

## Branch model

```text
feature
   |
   v
  dev
   |
   v
 main
```

### `main`

Stable/release branch. Normal development does not happen directly on `main`; it receives changes only after integration and verification on `dev` and should remain deployable.

### `dev`

Integration branch. Completed feature work lands here for integration, regression, migration, and cross-addon verification before promotion to `main`.

### `feature`

Active development branch. New features, fixes, refactors, and experiments remain here until their applicable checks and review are complete.

## Promotion flow

```text
feature
  -> test + review + Foundation CI
  -> dev
  -> integration + regression + PostgreSQL certification when applicable
  -> main
  -> tag
  -> release
```

Do not skip `dev` for ordinary work.

## Database workflow

Canonical production-safe commands:

```text
pnpm db:install
pnpm --filter=api db:verify
```

`db:install` applies pending migrations, validates canonical seed artifacts, loads required base data, and seeds the Witness graph core. Demo/sample data is separate and is loaded only through the explicit demo paths or flags.

`db:verify` checks migration integrity and canonical seed integrity without treating application startup as a schema-mutation mechanism.

Production deployment must complete both install and verification before application services are promoted. The canonical deployment scripts enforce this for Docker Compose and PM2 paths.

## CI policy

The canonical workflow is:

```text
.github/workflows/foundation-ci.yml
```

Foundation CI runs on pushes, pull requests, and manual dispatch. Runner selection is portable:

```text
CI_RUNNER repository variable set -> use that runner label
CI_RUNNER unset                   -> use ubuntu-latest
```

Set `CI_RUNNER=self-hosted` only when the repository-owned runner is healthy and intentionally selected.

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

It runs for pull requests to `dev`/`main`, pushes to `dev`/`main`, weekly schedule, and manual dispatch. Database or deployment-sensitive promotion to `main` requires a green certification result for the exact candidate SHA.

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

A `dev` candidate is ready for `main` only when Foundation CI is green and, for database/deployment-sensitive changes, Production PostgreSQL Certification is green for the exact candidate SHA.

A release is deployable only when the production deployment path can build the intended artifacts, apply and verify migrations, pass readiness checks, and start the public portals reproducibly.

## Emergency fixes

If an urgent production fix must begin from `main`, reconcile the resulting fix back into `dev` and active feature work so branch history does not diverge.
