# ◈ @moon/cache

```
╔══════════════════════════════════════════════════════════════════════════╗
║  PACKAGE:        @moon/cache                                             ║
║  SYSTEM VERSION: MoonWitness OS V9.0 (Divine Operating System Matrix)    ║
║  PKG VERSION:    9.0.0                                                   ║
║  CLASSIFICATION: TIER 2 — HIGH-SPEED IN-MEMORY & REDIS CACHE ENGINE      ║
║  STATUS:         ████████████████████████████████ ACTIVE (SOVEREIGN)     ║
╚══════════════════════════════════════════════════════════════════════════╝
```

## 🌌 Overview
`@moon/cache` provides high-throughput in-memory caching, microsecond telemetry key-value storage, LRU cache eviction algorithms, and optional Redis persistence for high-frequency astronomical ephemerides and knowledge queries.

---

## 📦 Public API Surface

| Class / Helper | Parameters | Description |
|---|---|---|
| `CacheManager` | `options?: CacheOptions` | Master key-value cache with TTL expiration |
| `createLruStore()` | `maxEntries: number` | Least Recently Used eviction memory store |
| `memoizeWithTtl()` | `fn: Function, ttlMs: number` | Wraps expensive async computations with caching |

---

## 🚀 Usage

```typescript
import { CacheManager, memoizeWithTtl } from "@moon/cache"

// 1. Instantiating Cache Store
const cache = new CacheManager({ defaultTtlMs: 60_000 })

// 2. Set & Get
cache.set("astro:moon:2026-08-27", { phase: 0.98, illumination: 99.4 })
const cachedMoon = cache.get("astro:moon:2026-08-27")

// 3. Memoizing Heavy Computation
const getCachedEphemeris = memoizeWithTtl(async (dateStr: string) => {
  return await calculateHeavyEphemeris(dateStr)
}, 300_000) // 5 minutes TTL
```

---

## 🛡️ Architectural Boundaries
- Belongs to **Tier 2 (Core Infrastructure)**.
- May be imported by Tier 3, 4, and 6 backend and service layers.

---

## 🧪 Verification
```bash
pnpm --filter @moon/cache typecheck
```
