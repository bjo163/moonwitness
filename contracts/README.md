# ◈ MoonWitness Universal Contracts

This directory is the **language-agnostic Single Source of Truth** for API contracts, data models, and RPC schemas across all languages in the MoonWitness Polyglot Monorepo.

---

## 1. Architecture

```text
       ┌──────────────────────────────┐
       │   @moon/protocol (Registry)  │
       └──────────────┬───────────────┘
                      │
                      ▼
       ┌──────────────────────────────┐
       │  contracts/openapi/          │
       │       openapi.json           │ (Universal Contract Artifact)
       └──────────────┬───────────────┘
                      │
     ┌────────────────┼────────────────┐
     │                │                │
     ▼                ▼                ▼
[TypeScript]      [Python]          [Go/Rust]
Next.js / Fastify  FastAPI / Models   Microservices / Daemons
```

---

## 2. Generating & Refreshing Contracts

To export/update the canonical contract from the active protocol registry:

```bash
pnpm contracts:export
```

This derives `contracts/openapi/openapi.json` directly from `@moon/protocol` and `@moon/server`.

---

## 3. Polyglot Consumption

### TypeScript / Frontend
TypeScript packages consume `@moon/protocol` directly for compile-time type safety:
```typescript
import type { EndpointDef, AuthSuccess } from '@moon/protocol'
```

### Python (AI Agent & Celestial Engine)
Python services generate Pydantic models from `openapi.json` via [datamodel-code-generator](https://koxudaxi.github.io/datamodel-code-generator/):
```bash
uv run datamodel-codegen --input contracts/openapi/openapi.json --output services/celestial-engine/src/models/contracts.py
```

### Go (Microservices & Calculation Daemons)
Go services generate typed structs and client bindings via [oapi-codegen](https://github.com/oapi-codegen/oapi-codegen):
```bash
oapi-codegen -generate types,client -package contracts contracts/openapi/openapi.json > services/daemon/contracts.go
```
