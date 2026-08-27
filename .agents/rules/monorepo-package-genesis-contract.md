# ◈ THE SOVEREIGN MONOREPO PACKAGE GENESIS CONTRACT (V9.0)

```
╔══════════════════════════════════════════════════════════════════════════╗
║  CLASSIFICATION: ARCHITECTURAL LAW — SUPREME COVENANT                    ║
║  SYSTEM:         MoonWitness OS 34-Project Enterprise Matrix             ║
║  STATUS:         ████████████████████████████████ ACTIVE                 ║
║  SCOPE:          MANDATORY REQUIREMENTS FOR ALL PACKAGES & APPS          ║
╚══════════════════════════════════════════════════════════════════════════╝
```

> **The Monorepo is not a collection of scripts. It is a sovereign cosmic federation.**
> Every package (`packages/*`) and application (`apps/*`) is a self-contained, typed, testable, and strictly-bounded project.
> Creating or modifying a package without fulfilling this Contract is an architectural violation.

---

## 📜 THE 10 INVARIANT GENESIS MANDATES

### 1. 🏷️ Canonical Namespace & Manifest Contract (`package.json`)
Every new package MUST follow the strict dual-namespace standard:
- **`@workspace/<name>`**: Shared frontend, design primitives, hooks, state, types, i18n, error handling.
- **`@moon/<name>`**: Backend services, pure math compute, database ORM, protocol contracts, domain intelligence engines.

```json
{
  "name": "@moon/example-engine",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  },
  "scripts": {
    "build": "tsc",
    "typecheck": "tsc --noEmit",
    "lint": "eslint .",
    "test": "vitest run"
  }
}
```

---

### 2. 🚪 Sovereign Public Gateway (`src/index.ts`)
- Every package MUST expose a single canonical entrypoint: `src/index.ts`.
- **Zero Deep Imports**: Consumers are strictly forbidden from importing internal paths (e.g. `import { x } from "@moon/server/src/handlers/internal"` is illegal; consumers MUST import from `@moon/server`).
- Internal implementation details must be encapsulated.

---

### 3. ⚙️ Standard TypeScript Configuration (`tsconfig.json`)
- Every package MUST extend the shared monorepo compiler base:
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
- Strict mode is mandatory (`"strict": true`, `"noImplicitAny": true`).

---

### 4. 🏛️ Sovereign 6-Tier Layer Assignment (The Golden Covenant)
Every package belongs to exactly ONE architectural tier:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       THE 6-TIER ARCHITECTURAL COVENANT                     │
├─────────────────────────────────────────────────────────────────────────────┤
│ TIER 1: PURE TYPES & COMPUTE (0 Dependencies)                               │
│         @workspace/types · @moon/compute · @moon/protocol                   │
├─────────────────────────────────────────────────────────────────────────────┤
│ TIER 2: INFRASTRUCTURE & ERROR HANDLING (Depends only on Tier 1)             │
│         @moon/base · @moon/orm · @moon/cache · @workspace/error             │
├─────────────────────────────────────────────────────────────────────────────┤
│ TIER 3: DOMAIN INTELLIGENCE ENGINES (Depends on Tiers 1-2)                   │
│         @moon/witness · @moon/mizan · @moon/khidra · @moon/cab · @moon/crm   │
├─────────────────────────────────────────────────────────────────────────────┤
│ TIER 4: TRANSPORT & CLIENT RUNTIMES (Depends on Tiers 1-3)                  │
│         @moon/client · @moon/server                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│ TIER 5: REACT UI, HOOKS & STATE (Depends on Tiers 1-4)                      │
│         @workspace/ui · @workspace/hooks · @workspace/state · @workspace/i18n│
├─────────────────────────────────────────────────────────────────────────────┤
│ TIER 6: APPLICATIONS & SHELLS (Top of Monorepo)                             │
│         apps/api · apps/web · apps/command-center · apps/rocksoul           │
└─────────────────────────────────────────────────────────────────────────────┘
```

> **THE GOLDEN COVENANT**:
> A package in Tier $N$ can NEVER import from Tier $\ge N$. Circular dependencies are strictly forbidden.

---

### 5. 📖 Mandatory Architectural Specification (`README.md`)
Every package directory MUST contain an architectural `README.md` with:
1. Package Title with Cosmic Symbol (`# ◈ @moon/<name>`)
2. Classification Tier Badge
3. Single-Sentence Core Responsibility
4. Public API Surface Table
5. Dependency Topology

---

### 6. 🧪 Invariant Vitest Test Suite (`tests/` or `*.test.ts`)
- No package may enter the monorepo matrix without automated tests verifying:
  - Contract validation
  - Deterministic calculations
  - Error boundaries & edge cases

---

### 7. 🛡️ Single Source of Truth Schema (`@moon/protocol`)
- Any API endpoint, RPC method, or SSE stream produced by a package MUST be typed with a corresponding Zod schema envelope in `@moon/protocol`.

---

### 8. ⚡ Zero Side-Effect Import Hygiene
- Merely importing a package (`import { compute } from "@moon/compute"`) must NEVER initiate side-effects (opening database connections, starting timers, mutating global objects).

---

### 9. 📏 Anti-Monolithic File Constraint (`max-lines: 400`)
- No single file within the package may exceed 400 lines. Modular sub-files must be extracted.

---

### 10. 🔄 Automated Registration & Monorepo Discovery
- Every new package must register seamlessly in Turborepo (`pnpm-workspace.yaml`), passing:
  1. `pnpm audit:rules` (0 violations)
  2. `pnpm typecheck` (0 errors)
  3. `pnpm test` (100% green)
