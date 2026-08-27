# ◈ @moon/protocol

```
╔══════════════════════════════════════════════════════════════════════════╗
║  PACKAGE:        @moon/protocol                                          ║
║  SYSTEM VERSION: MoonWitness OS V9.0 (Divine Operating System Matrix)    ║
║  PKG VERSION:    9.0.0                                                   ║
║  CLASSIFICATION: TIER 1 — SINGLE SOURCE OF TRUTH (SSOT) PROTOCOL         ║
║  STATUS:         ████████████████████████████████ ACTIVE (SOVEREIGN)     ║
╚══════════════════════════════════════════════════════════════════════════╝
```

## 🌌 Overview
`@moon/protocol` is the canonical Zod schema and contract registry for MoonWitness OS. It defines the Single Source of Truth for all HTTP API responses, RPC input/output shapes, authentication envelopes, and strongly-typed Server-Sent Events (SSE) telemetry topics.

---

## 📦 Master Schemas & Contracts

| Contract Type | File | Key Schemas & Types |
|---|---|---|
| **Witness Revelation** | `witness.ts` | `WitnessVerseSchema`, `HadithListResponseSchema`, `AsmaulHusnaSchema` |
| **Auth & Sessions** | `auth.ts` | `AuthSessionSchema`, `LoginPayloadSchema`, `RecoveryChallengeSchema` |
| **Governance & CAB**| `cab.ts` | `CabRfcSchema`, `CabSummaryResponseSchema`, `CivilizationLevelSchema` |
| **Telemetry & Metrics**| `telemetry.ts` | `SystemMetricSchema`, `ObservationStreamSchema`, `TelemetryTopicMap` |
| **Envelopes** | `envelopes.ts` | `SuccessEnvelopeSchema<T>`, `ErrorEnvelopeSchema` |

---

## 🚀 Usage

```typescript
import {
  HadithListResponseSchema,
  AuthSessionSchema,
  SuccessEnvelopeSchema,
  type HadithListResponse,
  type AuthSession
} from "@moon/protocol"

// 1. Runtime Schema Validation in Route Handlers
const parsedData: HadithListResponse = HadithListResponseSchema.parse(rawApiResponse)

// 2. Safe Parsing
const result = AuthSessionSchema.safeParse(sessionPayload)
if (!result.success) {
  console.error("Session envelope corruption:", result.error.format())
}

// 3. Constructing Standard API Envelopes
const envelope = SuccessEnvelopeSchema(HadithListResponseSchema).parse({
  success: true,
  data: parsedData,
  timestamp: new Date().toISOString(),
})
```

---

## 🛡️ Architectural Boundaries
- Belongs to **Tier 1 (Pure Protocol)**.
- 0 internal monorepo dependencies.
- Consumed by both backend (`@moon/server`, `apps/api`) and frontend (`@moon/client`, `apps/web`, `apps/command-center`).

---

## 🧪 Verification
```bash
pnpm --filter @moon/protocol typecheck
```
