# MoonWitness Roadmap

Status: **Canonical high-level roadmap**.

Current release line: **v0.3.1 — Production Hardening & Canonical Fastify Transport**.

The dual-portal architecture, canonical PostgreSQL lifecycle, Fastify transport boundary, explicit RPC procedure surface, and release certification path are the current production baseline.

---

## Completed platform phases

### Phase 0 — Architecture Freeze ✅
- Model -> ORM -> Server -> Addon ownership established.
- Normal promotion flow defined as feature branch -> `dev` -> `main` -> release tag.

### Phase 1–2 — Moon ORM Correctness & Security ✅
- Transactional write boundary and fail-closed authorization.
- PostgreSQL/pgvector support and relational tuple semantics.
- Explicit migration/install/verify production lifecycle.

### Phase 3–4 — Moon Server & Base Hardening ✅
- Canonical auth/session lifecycle.
- REST/OpenAPI boundary and schema validation.
- SSE session revocation/revalidation.
- Explicit RPC registry; caller-controlled class-property dispatch removed.
- Fastify 5 is the internal production HTTP engine behind `NativeServer`.
- Optional OpenTelemetry auto-instrumentation at the server boundary.

### Phase 5–7 — Witness, CAB & Mizan ✅
- Provenance-first Witness graph and deterministic engine runtime.
- CAB governance and Mizan assessment domains.
- PostgreSQL-backed graph certification.

### Phase 8 — Dual Portal / Shared UI ✅
- `apps/web` public portal and `apps/command-center` administration portal.
- Shared `@workspace/ui`, typed client/state layers, theme system, and application metadata.

### Phase 9 — Production Release Engineering ✅
- Blocking Foundation CI: audit, lint, typecheck, test, build.
- PostgreSQL 18 clean install/seed/verify certification.
- Backup/restore and `/health/ready` smoke.
- Deterministic production Docker artifacts and release workflow.

---

## Remaining release-governance action

### P0 — GitHub branch policy

Repository code and CI define the required promotion flow, but GitHub branch/ruleset configuration must enforce it administratively:

- protect `main`
- protect `dev`
- require pull requests for normal promotion
- require the canonical CI checks
- block force push/deletion on `main`

This is tracked by issue #18 and must remain visible until GitHub reports the rules as active.

---

## Next product priorities

### Phase 10 — Corpus Expansion & Epistemic Verification
- Expand versioned corpus ingestion through the separate canonical corpus repository.
- Strengthen provenance and evidence-resolution tooling.
- Keep search/AI outputs derived from, and traceable to, canonical evidence.

### Phase 11 — Operations & Scale
- Production SLOs and alerting from health/readiness + telemetry.
- Automated backup retention/restore drills.
- Deployment rollback drills against immutable release tags/artifacts.
- Capacity planning before introducing new infrastructure or frameworks.

## Technology policy

Prefer simplification over additional stack expansion. New infrastructure is justified only when a measured production constraint cannot be solved by the current Node.js/Fastify/PostgreSQL/Redis/Next.js platform.
