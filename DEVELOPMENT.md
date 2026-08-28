# MoonWitness Development Workflow

Status: **Canonical** for branch and change flow.

## Branch model

MoonWitness uses three long-lived working branches:

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

Stable/release branch.

Rules:

- no normal development directly on `main`
- receives changes only after they are integrated and verified on `dev`
- should remain deployable

### `dev`

Integration branch.

Rules:

- receives completed work from `feature`
- integration, regression, migration, and cross-addon checks happen here
- fixes found during integration should be made through the normal development flow instead of using `main` as a scratch branch

### `feature`

Active development branch.

Rules:

- current refactors, new models, bug fixes, and experiments happen here
- incomplete changes stay here
- code moves to `dev` only after local/package tests and review are satisfactory

## Promotion flow

```text
feature
  -> test + review + CI
  -> dev
  -> integration + regression + migration verification + CI
  -> main
```

Do not skip `dev` for ordinary work.

## Database workflow

MoonWitness uses a single canonical database setup command:

```text
pnpm db:install
```

This command runs the complete setup pipeline:
1. Apply all pending migrations
2. Verify seed integrity
3. Sync schema (development only; production rejects drift)
4. Seed canonical base data (operators, observatories, reports)
5. Seed witness graph core (scriptures, entities, relations, religions)
6. Seed full demo data across all 15 addon packages

After completion, a comprehensive summary is printed showing:
- Duration and migration count
- Schema sync status
- Base seed counts (operators, observatories, reports)
- Witness domain counts (scriptures, verses, figures, traditions, etc.)
- Addon demo counts (projects, tasks, accounts, tickets, RFCs, etc.)
- Total database tables

For integrity-only verification:
```text
pnpm db:verify
```

## CI policy

MoonWitness uses the repository owner's **self-hosted GitHub Actions runner** as the canonical CI execution environment.

The foundation workflow lives at:

```text
.github/workflows/foundation-ci.yml
```

Its required check name is `Lint, Typecheck, Test, Build`.

It runs for:

- pull requests targeting `dev`
- pull requests targeting `main`
- pushes to `dev`
- pushes to `main`
- manual workflow dispatch

The initial promotion gate runs:

```text
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Security rules for the self-hosted runner:

- workflow permissions are read-only unless a future job explicitly requires more
- fork pull requests must not execute arbitrary code on the self-hosted runner
- the workflow only accepts pull-request execution when the PR head repository is this same repository
- repository secrets must not be added to generic validation jobs unless explicitly required and reviewed

A failed required CI check blocks promotion to the next long-lived branch.

PostgreSQL graph certification is intentionally not part of the fast pull-request gate. It is
available through the `Witness PostgreSQL Certification` workflow via manual dispatch and must be
run for release/database-validation work when a PostgreSQL-capable runner is available. Its
result must not be treated as a substitute for Foundation CI.

## Change discipline

Before coding:

1. Identify the owning addon/package.
2. Confirm the change follows `ARCHITECTURE.md`.
3. Prefer changing an existing canonical mechanism over adding a parallel abstraction.
4. For data changes, identify transaction, security, and migration impact.
5. Add or update tests with behavior changes.

## Commit guidance

Prefer focused commits with conventional intent, for example:

```text
docs: define addon contract
fix(orm): create real transaction context
fix(security): fail closed on missing grants
refactor(server): keep REST handler transport-only
feat(cab): add wisdom model
```

Avoid mixing large unrelated UI, ORM, migration, and domain changes in one commit.

## Definition of done

A change is ready to move from `feature` to `dev` when applicable checks pass:

- lint
- typecheck
- unit/integration tests
- build
- database migration/schema review
- security review for access-rule changes
- transaction test for write-path changes
- architecture check: no new duplicate persistence path
- required self-hosted CI status is green

A change is ready for `main` when `dev` is stable, required self-hosted CI is green, and the release/deployment path is verified.

## Emergency fixes

If an urgent production fix must begin from `main`, the resulting fix must also be reconciled back into `dev` and `feature` so the branch line does not diverge.
