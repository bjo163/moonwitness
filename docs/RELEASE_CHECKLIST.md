# MoonWitness Release Checklist

> Pre-release, release, and post-release verification checklist for promoting packages through `feature → dev → main → tag`.

---

## Phase 1: Pre-Release (Feature → Dev)

Complete before opening a PR to `dev`:

- [ ] **Branch naming**: Feature branch follows `feature/<issue>-<slug>` convention
- [ ] **Code review**: PR has at least one approving review
- [ ] **CI green**: Foundation CI passes on the feature branch (Test + Build)
- [ ] **No secrets**: No secrets, keys, or credentials committed
- [ ] **File size**: No file exceeds 400 lines (`max-lines: 400`)
- [ ] **JSX depth**: No JSX nesting exceeds 6 levels
- [ ] **Module guards**: Dynamic routes wrapped with `<ModuleGuard>` or `<ErrorBoundary>`
- [ ] **Tests added**: New functionality has corresponding test coverage
- [ ] **No inline mocks**: API data uses `useModelSchema()` / `useModelRecords()` helpers
- [ ] **Constitutional audit**: `node scripts/audit-rules.mjs` passes

---

## Phase 2: Integration (Dev)

After merge to `dev`:

- [ ] **Dev CI green**: Foundation CI passes on `dev` branch
- [ ] **Integration tests**: No regressions in cross-package integration
- [ ] **Typecheck**: `pnpm typecheck` passes across all 37 packages
- [ ] **Build**: `pnpm build` succeeds for all apps and packages
- [ ] **PostgreSQL certification**: Witness PostgreSQL Certification workflow passes (if DB changes)

---

## Phase 3: Release Candidate (Dev → Main)

Before promoting `dev` to `main`:

- [ ] **Changelog**: All changes since last tag are documented
- [ ] **Version bump**: Package versions updated consistently across workspace
- [ ] **Breaking changes**: Documented with migration notes
- [ ] **API contracts**: `@moon/protocol` schemas are backward-compatible or versioned
- [ ] **Dependencies**: No vulnerable dependencies (`pnpm audit`)
- [ ] **Performance**: No performance regressions in critical paths
- [ ] **PR approval**: `dev → main` PR has required reviews

---

## Phase 4: Release (Main → Tag)

Release execution:

- [ ] **Tag created**: Semantic version tag `v{major}.{minor}.{patch}` on `main`
- [ ] **Release workflow**: Release workflow triggered by tag push
- [ ] **Verify job**: Build, typecheck, and test all pass in CI
- [ ] **Dry run publish**: `pnpm publish --dry-run` succeeds for all non-private packages
- [ ] **GitHub Release**: Draft release created with changelog
- [ ] **Release notes**: Accurate description of changes, breaking changes, and migration steps

---

## Phase 5: Post-Release

After release is published:

- [ ] **npm packages**: All non-private packages published successfully
- [ ] **GitHub Release**: Published (not draft)
- [ ] **Tag verification**: Tag is annotated and signed where possible
- [ ] **Reconciliation**: Release commit merged back into `dev` if hotfixes applied
- [ ] **Announcement**: Stakeholders notified of release
- [ ] **Monitoring**: Error telemetry monitored for 24h post-release

---

## Emergency Hotfix Procedure

For critical fixes that bypass normal flow:

1. Create `hotfix/<issue>-<slug>` from `main`
2. Apply minimal fix with tests
3. Open PR to `main` with incident reference
4. After merge, tag and release
5. Merge hotfix commit back into `dev`
6. Reconcile into active feature branches
7. Remove hotfix branch after both reconciliations

---

## Package Publishing Matrix

| Package | Scope | Publish | Notes |
|---------|-------|---------|-------|
| `@moon/base` | Public | Yes | Core models, 2FA/TOTP |
| `@moon/witness` | Public | Yes | Knowledge graph |
| `@moon/compute` | Public | Yes | Pure math engine |
| `@moon/server` | Public | Yes | HTTP/RPC/SSE runtime |
| `@moon/client` | Public | Yes | API client, SSO |
| `@moon/protocol` | Public | Yes | Zod API contracts |
| `@moon/orm` | Public | Yes | Vertex ORM |
| `@moon/cron` | Public | Yes | BullMQ queue |
| `@moon/khidra` | Public | Yes | Automations |
| `@moon/cab` | Public | Yes | RFC records |
| `@moon/mizan` | Public | Yes | Balance engine |
| `@moon/geo` | Public | Yes | Geospatial |
| `@moon/cache` | Public | Yes | Cache layer |
| `@moon/mail` | Public | Yes | Email services |
| `@moon/product` | Public | Yes | Product catalog |
| `@moon/stock` | Public | Yes | Inventory |
| `@moon/account` | Public | Yes | Accounting |
| `@moon/crm` | Public | Yes | CRM |
| `@moon/project` | Public | Yes | Task management |
| `@moon/helpdesk` | Public | Yes | Support tickets |
| `@moon/shootgun` | Public | Yes | Operations |
| `@moon/performance` | Public | Yes | Telemetry |
| `@moon/time` | Public | Yes | Timekeeping |
| `@moon/testing` | Public | Yes | Test fixtures |
| `@workspace/*` | Workspace | No | Internal shared packages |
| `apps/*` | Private | No | Application runtimes |

---

## Versioning Policy

- **Patch** (`x.y.z+1`): Bug fixes, documentation, non-breaking changes
- **Minor** (`x.y+1.0`): New features, backward-compatible API additions
- **Major** (`x+1.0.0`): Breaking changes, API removals, schema migrations
- **Prerelease** (`x.y.z-alpha|beta|rc`): Release candidates for testing

All versions follow [Semantic Versioning 2.0.0](https://semver.org/).
