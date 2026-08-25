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
  -> test + review
  -> dev
  -> integration + regression + migration verification
  -> main
```

Do not skip `dev` for ordinary work.

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

- typecheck
- lint
- unit/integration tests
- database migration/schema review
- security review for access-rule changes
- transaction test for write-path changes
- architecture check: no new duplicate persistence path

A change is ready for `main` when `dev` is stable and the release/deployment path is verified.

## Emergency fixes

If an urgent production fix must begin from `main`, the resulting fix must also be reconciled back into `dev` and `feature` so the branch line does not diverge.