# ◈ @workspace/eslint-config

```
╔══════════════════════════════════════════════════════════════════════════╗
║  PACKAGE:        @workspace/eslint-config                                ║
║  SYSTEM VERSION: MoonWitness OS V9.0 (Divine Operating System Matrix)    ║
║  PKG VERSION:    9.0.0                                                   ║
║  CLASSIFICATION: TIER 0 — MONOREPO CODE QUALITY & LINTING MATRIX         ║
║  STATUS:         ████████████████████████████████ ACTIVE (SOVEREIGN)     ║
╚══════════════════════════════════════════════════════════════════════════╝
```

## 🌌 Overview
`@workspace/eslint-config` provides the shared ESLint configurations, Next.js 16 boundary rules, unused import cleanups, and React 19 JSX depth checks across the 34 workspace projects.

---

## 📦 Preset Configurations

| Preset | Target Environment |
|---|---|
| `@workspace/eslint-config/base.js` | Universal Node.js / TypeScript libraries |
| `@workspace/eslint-config/next.js` | Next.js 16 portal applications |
| `@workspace/eslint-config/react-internal.js` | Internal React UI library packages |

---

## 🚀 Usage

In your project `eslint.config.js`:
```javascript
import baseConfig from "@workspace/eslint-config/base.js"

export default [
  ...baseConfig,
  {
    rules: {
      "max-lines": ["error", 400],
    },
  },
]
```

---

## 🛡️ Architectural Boundaries
- Belongs to **Tier 0 (Root Tooling)**.
