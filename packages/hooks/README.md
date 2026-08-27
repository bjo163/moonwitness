# ◈ @workspace/hooks

```
╔══════════════════════════════════════════════════════════════════════════╗
║  PACKAGE:        @workspace/hooks                                        ║
║  SYSTEM VERSION: MoonWitness OS V9.0 (Divine Operating System Matrix)    ║
║  PKG VERSION:    9.0.0                                                   ║
║  CLASSIFICATION: TIER 5 — UNIVERSAL REACT DATA & LIFECYCLE HOOKS         ║
║  STATUS:         ████████████████████████████████ ACTIVE (SOVEREIGN)     ║
╚══════════════════════════════════════════════════════════════════════════╝
```

## 🌌 Overview
`@workspace/hooks` exposes universal client hooks for data querying, state persistence, modal management, astronomical calculations, and DOM lifecycle utilities across the Next.js 16 portals.

---

## 📦 Public API Surface

| Hook | Parameters | Returns | Description |
|---|---|---|---|
| `useResource<T>()` | `fetcher: () => Promise<T>, options?: ResourceOptions` | `{ data, loading, error, mutate, reload }` | Reactive data query with auto-cache & optimistic mutations |
| `useModal<T>()` | `initialState?: boolean` | `{ isOpen, data, open, close, toggle }` | Standardized modal controller hook |
| `useComputedCelestial()` | `coords?: { lat, lng }` | `{ moonPhase, qiblaAngle, prayerTimes }` | Isomorphic pure astronomical telemetry hook |
| `useLocalStorage<T>()` | `key: string, defaultValue: T` | `[value, setValue, removeValue]` | Persistent localStorage synchronization with SSR safety |
| `useDebounce<T>()` | `value: T, delayMs: number` | `debouncedValue: T` | Value debounce delay hook |
| `useGeolocation()` | `options?: GeoOptions` | `{ coords, error, loading }` | Reactive device GPS coordinates provider |

---

## 🚀 Usage

```tsx
"use client"

import { useResource, useModal, useLocalStorage } from "@workspace/hooks"
import { fetchHadithList } from "@moon/client"
import { Modal } from "@workspace/ui"

export function HadithCatalog() {
  // 1. Fetching Data with Auto-Cache
  const { data: hadiths, loading } = useResource(
    () => fetchHadithList("bukhari", 1, 20),
    { storageKey: "hadith:bukhari:p1" }
  )

  // 2. Controlled Modal Hook
  const modal = useModal<{ id: number; title: string }>()

  // 3. Persistent Local Storage
  const [fontSize, setFontSize] = useLocalStorage("mw_reader_font_size", 16)

  return (
    <div>
      <button onClick={() => modal.open({ id: 1, title: "Sahih Bukhari #1" })}>
        Open Detail
      </button>

      <Modal isOpen={modal.isOpen} onClose={modal.close} title={modal.data?.title}>
        <p style={{ fontSize: `${fontSize}px` }}>Hadith text...</p>
      </Modal>
    </div>
  )
}
```

---

## 🛡️ Architectural Boundaries
- Belongs to **Tier 5 (React UI & State)**.
- Consumes `@workspace/types`, `@moon/client`, and `@moon/compute`.

---

## 🧪 Verification
```bash
pnpm --filter @workspace/hooks typecheck
```
