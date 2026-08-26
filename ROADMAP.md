# MoonWitness Roadmap

Status: **Canonical high-level roadmap**.

Current release line: **Production Core v0.2.0**. Foundation hardening (ORM transactions,
fail-closed authorization, JWT/session policy, REST bounds, CORS, and server lifecycle) is
complete. Remaining production work is deterministic migration/install verification, the
Witness graph/engine expansion, and PostgreSQL certification.

## Current Production Core Priorities

- deterministic migrations, install/seed/verify commands, and operator runbooks
- Witness graph contracts, corpus ingestion, engine modules, and stable APIs
- PostgreSQL and browser/API certification before release promotion to `main`

Completed Foundation issues are retained in Git history and GitHub; they are not active roadmap
work items.

This roadmap intentionally prioritizes correctness and simplicity before new feature expansion.

## Phase 0 — Architecture Freeze

Goal: establish one shared technical direction before more refactoring.

Deliverables:

- `ARCHITECTURE.md`
- `DEVELOPMENT.md`
- `ROADMAP.md`
- `docs/CORE-PRINCIPLES.md`
- `docs/ADDON-SPEC.md`

Exit criteria:

- branch flow is defined
- Model → ORM → Server → Addon architecture is canonical
- duplicate framework layers are not introduced

## Phase 1 — Moon ORM Correctness & Security

Priority: **P0**.

Tasks:

- fix request context / transaction handling so writes use real transactions
- ensure nested transaction contexts reuse only actual transactions
- make access control fail closed by default
- remove arbitrary JavaScript execution from persisted record-rule evaluation
- standardize ORM errors for validation, access, conflict, and not-found cases
- add focused transaction and security regression tests

Known issues to address first:

1. REST currently constructs `Ctx` with a normal database handle in the transaction slot; this can cause code to treat a non-transaction connection as an active transaction.
2. Security contains conditions where missing grant/model configuration can return without denying access.
3. Dynamic record rules are evaluated with `new Function(...)` and must be replaced by a controlled domain evaluator.

Exit criteria:

- create/update/delete rollback correctly on failure
- access is denied when security configuration is missing or invalid, except explicitly documented bootstrap/superuser cases
- record rules cannot execute arbitrary JavaScript

## Phase 2 — Moon ORM Cleanup

Goal: keep the ORM powerful while reducing surprising behavior.

Scope:

- clarify `Ctx`, `Vertex`, `Recordset`, `QueryBuilder`, registry, fields, and schema responsibilities
- reduce `any` usage in core paths
- normalize naming and error semantics without adding another abstraction layer
- verify relation operations and lifecycle hooks execute inside the intended transaction
- add tests for many2one, one2many, many2many, record rules, inheritance, computed fields, and pagination

Non-goal: building a second ORM/runtime beside Moon ORM.

## Phase 3 — Moon Server Hardening

Goal: make `moon-server` a thin, predictable transport boundary.

Scope:

- request context creation
- authentication/session handling
- REST/RPC transport
- HTTP status/error mapping
- body/size validation
- rate limiting and request IDs where needed
- SSE/realtime lifecycle
- OpenAPI/model metadata

Remove domain/business logic from generic server code.

## Phase 4 — Base Addon Stabilization

Goal: make foundational identity/security/model metadata reliable.

Scope:

- user/role models
- grants and record rules
- model metadata
- sessions
- bootstrap/seed flow
- minimum stable admin/security behavior

## Phase 5 — Witness Foundation

Goal: provide one reusable evidence/audit/witness path that addons can use without manually reimplementing persistence behavior.

Scope will be driven by current `moon-witness` capabilities and selectively improved using proven ideas from the former Cosmic implementation where they fit MoonWitness's simpler architecture.

## Phase 6 — CAB

Goal: make CAB the reference domain addon for the final architecture.

CAB should prove that a normal addon can obtain:

- models and relations
- validation
- permissions and record rules
- transactions
- audit/witness integration
- generic REST/RPC
- special routes only where genuinely required

Do not rebuild CAB as a separate framework.

## Phase 7 — Mizan & Other Domain Addons

Migrate/clean domain behavior one addon at a time using the same model-first rules. Avoid cross-addon duplication.

## Phase 8 — Web / UI Alignment

Goal: align frontend modules with canonical backend models/APIs.

- keep routing thin
- keep reusable UI in core/shared layers
- keep domain views inside their owning modules
- do not encode authoritative backend rules only in UI
- remove stale mocks once real APIs are stable

## Phase 9 — Production Certification

Required before treating `main` as release-grade:

- clean install
- schema/migration verification
- PostgreSQL integration tests
- auth/security tests
- transaction rollback tests
- addon boot/dependency tests
- API smoke tests
- build/typecheck/lint/test gates
- Docker/deployment verification
- backup/restore procedure
- observability/health checks

## Roadmap rule

New ideas do not automatically become new packages or framework layers. First classify the work into an existing phase/addon. Create a new abstraction only when repeated real use cases demonstrate that the existing model is insufficient.

`FOUNDATION-ROADMAP.md` remains a historical/detail reference. This file controls the current high-level sequencing.
