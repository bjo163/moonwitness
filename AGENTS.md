<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:moonwitness-core-rules -->
# MoonWitness OS - Architecture & Guidelines (V3.0)

## 1. Dual-Portal Monorepo System
Proyek ini menggunakan arsitektur dual-portal terisolasi:
- `apps/web/`: Public Cosmic Portal (Next.js 16, Port 3000) — Observatorium, Kitab Suci, Hadits, Seismix, Kalender Hijriyah, & Refleksi Global.
- `apps/command-center/`: Tactical Governance Terminal (Next.js 16, Port 3001) — Manajemen Hadits, Kitab, Pengguna, CAB RFC, & System Operations.
- `apps/api/`: Backend Service (Port 4000) — REST, RPC, dan Server-Sent Events (SSE).

## 2. Shared Workspace Packages
- `@workspace/ui`: Master Cosmic HUD Component Library, 3D Celestial Visualizers (`CelestialMoonSphere`, `CelestialQiblaCompass`, `CelestialEclipseSimulator`), `SeismicTectonicRadar`, `QuranRootMatrix`, dan Procedural Web Audio Synth (`cosmicAudio`).
- `@workspace/types`: Master domain models, constants (`DEFAULT_COORDINATES`, `STORAGE_KEYS`, `APP_PORTS`), dan master `NAVIGATION_MESH`.
- `@moon/client`: Universal typed API client, `useAuthSession` (Cross-App SSO), dan `useRealtimeStream` (SSE listener).

## 3. Anti-Monolithic Constraints
- File TIDAK BOLEH melebihi 400 baris (`max-lines: 400`). Jika membesar, ekstrak menjadi sub-komponen terpisah.
- Kedalaman *nesting* React JSX tidak boleh melebihi 6 level (`react/jsx-max-depth: 6`).

## 4. Estetika UI/UX (Deep Space Cosmic HUD)
- Tema: "Deep Space Sci-Fi Divine Operating System" — modern, futuristik, dengan *glassmorphism* (`backdrop-blur`), *glow effect* (`--cyber-*` tokens), dan sudut chamfered military box.
- Gunakan token warna semantik (`--cyber-cyan`, `--cyber-green`, `--cyber-yellow`, `--cyber-purple`, `--cyber-pink`).

## 5. Arsitektur Data Fetching & State
- JANGAN menulis *mock array/object* secara langsung (*inline*) di dalam komponen UI jika endpoint tersedia.
- Gunakan `@moon/client` (`fetchHadiths`, `fetchScriptures`, `useRealtimeStream`, `useAuthSession`) untuk seluruh komunikasi data.
<!-- END:moonwitness-core-rules -->