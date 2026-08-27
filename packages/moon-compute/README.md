# ◈ @moon/compute

```
╔══════════════════════════════════════════════════════════════════════════╗
║  PACKAGE:        @moon/compute                                           ║
║  SYSTEM VERSION: MoonWitness OS V9.0 (Divine Operating System Matrix)    ║
║  PKG VERSION:    9.0.0                                                   ║
║  CLASSIFICATION: TIER 1 — PURE ISOMORPHIC ASTRONOMICAL ENGINE            ║
║  STATUS:         ████████████████████████████████ ACTIVE (SOVEREIGN)     ║
╚══════════════════════════════════════════════════════════════════════════╝
```

## 🌌 Overview
`@moon/compute` is the zero-network, zero-database isomorphic mathematical engine of MoonWitness OS. It provides pure mathematical algorithms for solar/lunar ephemeris, moon phase calculation, Hijri calendar synchronizations, Ka'bah Great Circle Qibla geodesic azimuths, and astronomical prayer time determination.

---

## 📦 Public API Surface

| Function | Parameters | Return Type | Description |
|---|---|---|---|
| `getMoonPhase()` | `date?: Date` | `MoonPhaseResult` | Calculates illumination fraction (0-1), moon age, and phase name |
| `getDailyPrayerTimes()` | `lat: number, lng: number, date?: Date` | `PrayerTimesResult` | Computes exact Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha |
| `getQiblaDirection()` | `lat: number, lng: number` | `QiblaResult` | Computes Great Circle azimuth angle relative to True North |
| `getSunPosition()` | `lat: number, lng: number, date?: Date` | `SunPositionResult` | Altitude and azimuth of the Sun |
| `gregorianToHijri()` | `date: Date` | `HijriDateResult` | Astronomical lunar calendar conversion |

---

## 🚀 Usage

```typescript
import {
  getMoonPhase,
  getDailyPrayerTimes,
  getQiblaDirection,
  gregorianToHijri
} from "@moon/compute"

// 1. Calculate Real-Time Moon Phase
const moon = getMoonPhase(new Date())
console.log(`Moon phase: ${moon.phaseName}, Illumination: ${(moon.fraction * 100).toFixed(1)}%`)

// 2. Compute Prayer Times for Jakarta (Lat: -6.2088, Lng: 106.8456)
const prayers = getDailyPrayerTimes(-6.2088, 106.8456, new Date())
console.log(`Fajr: ${prayers.fajr}, Maghrib: ${prayers.maghrib}`)

// 3. Calculate Qibla Azimuth
const qibla = getQiblaDirection(-6.2088, 106.8456)
console.log(`Qibla Bearing: ${qibla.bearing.toFixed(2)}° from True North`)

// 4. Convert Date to Hijri
const hijri = gregorianToHijri(new Date())
console.log(`Date: ${hijri.day} ${hijri.monthName} ${hijri.year} AH`)
```

---

## 🛡️ Pure Mathematical Covenant (Law 15 / BE-05)
- **ZERO Network I/O**: No `fetch`, no HTTP sockets, 0ms network latency.
- **ZERO Database Access**: Pure deterministic mathematics (Meeus astronomical formulas).
- **Edge Case Resilience**: Extreme polar latitudes and leap years handled safely without throwing NaN.

---

## 🧪 Verification
```bash
pnpm --filter @moon/compute test
```
