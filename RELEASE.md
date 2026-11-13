# MoonWitness Release Policy

Status: **Canonical**.

The root `package.json` version is the canonical MoonWitness platform version. The current release line is **0.3.1**.

Workspace package versions describe package maturity and do not override the platform release version.

MoonWitness follows semantic versioning:

- major: incompatible platform, data-contract, or migration changes
- minor: backwards-compatible production capabilities
- patch: backwards-compatible fixes, hardening, and documentation corrections

## Promotion path

Normal releases are **fully automatic**:

```text
feature branch
-> pull request + Foundation CI
-> dev (push)
-> Foundation CI completes successfully
-> Auto Release workflow (workflow_run trigger):
   1. promotes dev → main (-X theirs)
   2. bumps patch version [skip ci]
   3. creates & pushes version tag (vX.Y.Z)
   4. creates GitHub Release (auto-generated notes)
   5. syncs version bump back to dev (fast-forward, [skip ci])
```

Do not skip `dev` for ordinary releases. The automatic pipeline handles promotion, versioning, and release creation.

## Required candidate checks

For the exact candidate SHA on `dev` push:

```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Database/deployment-sensitive candidates **additionally** require manual PostgreSQL certification:

```bash
# Manual dispatch workflow:
.github/workflows/witness-postgres-certification.yml
```

Canonical PostgreSQL certification includes:

```text
fresh PostgreSQL 18
-> db:install
-> db:verify
-> Witness graph certification
-> backup/restore smoke
-> production API boot
-> /health/ready
-> quality/security regressions
```

Run certification manually before promoting sensitive changes, or promote and certify after (the automatic pipeline will not block on it).

## Version and tag invariant

The Auto Release workflow enforces:

1. Bumps root `package.json` **patch** version with commit message `chore(release): vX.Y.Z [skip ci]`.
2. Creates tag `vX.Y.Z` on the exact current `main` commit (after promote + bump).
3. Never moves or reuses an existing release tag (idempotent: skips if tag exists).

## Database invariant

Production startup is not the migration mechanism. Before service promotion run:

```bash
pnpm db:install
pnpm --filter=api db:verify
```

No historical migration may be edited after application. Create a new additive/reviewed migration instead.

## Current v0.3.1 release scope

v0.3.1 hardens the production/release path, including deterministic Docker/PostgreSQL certification, exact-candidate promotion, compiled runtime packaging, blocking quality gates, and final Fastify/RPC transport hardening.

The next release (v0.3.2) will be created automatically by the Auto Release workflow upon the next successful Foundation CI run on `dev`.
