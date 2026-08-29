#!/usr/bin/env node

/**
 * ◈ MOONWITNESS — ENTERPRISE DESIGN SYSTEM & GOVERNANCE AUDITOR
 *
 * Automated Multi-Pillar Inspection & Constitutional Law Enforcement:
 * ─────────────────────────────────────────────────────────────────────────────
 * • Pillar I   : Single Source of Truth & shadcn/ui Semantic Token Enforcement
 * • Pillar II  : Zero-Tolerance Forbidden Terminology & Legacy Visual Utilities
 * • Pillar III : Zero Raw Color Literals & Arbitrary Shadow Utilities
 * • Pillar IV  : Typography Compliance (Geist, JetBrains Mono, Amiri; Zero Orbitron)
 * • Pillar V   : Monorepo Topology & Boundaries
 * • Pillar VI  : React 19 & Next.js 16 Client Conventions
 * • Pillar VII : Security, Memory Safety & Accessibility
 * • Covenant   : Sovereign Package Genesis Contract (Mandatory Standard Manifests)
 * ─────────────────────────────────────────────────────────────────────────────
 */

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT_DIR = path.resolve(__dirname, "..")

// ANSI Colors
const RED = "\x1b[31m"
const GREEN = "\x1b[32m"
const YELLOW = "\x1b[33m"
const CYAN = "\x1b[36m"
const PURPLE = "\x1b[35m"
const BOLD = "\x1b[1m"
const RESET = "\x1b[0m"

const IGNORE_DIRS = new Set([
  "node_modules",
  ".next",
  "dist",
  ".git",
  ".turbo",
  "coverage",
  "build",
  "scripts",
])

const TARGET_DIRS = ["apps", "packages"]

const VIOLATIONS = {
  // Pillar I: Design Tokens & Visual Utilities
  forbiddenTerminology: [],
  forbiddenVisualUtilities: [],
  rawColorLiterals: [],
  arbitraryShadows: [],
  invalidTypography: [],
  
  // Pillar II: Topology & Boundary Rules
  ghostFolders: [],
  legacyHudNaming: [],
  legacyCoreImports: [],
  packageHierarchyViolations: [],
  maxLines: [],

  // Pillar III: React & Next.js Conventions
  useClientPlacement: [],
  inlineMocks: [],
  pureComputeIsolation: [],

  // Pillar IV: Security & Accessibility
  secretLeaks: [],
  unsafeLinks: [],
  rawDangerouslySetInnerHTML: [],
  rawSqlConcatenation: [],
  directLocalStorage: [],
  consoleLogs: [],
  missingImageAlt: [],

  // Sovereign Package Genesis Contract
  packageContractIssues: [],
}

let totalFilesScanned = 0
let totalPackagesAudited = 0

// Check Sovereign Package Genesis Contract
function auditPackageGenesisContracts() {
  const packagesDir = path.join(ROOT_DIR, "packages")
  if (!fs.existsSync(packagesDir)) return

  const entries = fs.readdirSync(packagesDir, { withFileTypes: true })
  for (const entry of entries) {
    if (!entry.isDirectory() || IGNORE_DIRS.has(entry.name)) continue
    totalPackagesAudited++
    const pkgDir = path.join(packagesDir, entry.name)
    const pkgJsonPath = path.join(pkgDir, "package.json")
    const tsconfigPath = path.join(pkgDir, "tsconfig.json")
    const srcIndexTs = path.join(pkgDir, "src", "index.ts")
    const srcIndexTsx = path.join(pkgDir, "src", "index.tsx")
    const srcIndexJs = path.join(pkgDir, "src", "index.js")
    const directIndexTs = path.join(pkgDir, "index.ts")
    const directIndexTsx = path.join(pkgDir, "index.tsx")
    const directIndexJs = path.join(pkgDir, "index.js")
    const readmePath = path.join(pkgDir, "README.md")

    if (!fs.existsSync(pkgJsonPath)) {
      VIOLATIONS.packageContractIssues.push({ pkg: entry.name, issue: "Missing package.json manifest" })
      continue
    }

    try {
      const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, "utf-8"))
      if (!pkgJson.name || (!pkgJson.name.startsWith("@workspace/") && !pkgJson.name.startsWith("@moon/"))) {
        VIOLATIONS.packageContractIssues.push({ pkg: entry.name, issue: `Non-canonical namespace: "${pkgJson.name}" (must be @workspace/* or @moon/*)` })
      }
      if (!pkgJson.version || !pkgJson.version.match(/^\d+\.\d+\.\d+/)) {
        VIOLATIONS.packageContractIssues.push({ pkg: entry.name, issue: `Invalid or missing SemVer version in package.json: "${pkgJson.version}"` })
      }
    } catch (e) {
      VIOLATIONS.packageContractIssues.push({ pkg: entry.name, issue: "Invalid JSON in package.json" })
    }

    const hasEntrypoint =
      fs.existsSync(srcIndexTs) ||
      fs.existsSync(srcIndexTsx) ||
      fs.existsSync(srcIndexJs) ||
      fs.existsSync(directIndexTs) ||
      fs.existsSync(directIndexTsx) ||
      fs.existsSync(directIndexJs) ||
      entry.name === "eslint-config" ||
      entry.name === "typescript-config"

    if (!hasEntrypoint) {
      VIOLATIONS.packageContractIssues.push({ pkg: entry.name, issue: "Missing public entrypoint (src/index.ts or src/index.tsx)" })
    }

    if (!fs.existsSync(tsconfigPath) && entry.name !== "eslint-config" && entry.name !== "typescript-config") {
      VIOLATIONS.packageContractIssues.push({ pkg: entry.name, issue: "Missing tsconfig.json configuration" })
    }

    if (!fs.existsSync(readmePath)) {
      VIOLATIONS.packageContractIssues.push({ pkg: entry.name, issue: "Missing mandatory architectural README.md" })
    }
  }
}

// Check for Ghost Folders on disk
function checkGhostFolders(dir) {
  if (!fs.existsSync(dir)) return
  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    if (IGNORE_DIRS.has(entry.name)) continue

    const fullPath = path.join(dir, entry.name)
    const rel = path.relative(ROOT_DIR, fullPath)

    if (entry.isDirectory()) {
      if (entry.name === "@core" || entry.name === "@modules" || entry.name === "hud") {
        VIOLATIONS.ghostFolders.push({ path: rel, type: "directory" })
      }
      checkGhostFolders(fullPath)
    } else if (entry.isFile() && entry.name.startsWith("hud-")) {
      VIOLATIONS.ghostFolders.push({ path: rel, type: "file" })
    }
  }
}

function scanDirectory(dir) {
  if (!fs.existsSync(dir)) return
  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    if (IGNORE_DIRS.has(entry.name)) continue

    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      scanDirectory(fullPath)
    } else if (entry.isFile() && (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx"))) {
      auditFile(fullPath)
    }
  }
}

function auditFile(filePath) {
  totalFilesScanned++
  const relativePath = path.relative(ROOT_DIR, filePath)
  const content = fs.readFileSync(filePath, "utf-8")
  const lines = content.split("\n")

  const isTest = filePath.includes(".test.ts") || filePath.includes(".spec.ts")
  const isDoc = filePath.includes("theme-tokens.ts") || filePath.includes("constants.ts") || filePath.includes("README.md")
  const isGlobalsCss = filePath.includes("globals.css")

  // File size limit (400 lines for UI views)
  if (lines.length > 400 && !isTest && !isDoc && !filePath.includes("navigation.types.ts")) {
    VIOLATIONS.maxLines.push({
      file: relativePath,
      lines: lines.length,
      limit: 400,
    })
  }

  // "use client" Line 1 Strict Placement
  if (content.includes('"use client"') || content.includes("'use client'")) {
    const firstLine = lines[0].trim()
    if (firstLine !== '"use client"' && firstLine !== "'use client'") {
      VIOLATIONS.useClientPlacement.push({
        file: relativePath,
        line: 1,
        content: firstLine,
      })
    }
  }

  // Safe External Navigation (target="_blank" requires rel="noopener noreferrer")
  const anchorMatches = content.match(/<a\s+[^>]*target=["']_blank["'][^>]*>/gs) || []
  anchorMatches.forEach((tag) => {
    if (!tag.includes("noopener") && !tag.includes("noreferrer")) {
      VIOLATIONS.unsafeLinks.push({
        file: relativePath,
        snippet: tag.replace(/\s+/g, " ").slice(0, 60),
      })
    }
  })

  // Dangerous Inner HTML without check
  if (content.includes("dangerouslySetInnerHTML") && !content.toLowerCase().includes("dompurify") && !content.toLowerCase().includes("sanitize")) {
    VIOLATIONS.rawDangerouslySetInnerHTML.push({
      file: relativePath,
    })
  }

  lines.forEach((line, idx) => {
    const lineNo = idx + 1
    const trimmed = line.trim()
    if (trimmed.startsWith("//") || trimmed.startsWith("/*") || trimmed.startsWith("*")) return

    // 1. Forbidden Terminology & Aesthetic Tokens
    const forbiddenTermMatch = line.match(/\b(laser-conduit-[a-z0-9-]+|glow-[a-z0-9-]+|cyber-[a-z0-9-]+|corner-[a-z0-9-]+|clip-card|clip-hero|clip-btn|clip-tag|clip-rune|card-clip|hero-clip|btn-clip|tag-clip|rune-clip|panel-box|panel-clip|panel-glass|corner-box|bg-space)\b/)
    if (forbiddenTermMatch && !isGlobalsCss) {
      VIOLATIONS.forbiddenVisualUtilities.push({
        file: relativePath,
        line: lineNo,
        token: forbiddenTermMatch[1],
        snippet: trimmed,
      })
    }

    // 2. Forbidden Fonts (Orbitron banned)
    if (line.match(/\b(Orbitron|font-orbitron)\b/) && !isGlobalsCss) {
      VIOLATIONS.invalidTypography.push({
        file: relativePath,
        line: lineNo,
        token: "Orbitron font is forbidden",
        snippet: trimmed,
      })
    }

    // 3. Raw Color Literals & Arbitrary Hex Utilities in UI
    const rawColorMatch = line.match(/\b(bg|text|border)-\[#[0-9a-fA-F]{3,8}\]/)
    if (rawColorMatch && !isGlobalsCss && !isDoc) {
      VIOLATIONS.rawColorLiterals.push({
        file: relativePath,
        line: lineNo,
        token: rawColorMatch[0],
        snippet: trimmed,
      })
    }

    // 4. Legacy HUD Naming
    const hudMatch = line.match(/\b(HUDResourceTable|HUDErrorBoundary|useHUDModal|HUD_TOKENS|HudAccentColor|HudPanelLevel|HUDPanel|HUDBreadcrumb|hud-clip-card)\b/)
    if (hudMatch) {
      VIOLATIONS.legacyHudNaming.push({
        file: relativePath,
        line: lineNo,
        token: hudMatch[1],
        snippet: trimmed,
      })
    }

    // 5. Legacy @core / @modules Imports
    const coreImportMatch = line.match(/from\s+["'](@core\/|@modules\/)[^"']+["']/)
    if (coreImportMatch) {
      VIOLATIONS.legacyCoreImports.push({
        file: relativePath,
        line: lineNo,
        token: coreImportMatch[1],
        snippet: trimmed,
      })
    }

    // 6. Pure Compute Isolation (zero DB/network in @moon/compute)
    if (relativePath.includes("moon-compute") && line.match(/from\s+["'](fs|http|https|pg|mysql|sqlite|node-fetch)["']/)) {
      VIOLATIONS.pureComputeIsolation.push({
        file: relativePath,
        line: lineNo,
        snippet: trimmed,
      })
    }

    // 7. Foundation Package Hierarchy Violations
    if ((relativePath.includes("moon-compute") || relativePath.includes("moon-protocol") || relativePath.includes("packages/types")) &&
        line.match(/from\s+["'](@workspace\/ui|@workspace\/hooks|@workspace\/state|@moon\/server|@views|@app)["']/)) {
      VIOLATIONS.packageHierarchyViolations.push({
        file: relativePath,
        line: lineNo,
        snippet: trimmed,
      })
    }

    // 8. Secret Leaks
    const secretMatch = line.match(/\b(sk-[a-zA-Z0-9]{20,}|sk-ant-[a-zA-Z0-9]{20,}|ghp_[a-zA-Z0-9]{20,}|ey[a-zA-Z0-9_-]{25,}\.[a-zA-Z0-9_-]{25,})\b/)
    if (secretMatch && !isTest && !isDoc) {
      VIOLATIONS.secretLeaks.push({
        file: relativePath,
        line: lineNo,
        secretType: secretMatch[0].slice(0, 7) + "...",
      })
    }

    // 9. Direct localStorage in UI views
    if (relativePath.includes("views") && line.match(/\blocalStorage\.(getItem|setItem)\(/)) {
      VIOLATIONS.directLocalStorage.push({
        file: relativePath,
        line: lineNo,
        snippet: trimmed,
      })
    }

    // 10. Console.log in UI components
    if ((relativePath.includes("views") || relativePath.includes("components")) && line.match(/\bconsole\.(log|debug)\(/)) {
      VIOLATIONS.consoleLogs.push({
        file: relativePath,
        line: lineNo,
        snippet: trimmed,
      })
    }

    // 11. Missing Image Alt Text
    if (line.match(/<img\s+[^>]*>/) && !line.includes("alt=")) {
      VIOLATIONS.missingImageAlt.push({
        file: relativePath,
        line: lineNo,
        snippet: trimmed,
      })
    }
  })
}

// ── AUDITOR EXECUTION ────────────────────────────────────────────────────────
console.log(`${BOLD}${CYAN}◈ MOONWITNESS OS — ENTERPRISE DESIGN SYSTEM & CONSTITUTIONAL AUDITOR (V10.0)${RESET}`)
console.log(`${PURPLE}Executing multi-pillar inspection across workspace projects & Genesis contracts...${RESET}\n`)

auditPackageGenesisContracts()

for (const target of TARGET_DIRS) {
  checkGhostFolders(path.join(ROOT_DIR, target))
  scanDirectory(path.join(ROOT_DIR, target))
}

// ── CONSTITUTIONAL REPORT ───────────────────────────────────────────────────
console.log(`${BOLD}═══════════════════════════════════════════════════════════════════════════${RESET}`)
console.log(`Scanned ${BOLD}${totalFilesScanned}${RESET} TypeScript / TSX files across ${BOLD}${totalPackagesAudited}${RESET} workspace packages.\n`)

// Genesis Contract
console.log(`${BOLD}${CYAN}▶ SOVEREIGN PACKAGE GENESIS CONTRACT${RESET}`)
if (VIOLATIONS.packageContractIssues.length === 0) {
  console.log(`  ${GREEN}✓ [GENESIS CONTRACT] All ${totalPackagesAudited} workspace packages adhere 100% to Genesis Mandates!${RESET}`)
} else {
  console.log(`  ${RED}❌ [GENESIS CONTRACT] Package Genesis Contract Violations Detected:${RESET}`)
  VIOLATIONS.packageContractIssues.forEach((p) => console.log(`     • ${BOLD}${p.pkg}${RESET}: ${p.issue}`))
}
console.log()

// Pillar I & II: Enterprise Design System & Topology
console.log(`${BOLD}${CYAN}▶ PILLAR I & II: ENTERPRISE DESIGN SYSTEM & MONOREPO TOPOLOGY${RESET}`)
if (VIOLATIONS.forbiddenVisualUtilities.length === 0) {
  console.log(`  ${GREEN}✓ [ZERO DRIFT] Forbidden Visual Utilities & Legacy Tokens: CLEAN (0 detected)${RESET}`)
} else {
  console.log(`  ${RED}❌ [ZERO DRIFT] Forbidden Visual Utilities / Tokens Detected (${VIOLATIONS.forbiddenVisualUtilities.length}):${RESET}`)
  VIOLATIONS.forbiddenVisualUtilities.slice(0, 10).forEach((v) => console.log(`     • ${BOLD}${v.file}:${v.line}${RESET} ➔ ${RED}${v.token}${RESET}`))
}

if (VIOLATIONS.rawColorLiterals.length === 0) {
  console.log(`  ${GREEN}✓ [SEMANTIC TOKENS] Raw Hex Color Literals in UI Code: CLEAN (0 detected)${RESET}`)
} else {
  console.log(`  ${RED}❌ [SEMANTIC TOKENS] Raw Hex Color Literals Detected (${VIOLATIONS.rawColorLiterals.length}):${RESET}`)
  VIOLATIONS.rawColorLiterals.slice(0, 10).forEach((v) => console.log(`     • ${BOLD}${v.file}:${v.line}${RESET} ➔ ${RED}${v.token}${RESET}`))
}

if (VIOLATIONS.invalidTypography.length === 0) {
  console.log(`  ${GREEN}✓ [TYPOGRAPHY] Canonical Fonts (Geist, JetBrains Mono, Amiri; Zero Orbitron): CLEAN${RESET}`)
} else {
  console.log(`  ${RED}❌ [TYPOGRAPHY] Forbidden Font Usages Detected (${VIOLATIONS.invalidTypography.length}):${RESET}`)
  VIOLATIONS.invalidTypography.forEach((v) => console.log(`     • ${BOLD}${v.file}:${v.line}${RESET} ➔ ${RED}${v.token}${RESET}`))
}

if (VIOLATIONS.ghostFolders.length === 0) {
  console.log(`  ${GREEN}✓ [TOPOLOGY] Ghost File & Folder Ban: CLEAN${RESET}`)
} else {
  console.log(`  ${RED}❌ [TOPOLOGY] Ghost Folders / Files Detected:${RESET}`)
  VIOLATIONS.ghostFolders.forEach((g) => console.log(`     • ${BOLD}${g.path}${RESET}`))
}

if (VIOLATIONS.legacyHudNaming.length === 0) {
  console.log(`  ${GREEN}✓ [COMPONENT NAMING] Enterprise Standard Component Naming: CLEAN${RESET}`)
} else {
  console.log(`  ${RED}❌ [COMPONENT NAMING] Legacy HUD Naming Detected:${RESET}`)
  VIOLATIONS.legacyHudNaming.forEach((h) => console.log(`     • ${BOLD}${h.file}:${h.line}${RESET} ➔ ${h.token}`))
}

if (VIOLATIONS.legacyCoreImports.length === 0) {
  console.log(`  ${GREEN}✓ [DEPENDENCY FLOW] Layered Dependency Flow (Zero @core/@modules): CLEAN${RESET}`)
} else {
  console.log(`  ${RED}❌ [DEPENDENCY FLOW] Legacy Core Imports Detected:${RESET}`)
  VIOLATIONS.legacyCoreImports.forEach((c) => console.log(`     • ${BOLD}${c.file}:${c.line}${RESET} ➔ ${c.token}`))
}

if (VIOLATIONS.maxLines.length === 0) {
  console.log(`  ${GREEN}✓ [FILE LIMIT] Anti-Monolithic 400-Line Limit: CLEAN${RESET}`)
} else {
  console.log(`  ${YELLOW}⚠️  [FILE LIMIT] Anti-Monolithic Size Warning: ${VIOLATIONS.maxLines.length} files exceed 400 lines${RESET}`)
}
console.log()

// Pillar III & IV: React & Backend Engine
console.log(`${BOLD}${CYAN}▶ PILLAR III & IV: REACT 19 & ISOMORPHIC ENGINE${RESET}`)
if (VIOLATIONS.useClientPlacement.length === 0) {
  console.log(`  ${GREEN}✓ [CLIENT DIRECTIVE] "use client" Line 1 Strict Placement: CLEAN${RESET}`)
} else {
  console.log(`  ${RED}❌ [CLIENT DIRECTIVE] "use client" Misplaced:${RESET}`)
  VIOLATIONS.useClientPlacement.forEach((u) => console.log(`     • ${BOLD}${u.file}:${u.line}${RESET}`))
}

if (VIOLATIONS.pureComputeIsolation.length === 0) {
  console.log(`  ${GREEN}✓ [COMPUTE ISOLATION] Pure Mathematical Engine Isolation (@moon/compute): CLEAN${RESET}`)
} else {
  console.log(`  ${RED}❌ [COMPUTE ISOLATION] DB/Network imports in @moon/compute:${RESET}`)
  VIOLATIONS.pureComputeIsolation.forEach((p) => console.log(`     • ${BOLD}${p.file}:${p.line}${RESET}`))
}

if (VIOLATIONS.packageHierarchyViolations.length === 0) {
  console.log(`  ${GREEN}✓ [PACKAGE BOUNDARIES] Package Layer Hierarchy: CLEAN${RESET}`)
} else {
  console.log(`  ${RED}❌ [PACKAGE BOUNDARIES] Boundary Violations Detected:${RESET}`)
  VIOLATIONS.packageHierarchyViolations.forEach((b) => console.log(`     • ${BOLD}${b.file}:${b.line}${RESET}`))
}
console.log()

// Pillar V & VI: Security & Performance
console.log(`${BOLD}${CYAN}▶ PILLAR V & VI: SECURITY, MEMORY SAFETY & ACCESSIBILITY${RESET}`)
if (VIOLATIONS.secretLeaks.length === 0) {
  console.log(`  ${GREEN}✓ [SECURITY] Zero Plaintext Secrets / API Keys in Code: CLEAN (0 leaks)${RESET}`)
} else {
  console.log(`  ${RED}❌ [SECURITY] Potential Secret Leaks Detected:${RESET}`)
  VIOLATIONS.secretLeaks.forEach((s) => console.log(`     • ${BOLD}${s.file}:${s.line}${RESET} ➔ ${s.secretType}`))
}

if (VIOLATIONS.unsafeLinks.length === 0) {
  console.log(`  ${GREEN}✓ [SECURITY] Safe External Navigation (rel="noopener noreferrer"): CLEAN${RESET}`)
} else {
  console.log(`  ${RED}❌ [SECURITY] Unsafe Links Detected:${RESET}`)
  VIOLATIONS.unsafeLinks.forEach((l) => console.log(`     • ${BOLD}${l.file}${RESET}`))
}

if (VIOLATIONS.rawDangerouslySetInnerHTML.length === 0) {
  console.log(`  ${GREEN}✓ [SECURITY] Sanitized HTML Rendering: CLEAN${RESET}`)
} else {
  console.log(`  ${RED}❌ [SECURITY] Raw dangerouslySetInnerHTML without sanitization:${RESET}`)
  VIOLATIONS.rawDangerouslySetInnerHTML.forEach((d) => console.log(`     • ${BOLD}${d.file}${RESET}`))
}

if (VIOLATIONS.directLocalStorage.length === 0) {
  console.log(`  ${GREEN}✓ [STORAGE] Persistent Storage Hook (useLocalStorage): CLEAN${RESET}`)
} else {
  console.log(`  ${YELLOW}⚠️  [STORAGE] Direct localStorage in views:${RESET}`)
  VIOLATIONS.directLocalStorage.forEach((l) => console.log(`     • ${BOLD}${l.file}:${l.line}${RESET}`))
}

if (VIOLATIONS.missingImageAlt.length === 0) {
  console.log(`  ${GREEN}✓ [ACCESSIBILITY] Image Accessibility (alt text): CLEAN${RESET}`)
} else {
  console.log(`  ${RED}❌ [ACCESSIBILITY] Images missing alt attribute:${RESET}`)
  VIOLATIONS.missingImageAlt.forEach((i) => console.log(`     • ${BOLD}${i.file}:${i.line}${RESET}`))
}
console.log()

// Summary
const totalCriticalViolations =
  VIOLATIONS.packageContractIssues.length +
  VIOLATIONS.forbiddenVisualUtilities.length +
  VIOLATIONS.rawColorLiterals.length +
  VIOLATIONS.invalidTypography.length +
  VIOLATIONS.ghostFolders.length +
  VIOLATIONS.legacyHudNaming.length +
  VIOLATIONS.legacyCoreImports.length +
  VIOLATIONS.useClientPlacement.length +
  VIOLATIONS.pureComputeIsolation.length +
  VIOLATIONS.packageHierarchyViolations.length +
  VIOLATIONS.secretLeaks.length +
  VIOLATIONS.unsafeLinks.length +
  VIOLATIONS.rawDangerouslySetInnerHTML.length +
  VIOLATIONS.missingImageAlt.length

console.log(`${BOLD}═══════════════════════════════════════════════════════════════════════════${RESET}`)
if (totalCriticalViolations === 0) {
  console.log(`  ${BOLD}${GREEN}🎉 SUPREME ARCHITECTURAL HARMONY: 0 CRITICAL CONSTITUTIONAL VIOLATIONS!${RESET}\n`)
  process.exit(0)
} else {
  console.log(`  ${BOLD}${RED}❌ FAILED AUDIT: ${totalCriticalViolations} CRITICAL CONSTITUTIONAL VIOLATIONS DETECTED!${RESET}\n`)
  process.exit(1)
}
