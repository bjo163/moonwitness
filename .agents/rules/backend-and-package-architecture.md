# ◈ CONSTITUTIONAL RULE: BACKEND, ENGINE & 34-PACKAGE MATRIX ARCHITECTURE (V9.0)

```
╔══════════════════════════════════════════════════════════════════════════╗
║  CLASSIFICATION: INTERNAL — SUPREME BACKEND & PACKAGE MATRIX LAW         ║
║  SYSTEM:         MoonWitness Server & Isomorphic Compute Engine V9.0     ║
║  STATUS:         ████████████████████████████████ ACTIVE                 ║
║  PACKAGES:       34 ISOLATED WORKSPACE PROJECTS                          ║
╚══════════════════════════════════════════════════════════════════════════╝
```

---

## 🏛️ PILLAR B-I: SERVER RUNTIME, DECLARATIVE ROUTING & SSE TRANSPORT
- **LAW BE-01 — Declarative Route Architecture (`defineRoute()`)**:
  - All backend endpoints in `@moon/server` and `apps/api` must use declarative `defineRoute()` builder with runtime schema validation, automatic CORS header injection, error boundary, and structured response envelopes (`SuccessResponseSchema`, `ErrorEnvelopeSchema`).
  - Raw `res.writeHead()` or manual stringified responses without schema validation are strictly prohibited.
- **LAW BE-02 — Unified Protocol Single Source of Truth (`@moon/protocol`)**:
  - All API contracts, parameters, and query shapes must reside in `@moon/protocol` defined with Zod.
  - Zero duplicate ad-hoc TypeScript interfaces between frontend and backend.
- **LAW BE-03 — Strongly-Typed Realtime Telemetry (`useCosmicTelemetry`)**:
  - Real-time Server-Sent Events (SSE) must broadcast through typed topics (`broadcastTopic(topic, payload)`) and provide automatic client cleanup on connection close.
- **LAW BE-04 — Safe RPC Dispatching**:
  - Procedure calls must use `defineProcedure({ input, output, handler })` with input inference and schema validation.

---

## 🏛️ PILLAR B-II: PURE ISOMORPHIC COMPUTATION ENGINE (`@moon/compute`)
- **LAW BE-05 — Pure Mathematical Isomorphism (Zero DB, Zero Network, Zero I/O)**:
  - `@moon/compute` (ephemeris, moon phase calculations, Hijri calendar algorithms, Qibla spherical geodesics, prayer time math) must remain 100% pure functions: zero database access, zero network fetch, zero file system I/O.
- **LAW BE-06 — Deterministic Precision & Polar Resilience**:
  - All astronomical algorithms must handle edge cases (extreme polar latitudes, leap years, lunar crescent visibility thresholds) deterministically without throwing unhandled NaN or infinite loops.

---

## 🏛️ PILLAR B-III: DATABASE, ORM & RELATIONAL KERNEL (`@moon/orm`, `@moon/base`)
- **LAW BE-07 — Relational Graph Model via Vertex Engine (`@moon/orm`)**:
  - All entities (verses, hadiths, users, telemetry nodes, civilizational events) must extend canonical Base models (`BaseKernel`, `BaseRecord`) with automatic timestamping (`createdAt`, `updatedAt`) and soft-delete support.
- **LAW BE-08 — Row-Level Security (RLS) & Tenant Isolation**:
  - ORM queries executing on behalf of operators must validate access permissions through the Security context (`withSecurity(ctx)`).
- **LAW BE-09 — Transactional Atomicity & Rollback Guarantees**:
  - Multi-step write operations must execute inside `runInTransaction(async (tx) => { ... })`.
- **LAW BE-10 — Zero Raw SQL Injection**:
  - Queries must use parameterized builders or Vertex model helpers; string concatenation of user inputs into SQL queries is strictly prohibited.

---

## 🏛️ PILLAR B-IV: SECURITY, AUTHENTICATION & SESSION REVOCATION (`@moon/server`)
- **LAW BE-11 — Cryptographic Token Lifecycle & Immediate Revocation**:
  - JWT tokens must encode a `tokenVersion` or `sessionId`. Password resets, user deactivations, and logout calls must immediately invalidate active sessions by incrementing `tokenVersion` or clearing the session store.
- **LAW BE-12 — Cryptographic Challenge Hashing (Argon2 / SHA-256 OTP)**:
  - Passwords must be hashed using Argon2 / scrypt / bcrypt. One-Time Passwords (OTP) and recovery challenge secrets stored in the DB must always be stored as cryptographic hashes, never plaintext.
- **LAW BE-13 — Zero Plaintext Secrets & Environment Variable Sandboxing**:
  - Secrets (`JWT_SECRET`, database passwords, mail credentials) must be loaded from `process.env` with fallback validation in `packages/types/src/env.ts` or runtime assertions.

---

## 🏛️ PILLAR B-V: THE 34-PACKAGE MATRIX & DEPENDENCY HIERARCHY
- **LAW BE-14 — Strict Layered Dependency Hierarchy**:
  ```
  Level 1: Pure Types & Math     ➔ @workspace/types, @moon/compute, @moon/protocol
  Level 2: Data Models & Core    ➔ @moon/base, @moon/orm, @moon/cache, @workspace/error
  Level 3: Domain Intelligence   ➔ @moon/witness, @moon/mizan, @moon/khidra, @moon/cab, etc.
  Level 4: Client & Server Engine➔ @moon/client, @moon/server
  Level 5: UI & State React      ➔ @workspace/ui, @workspace/hooks, @workspace/state
  Level 6: Applications          ➔ apps/api, apps/web, apps/command-center
  ```
  - A lower level must NEVER import from a higher level.
  - Zero circular dependencies across packages.
- **LAW BE-15 — Universal Package Export Hygiene**:
  - All 34 packages must expose explicit package exports (`"exports"` in `package.json`) with clean TypeScript type declarations (`.d.ts`).
- **LAW BE-16 — 100% Test Isolation & Contract Verification**:
  - Every backend package (`@moon/server`, `@moon/orm`, `@moon/witness`, `@moon/compute`, `@moon/protocol`) must provide dedicated Vitest unit & integration test suites.
