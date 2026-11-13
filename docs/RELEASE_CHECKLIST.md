# MoonWitness Release Checklist

> Pre-release, release, deployment, and post-release verification for `feature → dev → (auto) main → (auto) tag → release`.

## Phase 1: Pre-Release (Feature → Dev)

- [ ] **Branch naming**: feature branch follows `feature/<issue>-<slug>` where an issue exists
- [ ] **Code review**: required approval is present
- [ ] **Foundation CI**: Audit, Lint, Typecheck, Test, and Build all pass for the exact feature SHA
- [ ] **No secrets**: no credentials, keys, or production secret values are committed
- [ ] **Repository rules**: `node scripts/audit-rules.mjs` passes
- [ ] **Tests**: behavior changes have appropriate coverage
- [ ] **Architecture**: no unnecessary duplicate runtime/persistence mechanism was introduced

## Phase 2: Integration (Dev)

- [ ] **Foundation CI**: exact `dev` candidate is green (push to dev triggers Foundation CI)
- [ ] **Integration**: cross-package/application regressions pass
- [ ] **Database**: migration/schema review completed when applicable
- [ ] **PostgreSQL certification**: **manually dispatch** for DB/API/deployment-sensitive changes
- [ ] **Artifact identity**: production API and certification both use `apps/api/Dockerfile`
- [ ] **Frontend API routing**: public browser API URL is provided at build time; internal server traffic uses `MOON_API_URL`

## Phase 3: Automatic Promotion & Release (Dev → Main → Tag → Release)

*Triggered automatically when Foundation CI completes successfully on `dev` push.*

- [ ] **Auto Release workflow runs**: workflow_run trigger fires on Foundation CI success
- [ ] **Promote**: dev merged into main (`-X theirs`, dev wins conflicts)
- [ ] **Bump**: root package.json patch version bumped with `[skip ci]` commit message
- [ ] **Tag**: semantic version tag `v{major}.{minor}.{patch}` created and pushed
- [ ] **GitHub Release**: auto-generated notes published
- [ ] **Dev sync**: version bump fast-forwarded to dev (`[skip ci]` prevents re-trigger)

## Phase 4: Production Deployment (Automatic via Owner's Webhook)

Use only the canonical runner for the host OS:

```text
scripts/deploy-prod.sh
scripts/deploy-prod.ps1
```

The deployment is not complete until:

- [ ] `.env.production` passes `docker compose config` / `docker-compose config`
- [ ] `node cli/mw.mjs prod-check` passes
- [ ] API, web, and command-center artifacts build successfully
- [ ] PostgreSQL and Redis are healthy
- [ ] `pnpm --filter=api db:install` succeeds in the production API artifact/environment
- [ ] `pnpm --filter=api db:verify` succeeds
- [ ] API reaches healthy `/health/ready`
- [ ] command-center and web start only after API readiness
- [ ] reverse proxy/TLS smoke checks pass on the real production domains

## Phase 5: Post-Release

- [ ] **GitHub Release**: final release state is intentional
- [ ] **Tag verification**: tag points to the certified SHA
- [ ] **Reconciliation**: hotfix/release divergence is reconciled into `dev`
- [ ] **Monitoring**: production errors and readiness are observed after rollout
- [ ] **Rollback readiness**: previous application artifact and database backup/restore path are available

## Emergency Hotfix Procedure

1. Create `hotfix/<issue>-<slug>` from `main`.
2. Apply the minimal fix with tests.
3. Open a PR to `main` with incident context.
4. Run the applicable exact-SHA gates (Foundation CI on PR).
5. After merge to main, Auto Release workflow triggers automatically (or dispatch manually).
6. Reconcile the hotfix into `dev` and active work.

## Publishing Matrix

`apps/*` and `@workspace/*` are private/internal runtime packages. Public `@moon/*` packages follow their individual package metadata; the release workflow performs a dry run and skips packages marked `private: true` rather than relying on a duplicated documentation list.

## Versioning Policy

- **Patch** (`x.y.z+1`): fixes and non-breaking changes (Auto Release bumps patch)
- **Minor** (`x.y+1.0`): backward-compatible features (requires manual version bump + tag)
- **Major** (`x+1.0.0`): breaking APIs or intentionally breaking schema changes (requires manual version bump + tag)
- **Prerelease** (`x.y.z-alpha|beta|rc`): release candidates (requires manual tag)

Versions follow Semantic Versioning 2.0.0.
