---
name: package-promotion-and-distribution
description: >-
  Use this skill when promoting, scaffolding, maintaining, or verifying standalone boundary packages
  from the canonical MoonWitness monorepo into dedicated GitLab group repositories.
---

# Package Promotion & Standalone Distribution Skill

Provides standardized runbooks for promoting packages from the internal monorepo into dedicated standalone repositories under `@arsybelovedlabs/moonwitness-*`.

## Standalone Directory Layout

```text
<package-root>/
├── .gitignore               # node_modules/, dist/
├── .gitlab-ci.yml           # Node LTS, pnpm, verify stage
├── package.json             # ESM, NodeNext, types/import exports, pnpm scripts
├── pnpm-lock.yaml           # Generated via pnpm install
├── README.md                # Boundary number, description, canonical sync instructions
├── scripts/
│   └── sync-canonical.mjs   # Synchronizes from canonical monorepo source
├── src/
│   └── index.ts             # Standalone entrypoint
├── tests/
│   └── contract.test.mjs    # Node test runner contract verification
├── tsconfig.json            # Target ES2022, NodeNext, declaration: true
└── tsconfig.build.json      # Extends tsconfig.json, outDir: "dist"
```

## Step-by-Step Workflow

1. **Scaffold Package Skeleton**:
   - Create directories: `src/`, `scripts/`, `tests/`.
   - Copy canonical source snapshot from `packages/<source-package>/src/`.
2. **Configure Standalone Manifest**:
   - Scope: `@arsybelovedlabs/moonwitness-<boundary-name>`
   - Type: `"module"`
   - Package manager: `"pnpm"`
   - Scripts: `"build"`, `"typecheck"`, `"test"`, `"sync:canonical"`.
3. **Execute Local Validation Gates**:
   - `pnpm install` (generate deterministic lockfile)
   - `pnpm typecheck` (`tsc --noEmit`)
   - `pnpm build` (`tsc -p tsconfig.build.json`)
   - `pnpm test` (`node --test tests/contract.test.mjs`)
4. **Git Remote & Release Tagging**:
   - Initialize git repo (`git init -b main`).
   - Add remote target URL.
   - Commit with structured message (`feat: publish <boundary-name> package`).
   - Create SemVer tag (`git tag v0.1.0`).
   - Push to remote: `git push origin main --tags`.
