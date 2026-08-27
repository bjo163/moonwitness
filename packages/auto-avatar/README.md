# ◈ @workspace/auto-avatar

```
╔══════════════════════════════════════════════════════════════════════════╗
║  PACKAGE:        @workspace/auto-avatar                                  ║
║  SYSTEM VERSION: MoonWitness OS V9.0 (Divine Operating System Matrix)    ║
║  PKG VERSION:    9.0.0                                                   ║
║  CLASSIFICATION: TIER 5 — PROCEDURAL GEOMETRIC AVATAR GENERATOR          ║
║  STATUS:         ████████████████████████████████ ACTIVE (SOVEREIGN)     ║
╚══════════════════════════════════════════════════════════════════════════╝
```

## 🌌 Overview
`@workspace/auto-avatar` generates deterministic, multi-layered geometric vector SVG avatars for operators, scholars, and celestial observation nodes without external network requests or image asset dependencies.

---

## 📦 Public API Surface

| Component / Function | Props / Arguments | Description |
|---|---|---|
| `<AutoAvatar />` | `seed: string, size?: number, className?: string` | React component rendering procedural SVG avatar |
| `generateAvatarSvg()` | `seed: string, options?: AvatarOptions` | Pure function returning raw SVG markup string |

---

## 🚀 Usage

```tsx
"use client"

import { AutoAvatar } from "@workspace/auto-avatar"

export function OperatorBadge({ operatorName }: { operatorName: string }) {
  return (
    <div className="flex items-center gap-3 p-2 bg-black/40 border border-primary/20 rounded">
      <AutoAvatar seed={operatorName} size={40} className="rounded-full ring-1 ring-primary/40" />
      <span className="font-mono text-xs text-primary uppercase">{operatorName}</span>
    </div>
  )
}
```

---

## 🛡️ Architectural Boundaries
- Belongs to **Tier 5 (React UI Primitives)**.
- 100% isomorphic and offline.

---

## 🧪 Verification
```bash
pnpm --filter @workspace/auto-avatar typecheck
```
