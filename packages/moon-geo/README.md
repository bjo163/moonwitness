# ◈ @moon/geo

```
╔══════════════════════════════════════════════════════════════════════════╗
║  PACKAGE:        @moon/geo                                               ║
║  SYSTEM VERSION: MoonWitness OS V9.0 (Divine Operating System Matrix)    ║
║  PKG VERSION:    9.0.0                                                   ║
║  CLASSIFICATION: TIER 3 — GEOSPATIAL & TECTONIC DATA ENGINE              ║
║  STATUS:         ████████████████████████████████ ACTIVE (SOVEREIGN)     ║
╚══════════════════════════════════════════════════════════════════════════╝
```

## 🌌 Overview
`@moon/geo` manages planetary coordinates, tectonic fault-line datasets, historical prophet migration routes (Sirah coordinates), and global seismic observation stations.

---

## 📦 Public API Surface

| Export | Type | Description |
|---|---|---|
| `DEFAULT_COORDINATES` | `Record<string, LatLng>` | Holy sanctuary coordinates (Makkah, Madinah, Jerusalem, Jakarta) |
| `SEISMIC_PLATES_REGISTRY` | `GeoJsonPolygon[]` | Major and minor continental tectonic boundary datasets |
| `calculateGreatCircleDistance()` | `(p1, p2) => number` | Haversine spherical distance between two points in km |
| `getNearestStation()` | `(lat, lng) => Station` | Resolves nearest active global monitoring node |

---

## 🚀 Usage

```typescript
import { DEFAULT_COORDINATES, calculateGreatCircleDistance } from "@moon/geo"

// 1. Calculate Distance from Jakarta to Makkah
const distanceKm = calculateGreatCircleDistance(
  DEFAULT_COORDINATES.JAKARTA,
  DEFAULT_COORDINATES.MAKKAH
)
console.log(`Distance to Ka'bah: ${distanceKm.toFixed(1)} km`)
```

---

## 🛡️ Architectural Boundaries
- Belongs to **Tier 3 (Domain Intelligence)**. Zero network dependencies.

---

## 🧪 Verification
```bash
pnpm --filter @moon/geo typecheck
```

## ??? View Configuration

This package exports declarative view manifests for the **Cosmic Matrix Engine** (src/views.ts):
- Introspected automatically by `@moon/server` at `GET /api/meta/model/:name`
- Rendered dynamically in Command Center via `<CosmicModelWorkspace model="..." />`
- Supported view modes: Kanban Pipeline, Sortable Table, Responsive Form Modal, and Activity Chatter.
