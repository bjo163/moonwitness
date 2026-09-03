# MoonWitness Release Policy

Status: **Canonical**.

The root `package.json` version is the canonical MoonWitness platform version. The current release line is **0.3.1**.

Workspace package versions describe package maturity and do not override the platform release version.

MoonWitness follows semantic versioning:

- major: incompatible platform, data-contract, or migration changes
- minor: backwards-compatible production capabilities
- patch: backwards-compatible fixes, hardening, and documentation corrections

## Promotion path

Normal releases follow:

```text
feature branch
-> pull request + Foundation CI
-> dev
-> Foundation CI + Production PostgreSQL Certification
-> main
-> exact version tag
-> Release workflow
-> GitHub Release
```

Do not skip `dev` for ordinary releases.

## Required candidate checks

For the exact candidate SHA:

```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Database/deployment-sensitive candidates additionally require the canonical PostgreSQL certification workflow, including:

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

## Version and tag invariant

Before tagging:

1. Update root `package.json` version and `CHANGELOG.md`.
2. Promote the certified `dev` candidate to `main` through PR flow.
3. Create tag `v${package.json.version}` on the **exact current `main` commit**.
4. Never move or reuse an existing release tag.

`.github/workflows/release.yml` rejects a tag when its name does not match the root version or it does not point to exact current `main`.

## Database invariant

Production startup is not the migration mechanism. Before service promotion run:

```bash
pnpm db:install
pnpm --filter=api db:verify
```

No historical migration may be edited after application. Create a new additive/reviewed migration instead.

## Current v0.3.1 release scope

v0.3.1 hardens the production/release path, including deterministic Docker/PostgreSQL certification, exact-candidate promotion, compiled runtime packaging, blocking quality gates, and final Fastify/RPC transport hardening.

A GitHub Release is complete only after the release workflow succeeds for `v0.3.1` (or the current root version at that time).
