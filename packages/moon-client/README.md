# ◈ @moon/client

```
╔══════════════════════════════════════════════════════════════════════════╗
║  PACKAGE:        @moon/client                                            ║
║  SYSTEM VERSION: MoonWitness OS V9.0 (Divine Operating System Matrix)    ║
║  PKG VERSION:    9.0.0                                                   ║
║  CLASSIFICATION: TIER 4 — UNIVERSAL ISOMORPHIC API CLIENT & SSE STREAMS  ║
║  STATUS:         ████████████████████████████████ ACTIVE (SOVEREIGN)     ║
╚══════════════════════════════════════════════════════════════════════════╝
```

> **Universal Isomorphic API, Auth SSO & Real-Time SSE Client for MoonWitness OS**

---

## 📦 Features

- **`apiClient`**: Configured Axios instance with automatic request/response interceptors, auth bearer injection, and error formatting.
- **`useAuthSession()`**: React hook for cross-app single sign-on (SSO), cookie sync (`mw_session`), and Operator Clearance RBAC.
- **`useCosmicTelemetry<K>()`**: Strongly-typed Server-Sent Events (SSE) subscriber binding to `@moon/protocol` topics (`system_metric`, `chat_global`, `prayer_alert`, `module_update`).
- **`useRealtimeStream<T>()`**: Resilient SSE hook with automatic exponential backoff reconnects.
- **Typed Query Helpers**: `fetchHadiths()`, `fetchHadithList()`, `fetchScriptures()`, `fetchAsmaulHusna()`, `fetchDashboardData()`, `fetchUsers()`, `fetchPrayerTimes()`, `saveHadith()`, `saveScripture()`, and more.

---

## 🚀 Usage

```tsx
import { 
  useAuthSession, 
  useCosmicTelemetry, 
  fetchHadithList 
} from "@moon/client"

// 1. Auth Hook
const { user, isAuthenticated, login, logout } = useAuthSession()

// 2. Strongly-Typed Realtime Telemetry
const { payload, isConnected } = useCosmicTelemetry("system_metric")

// 3. Typed API Fetching
const hadithData = await fetchHadithList("bukhari", 1, 10)
```

---

## 🛡️ Architectural Boundaries
- Belongs to **Tier 4 (Client Layer)**.
- Consumes `@workspace/types` and `@moon/protocol`.

---

## 🧪 Verification
```bash
pnpm --filter @moon/client typecheck
```