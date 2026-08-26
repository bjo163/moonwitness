# MoonWitness Release Policy

The root `package.json` version is the canonical MoonWitness platform version. The current
release line is `0.2.0` (Production Core). Workspace package versions describe package maturity
and do not override the platform release version.

MoonWitness follows semantic versioning:

- major: incompatible platform, data-contract, or migration changes
- minor: backwards-compatible production capabilities
- patch: backwards-compatible fixes and documentation updates

Release procedure:

1. Update the root version and `CHANGELOG.md`.
2. Run `pnpm typecheck`, `pnpm test`, and `pnpm build`.
3. Run `pnpm --filter api db:check` and `pnpm --filter api db:verify` against the target database.
4. Promote `dev` to `main` only after the required release checks are available and approved.

No historical migration may be edited after it has been applied. Create a new migration instead.
