# Repository cleanup action plan

Status: audit completed, cleanup in progress

## Immediate actions

- [ ] Finish CI for PR #170 at commit `916e1b2`.
- [ ] Merge PR #170 into `dev` only after Foundation, PostgreSQL, and UMBRELLA gates pass.
- [ ] Synchronize local `main` and `dev` with their remotes.
- [ ] Remove remote branches only after checking merge status and open work.
- [ ] Keep only `main` and `dev` as long-lived remote branches.
- [ ] Remove stale local worktrees after preserving any useful changes.

## Phase 1 — repository hygiene

- [ ] Standardize all Docker images and CI on Node 22.
- [ ] Add a repository-level Node version declaration and enforce it in CI.
- [ ] Centralize API base URL resolution for Web and Command Center.
- [ ] Remove direct production `localStorage` access or route it through the shared state layer.
- [ ] Resolve synthetic or unlabeled telemetry in monitoring views.
- [x] Keep generated logs, build output, coverage, and audit runtime data ignored.
- [ ] Add ownership/readme metadata for every workspace package.

## Phase 2 — structure and boundaries

- [ ] Keep `apps/` limited to application composition, routes, views, and app-specific adapters.
- [ ] Keep domain logic in the appropriate `packages/moon-*` package.
- [ ] Keep shared UI primitives and state in `packages/ui` and `packages/state`.
- [ ] Consolidate duplicate Next.js configuration into a shared config helper where practical.
- [ ] Standardize package scripts: `build`, `typecheck`, `lint`, and `test` where applicable.
- [ ] Document package ownership and dependency direction.

## Phase 3 — oversized files

- [ ] Split `apps/api/migrations/20260903191343_additive.ts` into reviewed migration units or a documented baseline strategy.
- [ ] Split oversized Web views into container, data, and presentation modules.
- [ ] Split large server handlers and ORM modules by responsibility.
- [ ] Keep new source files below the repository's configured size threshold.

## Phase 4 — dependency and quality debt

- [ ] Align duplicated dependency versions, prioritizing `zod`, `@types/node`, `recharts`, and Google AI packages.
- [ ] Remove unused packages and stale scripts after import-graph verification.
- [ ] Fix the constitutional audit's 19 direct `localStorage` findings.
- [ ] Reduce the 43 oversized-file warnings.
- [ ] Make `audit:umbrella:check` fail only on real, actionable gate failures.

## Definition of done

- Remote contains only `main` and `dev`.
- Local `main` and `dev` match their remotes exactly.
- No stale dirty worktree or unreviewed stash remains.
- CI passes on the same Node version used by Docker.
- Tests, typecheck, lint, build, PostgreSQL certification, and repository audit pass.
- Every remaining exception is documented with an owner and issue.
