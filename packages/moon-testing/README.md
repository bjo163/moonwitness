# ◈ @moon/testing

```
╔══════════════════════════════════════════════════════════════════════════╗
║  PACKAGE:        @moon/testing                                           ║
║  SYSTEM VERSION: MoonWitness OS V9.0 (Divine Operating System Matrix)    ║
║  PKG VERSION:    9.0.0                                                   ║
║  CLASSIFICATION: TIER 1 — MONOREPO TEST FIXTURES & PROTOCOL VALIDATOR    ║
║  STATUS:         ████████████████████████████████ ACTIVE (SOVEREIGN)     ║
╚══════════════════════════════════════════════════════════════════════════╝
```

## 🌌 Overview
`@moon/testing` contains shared Vitest test fixtures, mock server environments, schema contract assertion suites, and pure mathematical testing harnesses across the MoonWitness workspace.

---

## 📦 Public API Surface

| Export | Type | Description |
|---|---|---|
| `TESTING_SUITE_VERSION` | `string` | Version identifier ("9.0.0") |
| `IS_TEST_ENVIRONMENT` | `boolean` | Environment flag |
| `createMockObserverContext()` | `() => MockContext` | Generates a deterministic mock operator context |
| `generateMockTelemetryPayload()`| `(type) => TelemetryData` | Procedural telemetry stream generator for test suites |

---

## 🚀 Usage

```typescript
import { describe, it, expect } from "vitest"
import { TESTING_SUITE_VERSION, IS_TEST_ENVIRONMENT } from "@moon/testing"
import { getMoonPhase } from "@moon/compute"

describe("Astronomical Engine Tests", () => {
  it("runs inside verified testing suite", () => {
    expect(IS_TEST_ENVIRONMENT).toBe(true)
    expect(TESTING_SUITE_VERSION).toBe("9.0.0")
  })

  it("calculates deterministic moon illumination", () => {
    const res = getMoonPhase(new Date("2026-01-01T00:00:00Z"))
    expect(res.fraction).toBeGreaterThanOrEqual(0)
    expect(res.fraction).toBeLessThanOrEqual(1)
  })
})
```

---

## 🛡️ Architectural Boundaries
- Belongs to **Tier 1 (Foundation)**. Used exclusively during build, linting, and automated CI test execution.

---

## 🧪 Verification
```bash
pnpm --filter @moon/testing test
```
