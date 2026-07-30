<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:moonwitness-core-rules -->
# MoonWitness OS - Architecture & Guidelines

## 1. Arsitektur Modular (Odoo-Style Plugin System)
Proyek ini menggunakan arsitektur modul *self-contained* terinspirasi dari Odoo.
- `@modules/[nama]/`: Setiap fitur/domain adalah modul mandiri. Folder ini berisi **manifest** (`index.ts`), **views**, **components**, dan **hooks** khusus modul tersebut.
- `@modules/index.ts`: Registry pusat semua modul. Satu baris per modul.
- `app/[route]/`: HANYA berisi logika *routing* Next.js (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`). Halaman mengimpor dari `@modules/`.
- `views/[domain]/`: *Legacy* — modul yang belum dimigrasikan ke `@modules/`. Akan dipindahkan bertahap.
- `components/shared/`: Berisi komponen yang dipakai di lebih dari satu modul (misal: *universal search*, *global modals*).

## 2. Batas Layer `@core` (Konsep seperti Vuexy)
Folder `@core` adalah fondasi utama OS yang bersifat *reusable*, modular, dan "headless". Layer ini tidak peduli dengan fitur bisnis spesifik.
- `@core/ui/`: Komponen UI murni/bodoh (Buttons, Cards, Inputs).
- `@core/widgets/`: *Dashboard widgets* yang sangat *cohesive*, harus dikelompokkan berdasarkan direktori (misal: `@core/widgets/monitoring/`).
- `@core/api/` & `@core/store/`: *State management* global dan layanan *fetching* data.
- `@core/layouts/` & `@core/shell/`: *Shell* navigasi dan tata letak global (Navbar, Sidebar).
- **Aturan Ketat**: Kode di dalam `@core` **DILARANG KERAS** mengimpor dari `@modules/`, `views/`, `app/`, atau `components/`. Panah dependensi hanya boleh mengarah ke dalam `@core`.

## 3. Anti-Monolithic Constraints
- File TIDAK BOLEH melebihi 400 baris (`max-lines: 400`). Jika membesar, ekstrak menjadi sub-komponen di dalam folder `components/` milik modul tersebut.
- Kedalaman *nesting* React JSX tidak boleh melebihi 6 level (`react/jsx-max-depth: 6`).

## 4. Estetika UI/UX
- Tema: "Cosmic Dashboard" — sangat modern, futuristik, dengan *glassmorphism* (`backdrop-blur`), *glow effect* (*drop-shadow*), dan UI bernuansa radar.
- Gunakan `THEME_TOKENS` dari `@core/tokens` untuk warna primer dan *string* merek (brand) jika memungkinkan.

## 5. Arsitektur Data Fetching
- JANGAN menulis *mock array/object* secara langsung (*inline*) di dalam komponen UI.
- Semua data harus diambil melalui klien `@core/api`.
- *Mock endpoints* ditangani secara mulus oleh *Axios interceptor* di `@core/api/client.ts` yang mengembalikan data dari `@core/db` (Fake DB).

## 6. Sistem Modul `@modules/` (defineModule Pattern)
- Setiap modul **wajib** mendaftarkan dirinya melalui `defineModule()` di file `@modules/[nama]/index.ts`.
- File manifest ini adalah **satu sumber kebenaran** (*Single Source of Truth*) untuk: navigasi (label, icon, href), routing (slug → komponen), dan metadata SEO.
- Untuk menambah halaman baru ke modul yang sudah ada, cukup: (1) buat view di `@modules/[nama]/views/`, (2) tambahkan 1 baris ke array `routes` di manifest.
- Registry pusat di `@modules/index.ts` menyediakan `buildGlobalNavigation()` yang digunakan oleh Navbar.
- **Dilarang** membuat file `module.config.ts` atau `module.registry.tsx` terpisah. Gunakan `defineModule()`.
<!-- END:moonwitness-core-rules -->
