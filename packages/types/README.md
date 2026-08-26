# @workspace/types

> **Canonical Domain Models, System Constants & Navigation Mesh for MoonWitness OS**

---

## 📦 Contents

### 1. Domain Types
- **`auth.types.ts`**: `UserProfile`, `UserRole`, `OperatorClearance`, `SessionState`.
- **`hadith.types.ts`**: `HadithEntry`, `HadithBook`, `SanadNode`.
- **`quran.types.ts`**: `QuranSurahItem`, `QuranAyahItem`, `TajweedRule`.
- **`celestial.types.ts`**: `MoonPhaseData`, `EclipseEvent`, `PrayerTimeItem`.

### 2. Navigation Mesh (`navigation.types.ts`)
- **`NAVIGATION_MESH`**: Master registry of all public portal routes and tactical command center endpoints with labels, icons, clearance levels, and active routes.

### 3. System Constants (`constants.ts`)
- **`DEFAULT_COORDINATES`**: Makkah Ka'bah, Madinah, Jerusalem, Jakarta, Cairo, Istanbul.
- **`APP_PORTS`**: Web (`3000`), Command Center (`3001`), API (`4000`).
- **`STORAGE_KEYS`**: Session tokens, user profiles, offline caches.
- **`SYSTEM_CONSTANTS`**: Version, codename, audio frequencies.

---

## 🚀 Usage

```tsx
import { 
  DEFAULT_COORDINATES, 
  STORAGE_KEYS, 
  NAVIGATION_MESH, 
  type HadithEntry 
} from "@workspace/types"
```