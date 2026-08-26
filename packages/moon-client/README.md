# @moon/client

> **Universal Isomorphic API, Auth SSO & Real-Time SSE Client for MoonWitness OS**

---

## 📦 Features

- **`apiClient`**: Configured Axios instance with automatic request/response interceptors, auth bearer injection, and error formatting.
- **`useAuthSession()`**: React hook for cross-app single sign-on (SSO), cookie sync (`mw_session`), and Operator Clearance RBAC.
- **`useRealtimeStream<T>()`**: Resilient Server-Sent Events (SSE) hook with automatic exponential backoff reconnects.
- **Typed Query Helpers**: `fetchHadiths()`, `fetchScriptures()`, `fetchDashboardData()`, `fetchUsers()`, `fetchPrayerTimes()`, `saveHadith()`, `saveScripture()`, and more.

---

## 🚀 Usage

```tsx
import { useAuthSession, useRealtimeStream, fetchHadiths } from "@moon/client"

// 1. Auth Hook
const { user, isAuthenticated, login, logout } = useAuthSession()

// 2. Realtime SSE Stream
const { data, isConnected } = useRealtimeStream("global_telemetry")

// 3. API Fetching
const hadiths = await fetchHadiths()
```