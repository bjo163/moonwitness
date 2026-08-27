# ◈ @workspace/types

```
╔══════════════════════════════════════════════════════════════════════════╗
║  PACKAGE:        @workspace/types                                        ║
║  SYSTEM VERSION: MoonWitness OS V9.0 (Divine Operating System Matrix)    ║
║  PKG VERSION:    9.0.0                                                   ║
║  CLASSIFICATION: TIER 1 — CANONICAL DOMAIN MODELS & SYSTEM CONSTANTS    ║
║  STATUS:         ████════════════════════════════ ACTIVE (SOVEREIGN)     ║
╚══════════════════════════════════════════════════════════════════════════╝
```

## 🌌 Overview
`@workspace/types` is the universal TypeScript domain definition hub for MoonWitness OS. It provides zero-dependency type models, system constants, port registries, and the master navigation mesh shared between `apps/web`, `apps/command-center`, and all internal packages.

---

## 📦 Canonical Exports

| Category | File | Key Exports |
|---|---|---|
| **Constants** | `constants.ts` | `APP_PORTS`, `DEFAULT_COORDINATES`, `STORAGE_KEYS`, `OS_VERSION` |
| **Navigation** | `navigation.types.ts` | `NAVIGATION_MESH`, `NavModuleItem`, `NavFamily` |
| **Auth Models** | `auth.types.ts` | `UserProfile`, `UserRole`, `OperatorClearance`, `SessionState` |
| **Witness Models**| `witness.types.ts` | `WitnessVerse`, `HadithEntry`, `AsmaulHusnaItem` |
| **Celestial** | `celestial.types.ts` | `MoonPhaseData`, `PrayerTimesData`, `SunPositionData` |

---

## 🚀 Usage

```typescript
import { APP_PORTS, DEFAULT_COORDINATES, OS_VERSION } from "@workspace/types"
import type { WitnessVerse, UserProfile, OperatorClearance } from "@workspace/types"

// Dynamic local port resolution
const apiEndpoint = `http://127.0.0.1:${APP_PORTS.API_BACKEND}`

// Accessing default Ka'bah coordinates
const { lat, lng } = DEFAULT_COORDINATES.MAKKAH

// Strongly typed operator session
const operator: UserProfile = {
  id: "op-77",
  name: "Ibn Battuta",
  clearance: "CHIEF_OBSERVER",
  roles: ["SCHOLAR", "OPERATOR"],
}
```

---

## 🛡️ Architectural Boundaries & Dependencies
- **Tier 1 (Foundation)**: 0 internal monorepo dependencies.
- May be imported freely by **ANY** package or application in the monorepo.
- Never imports from `@workspace/ui`, `@moon/client`, or `apps/*`.

---

## 🧪 Verification
```bash
pnpm --filter @workspace/types typecheck
```