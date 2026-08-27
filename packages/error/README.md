# ◈ @workspace/error

```
╔══════════════════════════════════════════════════════════════════════════╗
║  PACKAGE:        @workspace/error                                        ║
║  SYSTEM VERSION: MoonWitness OS V9.0 (Divine Operating System Matrix)    ║
║  PKG VERSION:    9.0.0                                                   ║
║  CLASSIFICATION: TIER 2 — FAULT TOLERANCE, ISOLATION & CRASH TELEMETRY   ║
║  STATUS:         ████████████████████████████████ ACTIVE (SOVEREIGN)     ║
╚══════════════════════════════════════════════════════════════════════════╝
```

## 🌌 Overview
`@workspace/error` provides complete fault tolerance, dynamic route crash isolation, and real-time client error reporting for MoonWitness OS. It prevents component crashes from cascading across the OS and streams telemetry fault logs.

---

## 📦 Public API Surface

| Component / Function | Props / Arguments | Description |
|---|---|---|
| `<ErrorBoundary />` | `fallback?: ReactNode, onError?: fn, moduleId?: string` | React Error Boundary component capturing runtime render errors |
| `<ModuleGuard />` | `moduleId: string, children: ReactNode, fallback?: ReactNode` | Dynamic route view isolation wrapper preventing page crashes |
| `reportCrash()` | `(error: Error \| unknown, context?: { module?: string }) => void` | Programmatic telemetry crash report dispatcher |
| `onCrash()` | `(listener: CrashReportListener) => () => void` | Subscribes to runtime crash events |

---

## 🚀 Usage

```tsx
import { ModuleGuard, ErrorBoundary, reportCrash } from "@workspace/error"

// 1. Wrapping Dynamic Route Modules in Next.js (Constitutional Law 14)
export default function ObservatoryModulePage() {
  return (
    <ModuleGuard moduleId="OBSERVATORY_TELEMETRY">
      <ObservatoryView />
    </ModuleGuard>
  )
}

// 2. Programmatic Fault Logging in Custom Hooks
try {
  executeSensoryStream()
} catch (err) {
  reportCrash(err, { module: "SENSORY_SYNTHESIZER" })
}
```

---

## 🛡️ Architectural Boundaries
- Belongs to **Tier 2 (Core Infrastructure)**.
- May be imported by any Tier 3, 4, 5, or 6 package/application.

---

## 🧪 Verification
```bash
pnpm --filter @workspace/error typecheck
```
