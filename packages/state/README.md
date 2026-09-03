# ◈ @workspace/state

```
╔══════════════════════════════════════════════════════════════════════════╗
║  PACKAGE:        @workspace/state                                        ║
║  SYSTEM VERSION: MoonWitness OS V9.0 (Divine Operating System Matrix)    ║
║  PKG VERSION:    9.0.0                                                   ║
║  CLASSIFICATION: TIER 5 — REACT GLOBAL STATE & ZUSTAND MATRIX            ║
║  STATUS:         ████████████████████████████████ ACTIVE (SOVEREIGN)     ║
╚══════════════════════════════════════════════════════════════════════════╝
```

## 🌌 Overview
`@workspace/state` manages reactive global state across portal modules using Zustand stores, including cosmic audio preferences, multi-portal telemetry streams, user reading bookmarks, and active language switching.

---

## 📦 Public API Surface

| Store / Hook | Description |
|---|---|
| `<MoonProvider />` | Master reactive context wrapper for Next.js app roots |
| `useSettingsStore()` | OS preferences (audio volume, optical glow effects, active theme) |
| `useTelemetryStore()` | Live SSE stream metrics, active client count, and sensor health |
| `useKnowledgeStore()` | Quran reading history, active surah index, and bookmarked hadiths |
| `useLanguage()` | Reactive locale getter/setter (`id`, `en`, `ar`) |

---

## 🚀 Usage

```tsx
"use client"

import { useSettingsStore, useLanguage } from "@workspace/state"

export function SystemSettingsToolbar() {
  const { soundEnabled, setSoundEnabled, glowIntensity } = useSettingsStore()
  const { language, setLanguage, t } = useLanguage()

  return (
    <div className="flex gap-4 p-4">
      <button onClick={() => setSoundEnabled(!soundEnabled)}>
        Audio Feedback: {soundEnabled ? "ON" : "OFF"}
      </button>

      <button onClick={() => setLanguage(language === "id" ? "en" : "id")}>
        Locale: {language.toUpperCase()}
      </button>
    </div>
  )
}
```

---

## 🛡️ Architectural Boundaries
- Belongs to **Tier 5 (React UI & State)**.
- Consumes `@workspace/types`.

---

## 🧪 Verification
```bash
pnpm --filter @workspace/state typecheck
```
