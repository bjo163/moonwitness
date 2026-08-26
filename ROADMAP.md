# MoonWitness Roadmap

Status: **Canonical high-level roadmap**.

Current release line: **Deep Space OS V3.0 & Dual-Portal Monorepo (v0.3.0)**. 
Dual-portal separation (`apps/web` on `:3000` & `apps/command-center` on `:3001`), shared UI engine (`@workspace/ui`), unified SSO & SSE client (`@moon/client`), and 3D celestial visualizers are fully completed and production-certified.

---

## 🏛️ Completed Foundation & UI Alignment Phases

### Phase 0 — Architecture Freeze ✅
- Branch flow (`feature` -> `dev` -> `main`) canonicalized.
- Model -> ORM -> Server -> Addon architecture established.

### Phase 1 & 2 — Moon ORM Correctness, Security & Cleanup ✅
- Transactional write boundary with fail-closed security.
- PostgreSQL `pgvector 0.8+` integration and Odoo-style relational magic tuples.

### Phase 3 & 4 — Moon Server & Base Addon Hardening ✅
- Thin transport boundary (`@moon/server`) with SSE/realtime lifecycle.
- Universal authentication and role-based access control.

### Phase 5, 6 & 7 — Witness Foundation, CAB & Mizan Addons ✅
- Canonical knowledge graph indexing revelation passages, historical figures, and transmission chains.
- Civilizational analytics (CAB) and ethical balance matrix (Mizan).

### Phase 8 — Web / UI Alignment & Deep Space OS V3.0 ✅
- **Dual-Portal App Separation**: `apps/web` (Portal on `:3000`) and `apps/command-center` (Operations Terminal on `:3001`).
- **Universal Shared Engine**: `@workspace/ui` (Cosmic HUD, 3D Moon/Qibla/Eclipse, Seismic Radar, Quran Root Matrix, Web Audio Synth) and `@workspace/types` (`NAVIGATION_MESH`).
- **Universal Client & SSO**: `@moon/client` (`useAuthSession`, `useRealtimeStream`, typed CRUD).
- **SEO Master Engine**: Automated `generateMetadata()` for dynamic routes.

---

## 🛰️ Active & Next Production Priorities

### Phase 9 — Global Knowledge Corpus Expansion & Epistemic Verification
- Automated ingestion pipelines for complete 9 Hadith compendiums (Kutubus Sittah + Musnad Ahmad, Muwatta, Sunan Ad-Darimi).
- Epistemic authority & provenance seal validation.

### Phase 10 — Production Certification & Cloud Deployments
- Multi-region Docker / Cloudflare edge containerization.
- Automated database backup & restore runbooks.
- Live telemetry health-check monitoring dashboards.