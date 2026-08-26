# MoonWitness Cosmic HUD (`apps/web`)

The Next.js 15 frontend application for MoonWitness OS, crafted with a **Deep Space Sci-Fi Divine Observation Terminal** aesthetic.

---

## Architectural Principles

- **Odoo-Style Modular System (`@modules/`)**: Self-contained business domains registering navigation, routing, and metadata via `defineModule()`.
- **Cosmic HUD Design System**: Dark smoked glass (`backdrop-blur`), chamfered military clip-paths, laser data conduits, Orbitron typography, and telemetry scanlines.
- **Pure Headless Core (`@core/`)**: Headless UI, widgets, state management, and shell navigation isolated from business logic.

---

## Commands

```bash
# Start Next.js development server
pnpm dev

# Build production bundle
pnpm build

# Start production server
pnpm start
```
