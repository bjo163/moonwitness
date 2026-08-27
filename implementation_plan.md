# 🏛️ GOD-LEVEL BLUEPRINT: MoonWitness Package Architecture V4.0

```
╔══════════════════════════════════════════════════════════════════════════════╗
║  CLASSIFICATION:  SUPREME ARCHITECTURE DIRECTIVE                            ║
║  CODENAME:        DIAMOND GRAPH                                             ║
║  OBJECTIVE:       ZERO APP-LOCAL CODE — EVERYTHING IN packages/             ║
║  SCOPE:           ALL 3 APPS + ALL 24 PACKAGES + DESIGN BIBLE               ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

---

## 🧠 FUNDAMENTAL INSIGHT: Mengapa Blueprint Sebelumnya Kurang Deep

Blueprint sebelumnya cuma **memindahkan file** — itu bukan arsitektur. Itu pekerjaan rumah.

**Masalah sesungguhnya:**

1. **`@workspace/ui` dijadikan tempat sampah** — hooks, stores, contexts, widgets, tokens semua dimasukkan ke satu package. Itu bukan centralization, itu **trash can architecture**.

2. **`@moon/client` cuma HTTP wrapper** — padahal sudah ada `useMoonModel`, `useGlobalMonitoring`, `useObservatoryData` yang seharusnya jadi bagian dari SDK yang lebih kaya.

3. **Tidak ada separasi concern** — UI (visual), State (logika), Hooks (utility), i18n (bahasa) semua tercampur. Ketika web berubah, command-center ikut rebuild.

4. **Backend punya addon system (`@moon/witness`, `@moon/cab`, `@moon/mizan`) tapi frontend tidak mirror itu** — seharusnya ada simetri full-stack.

5. **Tidak ada cross-portal communication** — kedua app berjalan di tab berbeda tapi tidak bisa saling broadcast event (login sync, notification relay).

---

## 💎 THE DIAMOND DEPENDENCY GRAPH

```
                         ┌──────────────┐
                         │  APPLICATIONS │
                         └──────┬───────┘
                                │
              ┌─────────────────┼─────────────────┐
              │                 │                 │
        ┌─────▼─────┐   ┌──────▼──────┐   ┌──────▼──────┐
        │  apps/web  │   │ apps/cmd-ctr │   │  apps/api   │
        │  (port 3K) │   │  (port 3.1K) │   │  (port 4K)  │
        └─────┬──────┘   └──────┬───────┘   └──────┬──────┘
              │                 │                   │
              │    ┌────────────┴────────────┐      │
              │    │  FRONTEND SDK LAYER     │      │
              │    └────────────┬────────────┘      │
              │                 │                   │
        ┌─────┴─────────────────┴──────────┐        │
        │                                  │        │
   ┌────▼────┐  ┌──────────┐  ┌────────┐  │   ┌────▼─────────┐
   │@workspace│  │@workspace│  │  @moon │  │   │ BACKEND SDK  │
   │ /state   │  │ /i18n    │  │/client │◄─┤   │    LAYER     │
   └────┬─────┘  └────┬─────┘  └────┬───┘  │   └──────┬───────┘
        │              │             │      │          │
        │    ┌─────────┴─────────────┘      │   ┌──────┴───────┐
        │    │                              │   │@moon/server  │
        ▼    ▼                              │   │@moon/orm     │
   ┌─────────────┐  ┌───────────────┐       │   │@moon/witness │
   │ @workspace  │  │  @workspace   │       │   │@moon/base    │
   │    /ui      │  │   /hooks      │       │   │@moon/cab     │
   │ (VISUAL     │  │ (PURE LOGIC   │       │   │@moon/geo     │
   │  ONLY)      │  │  ONLY)        │       │   │@moon/time    │
   └──────┬──────┘  └───────┬───────┘       │   │  ...etc      │
          │                 │               │   └──────────────┘
          └────────┬────────┘               │
                   │                        │
            ┌──────▼──────┐                 │
            │ @workspace  │◄────────────────┘
            │   /types    │
            │ (ZERO DEPS) │
            └─────────────┘
```

**Aturan Diamond:**
- `@workspace/types` = **LEAF** — zero dependency, dipakai oleh SEMUA package
- `@workspace/hooks` = **PURE LOGIC** — React hooks tanpa visual, dipakai oleh UI dan State
- `@workspace/ui` = **VISUAL ONLY** — komponen + widgets, TANPA store, TANPA fetch logic
- `@workspace/state` = **STATE ENGINE** — Zustand stores + React contexts/providers
- `@workspace/i18n` = **BAHASA** — multilingual engine (id/en/ar)
- `@moon/client` = **FULL SDK** — bukan sekadar HTTP, tapi termasuk `useMoonModel`, domain services, SSE

---

## 📦 Package Restructuring (Detail Per-Package)

### 1. `@workspace/types` — The Foundation (TIDAK BERUBAH BANYAK)

```
packages/types/src/
├── constants.ts          ← SYSTEM_CONSTANTS, STORAGE_KEYS, APP_PORTS
├── navigation.types.ts   ← NAVIGATION_MESH
├── user.types.ts         ← UserProfile, UserRole, OperatorClearance
├── system.types.ts       ← SystemStatus, TelemetryState
├── monitoring.types.ts   ← [BARU] EarthquakeFeature, GlobalCityPrayer, dll
├── gamification.types.ts ← [BARU] AchievementDef, QuestDef, GuildDef
├── notification.types.ts ← [BARU] NotificationType, NotificationItem
├── scripture.types.ts    ← [BARU] ScriptureVerse, HadithItem, AsmaulHusna
└── index.ts
```

**Prinsip:** Setiap domain punya file types sendiri. Tipe yang dipakai oleh lebih dari 1 package/app = HARUS di sini.

---

### 2. `@workspace/hooks` — Pure Logic Hooks (BARU!)

```
packages/hooks/
├── package.json          ← name: "@workspace/hooks"
├── tsconfig.json
└── src/
    ├── use-mounted.ts          ← SSR-safe mount check
    ├── use-debounce.ts         ← Debounce values
    ├── use-clipboard.ts        ← Copy to clipboard
    ├── use-local-storage.ts    ← Typed localStorage
    ├── use-media-query.ts      ← Responsive breakpoints
    ├── use-geolocation.ts      ← Browser geolocation + cache
    ├── use-konami.ts           ← Easter egg key sequence
    ├── use-nasa-feeds.ts       ← NASA APOD/NEO fetch
    ├── use-keyboard-shortcut.ts ← [BARU] Keyboard shortcut registry
    └── index.ts
```

**Mengapa package terpisah?**
- Hooks ini **zero dependency pada UI** — mereka tidak import komponen apapun
- Bisa dipakai di `apps/web`, `apps/command-center`, bahkan di unit tests
- `@workspace/ui` bisa IMPORT dari sini, tapi TIDAK sebaliknya (no circular dep)

---

### 3. `@workspace/state` — State Engine (BARU!)

```
packages/state/
├── package.json          ← name: "@workspace/state", deps: [zustand, @workspace/types]
├── tsconfig.json
└── src/
    ├── stores/
    │   ├── os-store.ts             ← System status, clock, radar, scanline
    │   ├── notification-store.ts   ← Notification queue + persistence
    │   ├── bookmark-store.ts       ← Universal bookmarks
    │   ├── achievement-store.ts    ← Gamification state
    │   ├── guild-store.ts          ← Guild leaderboard state
    │   ├── quest-store.ts          ← Quest progress state
    │   ├── insight-store.ts        ← AI insight state
    │   └── graph-store.ts          ← Knowledge graph UI state
    │
    ├── providers/
    │   ├── toast-provider.tsx       ← Global toast system (HUD-styled)
    │   ├── audio-provider.tsx       ← Quran audio playback (Howler)
    │   ├── theme-provider.tsx       ← Dark/light/system theme
    │   ├── language-provider.tsx    ← id/en/ar language context
    │   └── moon-provider.tsx        ← [BARU] Master provider (composes all above)
    │
    ├── bus/
    │   ├── cross-portal-bus.ts      ← [BARU] BroadcastChannel cross-tab sync
    │   └── event-types.ts           ← [BARU] Typed event contracts
    │
    └── index.ts
```

**Mengapa package terpisah?**
- Stores itu **business logic**, bukan visual. Memasukkan ke `@workspace/ui` melanggar SRP.
- `MoonProvider` = satu wrapper yang menggabungkan SEMUA providers. App cukup pasang `<MoonProvider>` di root layout.
- `CrossPortalBus` = **BroadcastChannel API** untuk sync antar tab:
  ```ts
  // apps/web: user login
  crossPortalBus.emit("AUTH_SESSION_CHANGE", { user, token })

  // apps/command-center: mendengarkan
  crossPortalBus.on("AUTH_SESSION_CHANGE", (data) => {
    // auto-login di tab command-center
  })
  ```

---

### 4. `@workspace/i18n` — Internationalization Engine (BARU!)

```
packages/i18n/
├── package.json          ← name: "@workspace/i18n"
├── tsconfig.json
└── src/
    ├── engine.ts               ← useI18n() hook + t() function
    ├── locales/
    │   ├── en.ts               ← English translations
    │   ├── id.ts               ← Indonesian translations
    │   └── ar.ts               ← Arabic translations
    ├── hijri.ts                ← [BARU] Hijri month names (id/en/ar)
    ├── system-labels.ts        ← [BARU] "SYNCHRONIZING...", "SIGNAL LOST", dll
    └── index.ts
```

**Mengapa?**
- Saat ini `useLanguage` di `@core/contexts` dan `useI18n` di `@core/hooks` itu **duplikat konsep**
- Semua string OS-style ("OPERATION COMPLETE", "TERMINATE SESSION") harus tersentralisasi
- Arabic text rendering rules juga di sini

---

### 5. `@moon/client` — Full-Stack Frontend SDK (UPGRADE BESAR)

```
packages/moon-client/src/
├── api-client.ts           ← Axios instance + interceptors (sudah ada)
├── endpoints.ts            ← CRUD helpers (sudah ada)
├── auth.ts                 ← useAuthSession, login/logout (sudah ada)
├── realtime-client.ts      ← MoonClient SSE class (sudah ada)
├── realtime-stream.ts      ← useRealtimeStream hook (sudah ada)
│
├── hooks/                  ← [BARU] Domain-specific data hooks
│   ├── use-moon-model.ts       ← Generic CRUD hook (dari @core/hooks)
│   ├── use-observatory-data.ts ← Moon phase, prayer, sun data
│   ├── use-global-monitoring.ts ← USGS quake, aviation, maritime, cyber
│   └── use-user-profile.ts     ← Profile CRUD via API
│
├── services/               ← [BARU] Domain service layer
│   ├── astronomy-service.ts    ← getMoonPhase(), getEclipses()
│   ├── islamic-service.ts      ← getPrayerTimes(), getIslamicDate()
│   ├── system-service.ts       ← getSystemHealth()
│   └── scripture-service.ts    ← [BARU] getVerses(), searchHadiths()
│
├── utils/                  ← [BARU] Computation utilities
│   ├── lunar-phase.ts          ← Client-side moon calculation (Jean Meeus)
│   ├── sun-position.ts         ← Solar altitude + Duha calculator
│   ├── hadith-cleaner.ts       ← Arabic text sanitization
│   ├── offline-sync.ts         ← Service worker sync helper
│   └── sound-feedback.ts       ← Audio feedback utility
│
└── index.ts                ← Export EVERYTHING
```

**Key insight:** `@moon/client` bukan sekadar HTTP wrapper — ini adalah **Frontend SDK lengkap** yang mirror backend addons. Sama seperti `@moon/witness` punya models + routes + services di backend, `@moon/client` punya hooks + services + utils di frontend.

---

### 6. `@workspace/ui` — VISUAL ONLY (Diperkuat, Bukan Dijadikan Tempat Sampah)

```
packages/ui/src/
├── tokens/
│   └── theme-tokens.ts      ← SATU-SATUNYA sumber tokens (sudah ada)
│
├── components/              ← 83 primitives (sudah ada, TETAP)
│   ├── panel.tsx
│   ├── modal.tsx
│   ├── data-table.tsx
│   ├── button.tsx
│   ├── tabs.tsx
│   ├── badge.tsx
│   ├── breadcrumb.tsx
│   ├── context-block.tsx
│   ├── states.tsx
│   ├── toast.tsx
│   ├── progress.tsx
│   ├── tooltip.tsx
│   ├── celestial-moon-sphere.tsx
│   ├── celestial-qibla-compass.tsx
│   ├── celestial-eclipse-simulator.tsx
│   ├── seismic-tectonic-radar.tsx
│   ├── quran-root-matrix.tsx
│   └── ...
│
├── widgets/                 ← [BARU] Domain composite widgets (VISUAL ONLY)
│   ├── monitoring/
│   │   ├── global-status-widget.tsx
│   │   ├── root-cause-widget.tsx
│   │   ├── aviation-traffic-widget.tsx
│   │   ├── climate-widget.tsx
│   │   ├── cyber-threat-widget.tsx
│   │   ├── financial-markets-widget.tsx
│   │   ├── maritime-traffic-widget.tsx
│   │   ├── planetary-seismic-widget.tsx
│   │   ├── space-weather-widget.tsx
│   │   ├── prayer-network-widget.tsx
│   │   ├── digital-consciousness-widget.tsx
│   │   ├── social-media-trends-widget.tsx
│   │   ├── trending-topics-widget.tsx
│   │   ├── population-widget.tsx
│   │   └── live-world-map-widget.tsx
│   ├── intelligence/
│   │   ├── intel-briefing-widget.tsx
│   │   ├── khidra-command-widget.tsx
│   │   └── recommendation-engine-widget.tsx
│   ├── management/
│   │   ├── action-center-widget.tsx
│   │   ├── mission-command-widget.tsx
│   │   ├── project-portfolio-widget.tsx
│   │   └── task-center-widget.tsx
│   ├── gamification/
│   │   ├── achievement-widget.tsx
│   │   ├── guild-leaderboard-widget.tsx
│   │   └── quest-widget.tsx
│   ├── knowledge/
│   │   ├── global-ticker-widget.tsx
│   │   └── verse-insight-tooltip.tsx
│   ├── khidra/
│   │   ├── khidra-hologram-stage.tsx
│   │   ├── khidra-identity-panel.tsx
│   │   └── khidra-telemetry-dock.tsx
│   ├── graph/
│   │   ├── graph-canvas-widget.tsx
│   │   ├── graph-analytics-widget.tsx
│   │   ├── graph-entity-panel-widget.tsx
│   │   └── graph-sidebar-widget.tsx
│   ├── auth/
│   │   ├── auth-terminal-widget.tsx
│   │   ├── auth-flow.tsx
│   │   └── auth-substeps.tsx
│   ├── search/
│   │   ├── global-search-modal.tsx
│   │   └── universal-search-client.tsx
│   ├── notification/
│   │   └── notification-bell.tsx
│   ├── onboarding/
│   │   └── onboarding-wizard.tsx
│   ├── orbit-orrery-widget.tsx
│   ├── qibla-radar-widget.tsx
│   ├── qibla-map-widget.tsx
│   ├── flying-prophetic-ai-widget.tsx
│   ├── global-prayer-wall-widget.tsx
│   ├── global-unity-telemetry-widget.tsx
│   └── adhan-notification-widget.tsx
│
├── hud/                     ← HUD-specific compositions (sudah ada sebagian)
│
├── lib/
│   └── utils.ts             ← cn() dan helper
│
└── index.ts                 ← Export components + widgets + tokens
```

**Aturan ketat `@workspace/ui`:**
- ✅ Import dari `@workspace/types` (tipe)
- ✅ Import dari `@workspace/hooks` (useMounted, useDebounce)
- ✅ Import dari `@workspace/state` (useNotificationStore, useToast)
- ✅ Import dari `@moon/client` (useAuthSession, useMoonModel, API calls)
- ❌ TIDAK BOLEH mendefinisikan hooks sendiri (pindah ke `@workspace/hooks`)
- ❌ TIDAK BOLEH mendefinisikan stores sendiri (pindah ke `@workspace/state`)
- ❌ TIDAK BOLEH mendefinisikan providers sendiri (pindah ke `@workspace/state`)

---

## 🔄 Dependency Rules (Inviolable)

```
DEPENDENCY DIRECTION (top → bottom = allowed, bottom → top = FORBIDDEN)

  apps/web  ←────────────────────────────→  apps/command-center
     │                                          │
     └──────────┬───────────────────────────────┘
                │
                ▼
     ┌──────────────────────────────────────┐
     │  @workspace/ui       (visual only)   │ ← Widgets import hooks/state/client
     │  @workspace/state    (stores/ctx)    │ ← Stores import types/hooks
     │  @workspace/i18n     (translations)  │ ← i18n imports types
     │  @moon/client        (SDK)           │ ← SDK imports types
     └──────────┬───────────────────────────┘
                │
                ▼
     ┌──────────────────────────────────────┐
     │  @workspace/hooks   (pure logic)     │ ← Hooks import types only
     └──────────┬───────────────────────────┘
                │
                ▼
     ┌──────────────────────────────────────┐
     │  @workspace/types   (ZERO deps)      │ ← Foundation
     └──────────────────────────────────────┘
```

**Rules:**
1. `@workspace/types` → imports NOTHING
2. `@workspace/hooks` → imports ONLY `@workspace/types`
3. `@workspace/i18n` → imports ONLY `@workspace/types`
4. `@moon/client` → imports `@workspace/types` + `@workspace/hooks`
5. `@workspace/state` → imports `@workspace/types` + `@workspace/hooks` + `@moon/client`
6. `@workspace/ui` → imports ALL above (CONSUMER layer)
7. `apps/*` → imports ALL above (APPLICATION layer)
8. **NEVER** circular: UI → State → UI ❌

---

## 🏗️ Hasil Akhir: App Skeleton

### `apps/web/` — Cosmic Portal (THIN SHELL)

```
apps/web/
├── app/                    ← Next.js routing ONLY
│   ├── layout.tsx              wraps <MoonProvider> from @workspace/state
│   ├── page.tsx
│   └── [modules]/page.tsx
├── components/
│   └── shell/              ← APP-SPECIFIC layout (NOT reusable)
│       ├── navbar.tsx          (web-specific nav with cosmic DNA)
│       ├── taskbar.tsx         (web-specific bottom bar)
│       └── footer-console.tsx
├── lib/
│   └── data/               ← Mock data for development
│       ├── prophetic-events.db.ts
│       └── knowledge-graph.db.ts
└── views/                  ← Domain views (JUST composition)
    ├── observatory/
    ├── knowledge/
    ├── mission/
    └── seismix/
```

### `apps/command-center/` — Tactical Terminal (THIN SHELL)

```
apps/command-center/
├── app/
│   ├── layout.tsx          ← wraps <MoonProvider> from @workspace/state
│   └── [routes]/page.tsx
├── components/
│   └── shell/              ← APP-SPECIFIC
│       └── command-center-navbar.tsx
├── lib/
│   └── data/
└── views/
    ├── dashboard-view.tsx
    ├── hadiths-view.tsx
    └── ...
```

**Perhatikan:** ZERO `@core/` di kedua app. ZERO hooks/stores/contexts/widgets lokal. SEMUANYA import dari packages.

---

## ⚡ Cross-Portal Communication (New Capability)

```ts
// packages/state/src/bus/cross-portal-bus.ts

type PortalEvents = {
  AUTH_SESSION_CHANGE: { user: UserProfile; token: string }
  AUTH_LOGOUT: {}
  NOTIFICATION_PUSH: { notification: NotificationItem }
  BOOKMARK_SYNC: { bookmarks: BookmarkItem[] }
  SYSTEM_STATUS_CHANGE: { status: SystemStatus }
  ACHIEVEMENT_UNLOCKED: { achievementId: string }
}

const channel = new BroadcastChannel("moonwitness_os")

export const crossPortalBus = {
  emit<K extends keyof PortalEvents>(event: K, data: PortalEvents[K]) {
    channel.postMessage({ event, data, timestamp: Date.now() })
  },
  on<K extends keyof PortalEvents>(event: K, handler: (data: PortalEvents[K]) => void) {
    channel.addEventListener("message", (e) => {
      if (e.data?.event === event) handler(e.data.data)
    })
  }
}
```

**Efek:**
- Login di web → otomatis login di command-center (same tab session)
- Admin push notification di command-center → muncul di web portal
- Bookmark di web → sync ke command-center dashboard
- Achievement unlock → broadcast ke semua portal

---

## 📊 Impact Matrix

| Metrik | Sekarang | Sesudah |
|--------|----------|---------|
| Frontend packages | 3 (`ui`, `types`, `client`) | **7** (`ui`, `types`, `client`, `hooks`, `state`, `i18n`, `auto-avatar`) |
| `@core` directories | 1 (158 files) | **0** |
| App-local reusable code | ~160 files | **0** (semuanya di packages/) |
| Auth state sources | 2 (`useMoonStore` + `useAuthSession`) | **1** (`useAuthSession`) |
| Provider wrapping | 4 manual wraps per app | **1** (`<MoonProvider>`) |
| Cross-portal sync | None | **BroadcastChannel** |
| Import sources per app | 6+ (`@core/*` variants) | **5** (`@workspace/ui`, `@workspace/types`, `@workspace/hooks`, `@workspace/state`, `@moon/client`) |
| i18n sources | 2 (`useLanguage` + `useI18n`) | **1** (`@workspace/i18n`) |
| Circular dependency risk | High | **Zero** (enforced by diamond graph) |
| Build granularity | Monolithic | **Incremental** (change hooks → only rebuild hooks + dependents) |

---

## 📋 Execution Order

```
PHASE 1: FOUNDATION (New Packages)
├── 1a. Create @workspace/hooks (extract 8 generic hooks)
├── 1b. Create @workspace/state (extract 9 stores + 4 providers)
├── 1c. Create @workspace/i18n (extract useLanguage + translations)
└── 1d. Upgrade @moon/client (add hooks/, services/, utils/)

PHASE 2: CONTENT MIGRATION
├── 2a. Move 57 widgets → @workspace/ui/widgets/
├── 2b. Move domain types → @workspace/types
├── 2c. Delete @core/tokens, @core/ui, @core/table, @core/sidebar, @core/types (duplicates)
└── 2d. Move @core/shell → apps/web/components/shell/

PHASE 3: MASS IMPORT REWRITE
├── 3a. Rewrite ~200 import statements across apps/web/views/
├── 3b. Update apps/web/app/layout.tsx → use <MoonProvider>
├── 3c. Remove @core path alias from tsconfig.json
└── 3d. rm -rf apps/web/@core/

PHASE 4: CROSS-PORTAL & POLISH
├── 4a. Implement CrossPortalBus (BroadcastChannel)
├── 4b. Wire auth sync between portals
├── 4c. Update AGENTS.md Design Bible with new package rules
└── 4d. Build verification + typecheck
```

---

> **Ini bukan sekadar refactoring. Ini adalah transformasi dari "monorepo dengan sampah lokal" menjadi "platform engineering yang sesungguhnya."**
>
> Setelah ini selesai, menambahkan app ke-4 (misalnya mobile PWA, admin analytics, atau public API docs) hanya butuh `import { everything } from "@workspace/*"` — zero duplication, zero @core, zero redundancy.
