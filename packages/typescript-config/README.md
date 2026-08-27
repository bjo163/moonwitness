# ◈ @workspace/typescript-config

```
╔══════════════════════════════════════════════════════════════════════════╗
║  PACKAGE:        @workspace/typescript-config                            ║
║  SYSTEM VERSION: MoonWitness OS V9.0 (Divine Operating System Matrix)    ║
║  PKG VERSION:    9.0.0                                                   ║
║  CLASSIFICATION: TIER 0 — MONOREPO COMPILER OPTIONS & CONFIG MATRIX      ║
║  STATUS:         ████████████████████████████████ ACTIVE (SOVEREIGN)     ║
╚══════════════════════════════════════════════════════════════════════════╝
```

## 🌌 Overview
`@workspace/typescript-config` provides the shared compiler options, path mappings, module resolutions, and strict typing configurations across the 34 workspace projects.

---

## 📦 Preset Configurations

| Configuration | Target Scope |
|---|---|
| `base.json` | Core TypeScript libraries, Node.js engines, and pure math modules |
| `nextjs.json` | Next.js 16 portals (`apps/web`, `apps/command-center`) |
| `react-library.json` | Internal React UI component libraries (`@workspace/ui`, `@workspace/hooks`) |

---

## 🚀 Usage

In your project `tsconfig.json`:
```json
{
  "extends": "@workspace/typescript-config/base.json",
  "compilerOptions": {
    "rootDir": "./src",
    "outDir": "./dist"
  },
  "include": ["src/**/*"]
}
```

---

## 🛡️ Architectural Boundaries
- Belongs to **Tier 0 (Root Tooling)**.
