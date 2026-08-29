# ◈ @moon/time

```
╔══════════════════════════════════════════════════════════════════════════╗
║  PACKAGE:        @moon/time                                              ║
║  SYSTEM VERSION: MoonWitness OS V9.0 (Divine Operating System Matrix)    ║
║  PKG VERSION:    9.0.0                                                   ║
║  CLASSIFICATION: TIER 1 — COSMIC CHRONOMETRY & TIMEKEEPING ENGINE        ║
║  STATUS:         ████████████████████████████████ ACTIVE (SOVEREIGN)     ║
╚══════════════════════════════════════════════════════════════════════════╝
```

## 🌌 Overview
`@moon/time` provides high-precision timekeeping utilities, standardized UTC cosmic telemetry formatting, Hijri month indexing, and astronomical prayer interval calculations.

---

## 📦 Public API Surface

| Export | Type | Description |
|---|---|---|
| `HIJRI_MONTH_NAMES` | `readonly string[]` | Array of the 12 canonical Hijri months |
| `formatCosmicTimestamp(date)` | `(date?: Date) => string` | Formats ISO dates into NASA-grade celestial telemetry timestamp |
| `calculateTimeRemaining(target)` | `(target: Date) => Duration` | Computes hours, minutes, seconds countdown interval |
| `isSacredMonth(monthIndex)` | `(m: number) => boolean` | Identifies the 4 sacred Islamic months (Ashhurul Hurum) |

---

## 🚀 Usage

```typescript
import {
  HIJRI_MONTH_NAMES,
  formatCosmicTimestamp,
  calculateTimeRemaining,
  isSacredMonth
} from "@moon/time"

// 1. Format Mission Control Telemetry Timestamp
const timestamp = formatCosmicTimestamp(new Date())
// => "2026-08-27 02:15:30.124 UTC"

// 2. Canonical Hijri Month Lookup
const currentMonthName = HIJRI_MONTH_NAMES[8] // "Ramadan"

// 3. Sacred Month Verification
const isSacred = isSacredMonth(11) // Dzulhijjah => true
```

---

## 🛡️ Architectural Boundaries
- Belongs to **Tier 1 (Foundation)**. Zero side-effects and zero network dependencies.

---

## 🧪 Verification
```bash
pnpm --filter @moon/time typecheck
```
