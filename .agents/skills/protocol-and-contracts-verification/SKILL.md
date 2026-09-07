---
name: protocol-and-contracts-verification
description: >-
  Use this skill when defining, updating, or validating API contracts, RPC procedures, schemas, and cross-boundary protocol bindings.
---

# Protocol & API Contracts Verification Skill

Governs the single source of truth for all API contracts between frontend and backend via `@moon/protocol`.

## Procedures

1. **Contract Definition (`@moon/protocol`)**:
   - Define all endpoint parameters, query shapes, and payloads using Zod schemas in `packages/moon-protocol`.
   - Never write duplicate ad-hoc TypeScript interfaces inside component files or route handlers.

2. **Route Implementation (`@moon/server` / `apps/api`)**:
   - Build REST and RPC routes using declarative `defineRoute()` builders.
   - Enforce runtime validation, standard envelopes (`SuccessResponseSchema`, `ErrorEnvelopeSchema`), and typed CORS headers.

3. **Export & Verification Commands**:
   ```bash
   pnpm contracts:verify
   pnpm contracts:export
   pnpm contracts:generate:python
   ```
