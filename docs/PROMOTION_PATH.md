# MoonWitness Promotion Path

> Branch promotion strategy for the Fastify + OTel migration and all feature work.

---

## Branch Architecture

```
feature/*  ──PR──▶  dev  ──PR──▶  main  ──tag──▶  release
     │                 │                │
     │                 │                └── Production (tagged releases only)
     │                 └── Integration (continuous deployment target)
     └── Feature development (ephemeral)
```

### Branch Definitions

| Branch | Purpose | Protection | CI |
|--------|---------|------------|----|
| `feature/*` | Feature development, bug fixes | None (ephemeral) | Foundation CI on PR |
| `dev` | Integration branch, continuous deployment target | PR required, 1 review, up-to-date | Foundation CI on push + PR |
| `main` | Production release branch | PR required, 1 review, up-to-date, required status checks | Foundation CI + Release on tag |

---

## Promotion Stages

### Stage 1: Feature → Dev

**Trigger**: Pull request from `feature/*` to `dev`

**Requirements**:
- Foundation CI passes (Test + Build required; Lint + Typecheck non-blocking)
- At least one approving review
- Branch is up-to-date with `dev`
- No merge conflicts

**Process**:
1. Create feature branch: `git checkout -b feature/<issue>-<slug> dev`
2. Implement changes with tests
3. Push and open PR to `dev`
4. CI runs automatically on PR
5. Address review feedback
6. Squash or rebase merge into `dev`

**CI Checks**:
| Check | Blocking | Timeout |
|-------|----------|---------|
| Lint | No (`continue-on-error`) | 15 min |
| Typecheck | No (`continue-on-error`) | 15 min |
| Test | Yes | 20 min |
| Build | Yes | 30 min |

---

### Stage 2: Dev → Main

**Trigger**: Pull request from `dev` to `main`

**Requirements**:
- All Stage 1 requirements met
- Integration tests pass (no regressions)
- PostgreSQL certification passes (if DB changes)
- Changelog updated
- Version bumps consistent across workspace

**Process**:
1. Ensure `dev` is stable and all CI green
2. Open PR from `dev` to `main`
3. Review integration test results
4. Merge after approval

---

### Stage 3: Main → Release

**Trigger**: Git tag push to `main`

**Requirements**:
- All Stage 2 requirements met
- Tag follows semantic versioning (`v*.*.*`)
- Release workflow passes (verify → publish dry-run → release notes)

**Process**:
1. Create annotated tag: `git tag -a v<version> -m "Release v<version>"`
2. Push tag: `git push origin v<version>`
3. Release workflow triggers automatically
4. Verify job runs build, typecheck, test
5. Publish job runs dry-run (no actual publishing yet)
6. Release notes job creates draft GitHub Release
7. Review and publish release

---

## Fastify + OTel Migration Promotion

The Fastify + OpenTelemetry migration follows the standard promotion path:

### Current Status

| Package | Status | Branch |
|---------|--------|--------|
| `@moon/server` (Fastify) | In Progress | `feature/fastify-otel-migration` |
| `@moon/client` (OTel hooks) | In Progress | `feature/fastify-otel-migration` |
| `@moon/protocol` (schema updates) | In Progress | `feature/fastify-otel-migration` |

### Migration Checklist

- [ ] Fastify server runtime replaces previous HTTP engine
- [ ] OpenTelemetry instrumentation integrated
- [ ] All existing REST/RPC/SSE routes migrated
- [ ] Schema introspection (`/api/meta/model/:name`) preserved
- [ ] CORS handling maintained
- [ ] Error boundaries preserved
- [ ] Performance benchmarks meet or exceed previous implementation
- [ ] All existing tests pass
- [ ] New tests for OTel spans and metrics
- [ ] Documentation updated

### Promotion Steps

1. **Feature branch**: Complete migration on `feature/fastify-otel-migration`
2. **PR to dev**: Open PR, CI validates, review approved
3. **Dev integration**: Merge to `dev`, monitor for regressions
4. **PR to main**: After integration period, promote to `main`
5. **Tag release**: Tag `v0.3.0` (minor bump for new features)

---

## CI/CD Workflows

### Foundation CI (`foundation-ci.yml`)

- **Triggers**: Push to any branch, PR to any branch, manual dispatch
- **Jobs**: Lint, Typecheck, Test, Build, Report
- **Reporting**: Posts PR comment with results matrix
- **Concurrency**: Cancels in-progress runs on new pushes

### Release (`release.yml`)

- **Triggers**: Tag push matching `v*.*.*`
- **Jobs**: Verify, Publish (dry-run), Release Notes
- **Publishing**: Dry-run mode (no actual npm publish)
- **Artifacts**: Draft GitHub Release with changelog

### PostgreSQL Certification (`witness-postgres-certification.yml`)

- **Triggers**: Push to `dev`/`main` (DB paths), weekly schedule, manual
- **Purpose**: Validates migrations, seed, and Witness graph against PostgreSQL 16

---

## Emergency Procedures

### Hotfix Flow

```
main ──checkout──▶ hotfix/* ──PR──▶ main ──tag──▶ release
                      │
                      └──PR──▶ dev (reconciliation)
```

1. Branch from `main`: `git checkout -b hotfix/<issue>-<slug> main`
2. Apply minimal fix with tests
3. Fast-track review and merge to `main`
4. Tag and release immediately
5. Merge hotfix commit back into `dev`
6. Reconcile into active feature branches

### Rollback Procedure

1. Identify problematic tag/release
2. Create rollback branch from previous stable tag
3. Cherry-pick or revert problematic commits
4. Tag new patch version
5. Release with rollback notes

---

## Branch Protection Rules

Configure in GitHub Settings → Rules → Rulesets:

### `dev` branch
- Require pull request before merging
- Require at least 1 approving review
- Dismiss stale approvals on new commits
- Require branch up-to-date before merging
- Block force pushes
- Block deletion

### `main` branch
- All `dev` rules, plus:
- Require status checks: `Test`, `Build`
- Require conversation resolution before merging
- Include administrators
