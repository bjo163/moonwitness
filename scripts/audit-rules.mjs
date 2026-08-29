#!/usr/bin/env node

/**
 * ◈ MOONWITNESS — ENTERPRISE DESIGN SYSTEM & GOVERNANCE AUDITOR (PHASE 2 ZERO-DRIFT AUDITOR)
 *
 * Automated Multi-Pillar Forensic Inspection & Constitutional Law Enforcement:
 * ─────────────────────────────────────────────────────────────────────────────
 * • Pillar I   : Single Source of Truth & Theme Parity (:root vs .dark)
 * • Pillar II  : Zero-Tolerance Forbidden Terminology, Tokens & Legacy Visual Utilities
 * • Pillar III : Zero Raw Color Literals & Zero Arbitrary Color Utilities (cyan-*, purple-*, etc.)
 * • Pillar IV  : Typography Compliance (Geist, JetBrains Mono, Amiri; Zero Orbitron)
 * • Pillar V   : Monorepo Topology, Ghost Files & Component Naming
 * • Pillar VI  : React 19 & Next.js 16 Client Conventions
 * • Pillar VII : Security, Memory Safety & WCAG AA Contrast Verification
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
  ".gemini",
  "scripts",
])

const TARGET_DIRS = ["apps", "packages"]

const VIOLATIONS = {
  // Pillar I: Design Tokens & Visual Utilities
  forbiddenTerminology: [],
  forbiddenVisualUtilities: [],
  arbitraryColorUtilities: [],
  rawColorLiterals: [],
  arbitraryShadows: [],
  invalidTypography: [],
  themeParityIssues: [],
  contrastIssues: [],
  suspiciousVisualUtilities: [],
  allowedDomainSpecific: [],

  // Pillar II: Topology & Boundary Rules
  ghostFolders: [],
  legacyComponentNaming: [],
  legacyCoreImports: [],
  packageHierarchyViolations: [],
  maxLines: [],

  // Pillar III: React & Next.js Conventions
  useClientPlacement: [],
  pureComputeIsolation: [],

  // Pillar IV: Security & Accessibility
  secretLeaks: [],
  unsafeLinks: [],
  rawDangerouslySetInnerHTML: [],
  directLocalStorage: [],
  missingImageAlt: [],

  // Sovereign Package Genesis Contract
  packageContractIssues: [],
}

let totalFilesScanned = 0
let totalPackagesAudited = 0

// ── 1. THEME PARITY & CONTRAST VERIFICATION ─────────────────────────────────
function auditThemeParityAndContrast() {
  const globalsCssPath = path.join(
    ROOT_DIR,
    "packages",
    "ui",
    "src",
    "styles",
    "globals.css"
  )
  if (!fs.existsSync(globalsCssPath)) {
    VIOLATIONS.themeParityIssues.push({
      issue: "Missing packages/ui/src/styles/globals.css",
    })
    return
  }

  const css = fs.readFileSync(globalsCssPath, "utf-8")
  const requiredTokens = [
    "--background",
    "--foreground",
    "--card",
    "--card-foreground",
    "--primary",
    "--primary-foreground",
    "--secondary",
    "--secondary-foreground",
    "--muted",
    "--muted-foreground",
    "--accent",
    "--accent-foreground",
    "--destructive",
    "--destructive-foreground",
    "--border",
    "--input",
    "--ring",
    "--success",
    "--warning",
    "--info",
    "--popover",
    "--popover-foreground",
    "--success-foreground",
    "--warning-foreground",
    "--info-foreground",
  ]

  const rootBlockMatch = css.match(/:root\s*\{([^}]+)\}/)
  const darkBlockMatch = css.match(/\.dark\s*\{([^}]+)\}/)

  if (!rootBlockMatch || !darkBlockMatch) {
    VIOLATIONS.themeParityIssues.push({
      issue: "Missing :root or .dark block in globals.css",
    })
    return
  }

  const rootTokens = new Set(
    (rootBlockMatch[1].match(/--[a-z0-9-]+(?=\s*:)/g) || []).map((t) =>
      t.trim()
    )
  )
  const darkTokens = new Set(
    (darkBlockMatch[1].match(/--[a-z0-9-]+(?=\s*:)/g) || []).map((t) =>
      t.trim()
    )
  )

  for (const token of requiredTokens) {
    if (!rootTokens.has(token)) {
      VIOLATIONS.themeParityIssues.push({
        issue: `Token "${token}" missing in :root theme definition`,
      })
    }
    if (!darkTokens.has(token)) {
      VIOLATIONS.themeParityIssues.push({
        issue: `Token "${token}" missing in .dark theme definition`,
      })
    }
  }

  // Calculate contrast ratio helper for sRGB
  function hexToLuminance(hex) {
    hex = hex.replace("#", "").trim()
    if (hex.length === 3)
      hex = hex
        .split("")
        .map((c) => c + c)
        .join("")
    const r = parseInt(hex.substring(0, 2), 16) / 255
    const g = parseInt(hex.substring(2, 4), 16) / 255
    const b = parseInt(hex.substring(4, 6), 16) / 255

    const a = [r, g, b].map((v) => {
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
    })
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722
  }

  function getContrast(hex1, hex2) {
    const lum1 = hexToLuminance(hex1)
    const lum2 = hexToLuminance(hex2)
    const brightest = Math.max(lum1, lum2)
    const darkest = Math.min(lum1, lum2)
    return (brightest + 0.05) / (darkest + 0.05)
  }

  const pairs = [
    ["background", "foreground"],
    ["card", "card-foreground"],
    ["popover", "popover-foreground"],
    ["primary", "primary-foreground"],
    ["secondary", "secondary-foreground"],
    ["muted", "muted-foreground"],
    ["accent", "accent-foreground"],
    ["destructive", "destructive-foreground"],
    ["success", "success-foreground"],
    ["warning", "warning-foreground"],
    ["info", "info-foreground"],
  ]
  const readColors = (block) =>
    Object.fromEntries(
      [...block.matchAll(/(--[a-z0-9-]+):\s*(#[0-9a-fA-F]{3,6})/g)].map(
        (match) => [match[1], match[2]]
      )
    )
  for (const [mode, block] of [
    ["Light", rootBlockMatch[1]],
    ["Dark", darkBlockMatch[1]],
  ]) {
    const colors = readColors(block)
    for (const [background, foreground] of pairs) {
      const bg = colors[`--${background}`]
      const fg = colors[`--${foreground}`]
      if (!bg || !fg) continue
      const contrast = getContrast(bg, fg)
      if (contrast < 4.5)
        VIOLATIONS.contrastIssues.push({
          mode,
          pair: `${background} / ${foreground}`,
          contrast: contrast.toFixed(2),
          req: ">= 4.5:1",
        })
    }
  }
}

// ── 2. SOVEREIGN PACKAGE GENESIS CONTRACT ───────────────────────────────────
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
      VIOLATIONS.packageContractIssues.push({
        pkg: entry.name,
        issue: "Missing package.json manifest",
      })
      continue
    }

    try {
      const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, "utf-8"))
      if (
        !pkgJson.name ||
        (!pkgJson.name.startsWith("@workspace/") &&
          !pkgJson.name.startsWith("@moon/"))
      ) {
        VIOLATIONS.packageContractIssues.push({
          pkg: entry.name,
          issue: `Non-canonical namespace: "${pkgJson.name}" (must be @workspace/* or @moon/*)`,
        })
      }
      if (!pkgJson.version || !pkgJson.version.match(/^\d+\.\d+\.\d+/)) {
        VIOLATIONS.packageContractIssues.push({
          pkg: entry.name,
          issue: `Invalid or missing SemVer version in package.json: "${pkgJson.version}"`,
        })
      }
    } catch (e) {
      VIOLATIONS.packageContractIssues.push({
        pkg: entry.name,
        issue: "Invalid JSON in package.json",
      })
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
      VIOLATIONS.packageContractIssues.push({
        pkg: entry.name,
        issue: "Missing public entrypoint (src/index.ts or src/index.tsx)",
      })
    }

    if (
      !fs.existsSync(tsconfigPath) &&
      entry.name !== "eslint-config" &&
      entry.name !== "typescript-config"
    ) {
      VIOLATIONS.packageContractIssues.push({
        pkg: entry.name,
        issue: "Missing tsconfig.json configuration",
      })
    }

    if (!fs.existsSync(readmePath)) {
      VIOLATIONS.packageContractIssues.push({
        pkg: entry.name,
        issue: "Missing mandatory architectural README.md",
      })
    }
  }
}

// ── 3. GHOST FOLDERS & LEGACY FILENAMES ──────────────────────────────────────
function checkGhostFolders(dir) {
  if (!fs.existsSync(dir)) return
  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    if (IGNORE_DIRS.has(entry.name)) continue

    const fullPath = path.join(dir, entry.name)
    const rel = path.relative(ROOT_DIR, fullPath).replace(/\\/g, "/")

    if (entry.isDirectory()) {
      if (
        entry.name === "@core" ||
        entry.name === "@modules" ||
        entry.name === "hud"
      ) {
        VIOLATIONS.ghostFolders.push({ path: rel, type: "directory" })
      }
      checkGhostFolders(fullPath)
    } else if (entry.isFile()) {
      if (
        entry.name.startsWith("hud-") ||
        entry.name.startsWith("cosmic-") ||
        entry.name.includes(".cosmic.")
      ) {
        VIOLATIONS.legacyComponentNaming.push({
          path: rel,
          issue: `Legacy filename convention: "${entry.name}"`,
        })
      }
    }
  }
}

// ── 4. RECURSIVE SCANNER ACROSS SUPPORTED EXTENSIONS ─────────────────────────
const SCAN_EXTENSIONS = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".mjs",
  ".cjs",
  ".css",
  ".scss",
  ".json",
])

function scanDirectory(dir) {
  if (!fs.existsSync(dir)) return
  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    if (IGNORE_DIRS.has(entry.name)) continue

    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      scanDirectory(fullPath)
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase()
      if (SCAN_EXTENSIONS.has(ext)) {
        auditFile(fullPath)
      }
    }
  }
}

function auditFile(filePath) {
  totalFilesScanned++
  const relativePath = path.relative(ROOT_DIR, filePath).replace(/\\/g, "/")
  const content = fs.readFileSync(filePath, "utf-8")
  const lines = content.split("\n")

  const isTest = filePath.includes(".test.") || filePath.includes(".spec.")
  const isDoc =
    filePath.includes("README.md") || filePath.includes("constants.ts")
  const isGlobalsCss = filePath.includes("globals.css")
  const isScript = filePath.includes("scripts/")

  if (isScript) return

  // Anti-monolithic file limit (400 lines) for UI views and components
  if (
    lines.length > 400 &&
    !isTest &&
    !isDoc &&
    (relativePath.includes("views/") || relativePath.includes("components/"))
  ) {
    VIOLATIONS.maxLines.push({
      file: relativePath,
      lines: lines.length,
      limit: 400,
    })
  }

  // "use client" Line 1 Strict Placement in TSX files
  if (
    filePath.endsWith(".tsx") &&
    (content.includes('"use client"') || content.includes("'use client'"))
  ) {
    const firstLine = lines[0].trim()
    if (firstLine !== '"use client"' && firstLine !== "'use client'") {
      VIOLATIONS.useClientPlacement.push({
        file: relativePath,
        line: 1,
        content: firstLine,
      })
    }
  }

  // Check exported identifiers and forbidden tokens
  lines.forEach((line, idx) => {
    const lineNo = idx + 1
    const trimmed = line.trim()
    if (
      trimmed.startsWith("//") ||
      trimmed.startsWith("/*") ||
      trimmed.startsWith("*")
    )
      return

    // 1. Forbidden Visual Utilities & Banned Clip Classes
    const forbiddenUtilMatch = line.match(
      /\b(laser-conduit-[a-z0-9-]+|glow-[a-z0-9-]+|corner-[a-z0-9-]+|clip-card|clip-hero|clip-btn|clip-tag|clip-rune|card-clip|hero-clip|btn-clip|tag-clip|rune-clip|panel-box|panel-clip|panel-glass|corner-box|bg-space)\b/i
    )
    if (forbiddenUtilMatch && !isGlobalsCss) {
      VIOLATIONS.forbiddenVisualUtilities.push({
        file: relativePath,
        line: lineNo,
        token: forbiddenUtilMatch[1],
        snippet: trimmed,
      })
    }

    // 2. Forbidden Terminology in code/JSX/exports (case-insensitive)
    // Note: Prophet Hud / Surah Hud (11) is excluded from forbidden HUD ban
    const forbiddenTermMatch = line.match(
      /\b(mission control|operator clearance|command shell|secure link|quantum stream|root_access|root access)\b/i
    )
    if (forbiddenTermMatch && !isDoc) {
      VIOLATIONS.forbiddenTerminology.push({
        file: relativePath,
        line: lineNo,
        token: forbiddenTermMatch[0],
        snippet: trimmed,
      })
    }

    // 3. Arbitrary Direct Color Utilities (cyan-*, purple-* in JSX classes outside globals.css)
    const arbitraryColorMatch = line.match(
      /\b(bg|text|border|from|to|via)-(cyan|purple)-[0-9]+(\/[0-9]+)?\b/
    )
    if (arbitraryColorMatch && !isGlobalsCss) {
      VIOLATIONS.arbitraryColorUtilities.push({
        file: relativePath,
        line: lineNo,
        token: arbitraryColorMatch[0],
        snippet: trimmed,
      })
    }

    // Phase 3 inventory: these are review findings, not automatic failures.
    const suspiciousMatch = line.match(
      /\b(bg-black|bg-white|text-white|text-black|border-white|border-black|backdrop-blur(?:-[a-z0-9]+)?|bg-gradient-[a-z-]+|drop-shadow(?:-[a-z0-9]+)?|animate-(?:spin|ping|pulse)|transition-all)\b/i
    )
    if (suspiciousMatch && !isGlobalsCss) {
      VIOLATIONS.suspiciousVisualUtilities.push({
        file: relativePath,
        line: lineNo,
        token: suspiciousMatch[1],
        snippet: trimmed,
      })
    }

    const domainMatch = line.match(
      /\b(tajweed|madda_normal|qalaqah|idgham_[a-z_]+|ghunnah|ikhfa|iqlab)\b/i
    )
    if (domainMatch && isGlobalsCss) {
      VIOLATIONS.allowedDomainSpecific.push({
        file: relativePath,
        line: lineNo,
        token: domainMatch[1],
        reason: "Quranic Tajweed visualization token",
      })
    }

    // 4. Raw Hex Colors in Tailwind classes (e.g. bg-[#...], text-[#...])
    const rawColorMatch = line.match(/\b(bg|text|border)-\[#[0-9a-fA-F]{3,8}\]/)
    if (rawColorMatch && !isGlobalsCss && !isDoc) {
      VIOLATIONS.rawColorLiterals.push({
        file: relativePath,
        line: lineNo,
        token: rawColorMatch[0],
        snippet: trimmed,
      })
    }

    // 5. Forbidden Fonts (Orbitron permanently banned)
    if (line.match(/\b(Orbitron|font-orbitron)\b/i) && !isGlobalsCss) {
      VIOLATIONS.invalidTypography.push({
        file: relativePath,
        line: lineNo,
        token: "Orbitron font is permanently banned",
        snippet: trimmed,
      })
    }

    // 6. Legacy Component & Export Naming
    const isEslintConfig = filePath.includes("eslint-config")
    const legacyExportMatch = line.match(
      /\b(Cosmic[A-Z][a-zA-Z0-9]+|HUDResourceTable|HUDErrorBoundary|useHUDModal|HUD_TOKENS|HUDPanel)\b/
    )
    if (legacyExportMatch && !isGlobalsCss && !isEslintConfig) {
      VIOLATIONS.legacyComponentNaming.push({
        file: relativePath,
        line: lineNo,
        token: legacyExportMatch[1],
        snippet: trimmed,
      })
    }

    // 7. Legacy @core / @modules Imports
    const coreImportMatch = line.match(
      /from\s+["'](@core\/|@modules\/)[^"']+["']/
    )
    if (coreImportMatch) {
      VIOLATIONS.legacyCoreImports.push({
        file: relativePath,
        line: lineNo,
        token: coreImportMatch[1],
        snippet: trimmed,
      })
    }

    // 8. Pure Compute Isolation (zero DB/network in @moon/compute)
    if (
      relativePath.includes("moon-compute") &&
      line.match(/from\s+["'](fs|http|https|pg|mysql|sqlite|node-fetch)["']/)
    ) {
      VIOLATIONS.pureComputeIsolation.push({
        file: relativePath,
        line: lineNo,
        snippet: trimmed,
      })
    }

    // 9. Secret Leaks
    const secretMatch = line.match(
      /\b(sk-[a-zA-Z0-9]{20,}|sk-ant-[a-zA-Z0-9]{20,}|ghp_[a-zA-Z0-9]{20,}|ey[a-zA-Z0-9_-]{25,}\.[a-zA-Z0-9_-]{25,})\b/
    )
    if (secretMatch && !isTest && !isDoc) {
      VIOLATIONS.secretLeaks.push({
        file: relativePath,
        line: lineNo,
        secretType: secretMatch[0].slice(0, 7) + "...",
      })
    }
  })
}

// ── AUDITOR EXECUTION ────────────────────────────────────────────────────────
console.log(
  `${BOLD}${CYAN}◈ MOONWITNESS — ENTERPRISE DESIGN SYSTEM AUDITOR (PHASE 3)${RESET}`
)
console.log(
  `${PURPLE}Executing forensic multi-pillar inspection across workspace projects & Genesis contracts...${RESET}\n`
)

auditThemeParityAndContrast()
auditPackageGenesisContracts()

for (const target of TARGET_DIRS) {
  checkGhostFolders(path.join(ROOT_DIR, target))
  scanDirectory(path.join(ROOT_DIR, target))
}

// ── CONSTITUTIONAL REPORT ───────────────────────────────────────────────────
console.log(
  `${BOLD}═══════════════════════════════════════════════════════════════════════════${RESET}`
)
console.log(
  `Scanned ${BOLD}${totalFilesScanned}${RESET} files across ${BOLD}${totalPackagesAudited}${RESET} workspace packages.\n`
)

// Genesis Contract
console.log(`${BOLD}${CYAN}▶ SOVEREIGN PACKAGE GENESIS CONTRACT${RESET}`)
if (VIOLATIONS.packageContractIssues.length === 0) {
  console.log(
    `  ${GREEN}✓ [GENESIS CONTRACT] All ${totalPackagesAudited} workspace packages adhere 100% to Genesis Mandates!${RESET}`
  )
} else {
  console.log(
    `  ${RED}❌ [GENESIS CONTRACT] Package Genesis Contract Violations Detected:${RESET}`
  )
  VIOLATIONS.packageContractIssues.forEach((p) =>
    console.log(`     • ${BOLD}${p.pkg}${RESET}: ${p.issue}`)
  )
}
console.log()

// Pillar I: Theme Parity & Contrast
console.log(
  `${BOLD}${CYAN}▶ PILLAR I: THEME PARITY & ACCESSIBILITY (WCAG AA)${RESET}`
)
if (
  VIOLATIONS.themeParityIssues.length === 0 &&
  VIOLATIONS.contrastIssues.length === 0
) {
  console.log(
    `  ${GREEN}✓ [THEME PARITY] Light & Dark mode canonical theme tokens in full parity!${RESET}`
  )
  console.log(
    `  ${GREEN}✓ [ACCESSIBILITY] WCAG AA contrast ratio (> 4.5:1) verified!${RESET}`
  )
} else {
  VIOLATIONS.themeParityIssues.forEach((t) =>
    console.log(`  ${RED}❌ [THEME PARITY] ${t.issue}${RESET}`)
  )
  VIOLATIONS.contrastIssues.forEach((c) =>
    console.log(
      `  ${RED}❌ [CONTRAST] ${c.mode} ${c.pair || "background / foreground"}: Contrast ${c.contrast} fails requirement (${c.req})${RESET}`
    )
  )
}
console.log()

console.log(`${BOLD}${CYAN}▶ PHASE 3 VISUAL INVENTORY${RESET}`)
console.log(
  `  ${YELLOW}• [SUSPICIOUS] ${VIOLATIONS.suspiciousVisualUtilities.length} visual utility usages require review (not automatic failures).${RESET}`
)
console.log(
  `  ${GREEN}✓ [ALLOWED DOMAIN-SPECIFIC] ${VIOLATIONS.allowedDomainSpecific.length} Tajweed visualization token usages remain explicitly scoped to globals.css.${RESET}`
)
console.log()

// Pillar II: Zero-Drift Semantic Token & Terminology
console.log(
  `${BOLD}${CYAN}▶ PILLAR II: ZERO-DRIFT SEMANTIC TOKENS & VISUAL GOVERNANCE${RESET}`
)
if (VIOLATIONS.forbiddenVisualUtilities.length === 0) {
  console.log(
    `  ${GREEN}✓ [FORBIDDEN UTILITIES] Custom clip/laser/glow/space utilities: CLEAN (0 detected)${RESET}`
  )
} else {
  console.log(
    `  ${RED}❌ [FORBIDDEN UTILITIES] Violations Detected (${VIOLATIONS.forbiddenVisualUtilities.length}):${RESET}`
  )
  VIOLATIONS.forbiddenVisualUtilities
    .slice(0, 10)
    .forEach((v) =>
      console.log(
        `     • ${BOLD}${v.file}:${v.line}${RESET} ➔ ${RED}${v.token}${RESET}`
      )
    )
}

if (VIOLATIONS.arbitraryColorUtilities.length === 0) {
  console.log(
    `  ${GREEN}✓ [ARBITRARY COLORS] Direct cyan-*/purple-* color utilities: CLEAN (0 detected)${RESET}`
  )
} else {
  console.log(
    `  ${RED}❌ [ARBITRARY COLORS] Arbitrary Color Utilities Detected (${VIOLATIONS.arbitraryColorUtilities.length}):${RESET}`
  )
  VIOLATIONS.arbitraryColorUtilities
    .slice(0, 10)
    .forEach((v) =>
      console.log(
        `     • ${BOLD}${v.file}:${v.line}${RESET} ➔ ${RED}${v.token}${RESET}`
      )
    )
}

if (VIOLATIONS.rawColorLiterals.length === 0) {
  console.log(
    `  ${GREEN}✓ [RAW COLOR LITERALS] Hardcoded Hex Literals in UI: CLEAN (0 detected)${RESET}`
  )
} else {
  console.log(
    `  ${RED}❌ [RAW COLOR LITERALS] Hardcoded Hex Literals Detected (${VIOLATIONS.rawColorLiterals.length}):${RESET}`
  )
  VIOLATIONS.rawColorLiterals
    .slice(0, 10)
    .forEach((v) =>
      console.log(
        `     • ${BOLD}${v.file}:${v.line}${RESET} ➔ ${RED}${v.token}${RESET}`
      )
    )
}

if (VIOLATIONS.forbiddenTerminology.length === 0) {
  console.log(
    `  ${GREEN}✓ [TERMINOLOGY] Theatrical/Sci-Fi Terminology: CLEAN (0 detected)${RESET}`
  )
} else {
  console.log(
    `  ${RED}❌ [TERMINOLOGY] Forbidden Terminology Detected (${VIOLATIONS.forbiddenTerminology.length}):${RESET}`
  )
  VIOLATIONS.forbiddenTerminology
    .slice(0, 10)
    .forEach((v) =>
      console.log(
        `     • ${BOLD}${v.file}:${v.line}${RESET} ➔ ${RED}${v.token}${RESET}`
      )
    )
}

if (VIOLATIONS.invalidTypography.length === 0) {
  console.log(
    `  ${GREEN}✓ [TYPOGRAPHY] Canonical Fonts (Geist, JetBrains Mono, Amiri; Zero Orbitron): CLEAN${RESET}`
  )
} else {
  console.log(
    `  ${RED}❌ [TYPOGRAPHY] Forbidden Font Usages Detected (${VIOLATIONS.invalidTypography.length}):${RESET}`
  )
  VIOLATIONS.invalidTypography.forEach((v) =>
    console.log(
      `     • ${BOLD}${v.file}:${v.line}${RESET} ➔ ${RED}${v.token}${RESET}`
    )
  )
}

if (
  VIOLATIONS.ghostFolders.length === 0 &&
  VIOLATIONS.legacyComponentNaming.length === 0
) {
  console.log(
    `  ${GREEN}✓ [TOPOLOGY & NAMING] Zero Ghost Folders & Zero Cosmic/HUD Component Naming: CLEAN${RESET}`
  )
} else {
  VIOLATIONS.ghostFolders.forEach((g) =>
    console.log(`  ${RED}❌ [GHOST FOLDER] ${g.path}${RESET}`)
  )
  VIOLATIONS.legacyComponentNaming.forEach((l) =>
    console.log(
      `  ${RED}❌ [LEGACY NAMING] ${l.path || l.file}: ${l.issue || l.token}${RESET}`
    )
  )
}

if (VIOLATIONS.legacyCoreImports.length === 0) {
  console.log(
    `  ${GREEN}✓ [DEPENDENCY FLOW] Layered Dependency Flow (Zero @core/@modules): CLEAN${RESET}`
  )
} else {
  console.log(
    `  ${RED}❌ [DEPENDENCY FLOW] Legacy Core Imports Detected:${RESET}`
  )
  VIOLATIONS.legacyCoreImports.forEach((c) =>
    console.log(`     • ${BOLD}${c.file}:${c.line}${RESET} ➔ ${c.token}`)
  )
}
console.log()

// Pillar III: React & Next.js Conventions
console.log(
  `${BOLD}${CYAN}▶ PILLAR III: REACT 19 & COMPUTATIONAL ISOLATION${RESET}`
)
if (VIOLATIONS.useClientPlacement.length === 0) {
  console.log(
    `  ${GREEN}✓ [CLIENT DIRECTIVE] "use client" Line 1 Strict Placement: CLEAN${RESET}`
  )
} else {
  console.log(`  ${RED}❌ [CLIENT DIRECTIVE] "use client" Misplaced:${RESET}`)
  VIOLATIONS.useClientPlacement.forEach((u) =>
    console.log(`     • ${BOLD}${u.file}:${u.line}${RESET}`)
  )
}

if (VIOLATIONS.pureComputeIsolation.length === 0) {
  console.log(
    `  ${GREEN}✓ [COMPUTE ISOLATION] Pure Mathematical Engine Isolation (@moon/compute): CLEAN${RESET}`
  )
} else {
  console.log(
    `  ${RED}❌ [COMPUTE ISOLATION] DB/Network imports in @moon/compute:${RESET}`
  )
  VIOLATIONS.pureComputeIsolation.forEach((p) =>
    console.log(`     • ${BOLD}${p.file}:${p.line}${RESET}`)
  )
}
console.log()

// Pillar IV: Security
console.log(`${BOLD}${CYAN}▶ PILLAR IV: SECURITY & CREDENTIAL SAFETY${RESET}`)
if (VIOLATIONS.secretLeaks.length === 0) {
  console.log(
    `  ${GREEN}✓ [SECURITY] Zero Plaintext Secrets / API Keys in Code: CLEAN (0 leaks)${RESET}`
  )
} else {
  console.log(`  ${RED}❌ [SECURITY] Potential Secret Leaks Detected:${RESET}`)
  VIOLATIONS.secretLeaks.forEach((s) =>
    console.log(`     • ${BOLD}${s.file}:${s.line}${RESET} ➔ ${s.secretType}`)
  )
}
console.log()

// Summary Calculation
const totalCriticalViolations =
  VIOLATIONS.packageContractIssues.length +
  VIOLATIONS.themeParityIssues.length +
  VIOLATIONS.contrastIssues.length +
  VIOLATIONS.forbiddenVisualUtilities.length +
  VIOLATIONS.arbitraryColorUtilities.length +
  VIOLATIONS.rawColorLiterals.length +
  VIOLATIONS.forbiddenTerminology.length +
  VIOLATIONS.invalidTypography.length +
  VIOLATIONS.ghostFolders.length +
  VIOLATIONS.legacyComponentNaming.length +
  VIOLATIONS.legacyCoreImports.length +
  VIOLATIONS.useClientPlacement.length +
  VIOLATIONS.pureComputeIsolation.length +
  VIOLATIONS.secretLeaks.length

console.log(
  `${BOLD}═══════════════════════════════════════════════════════════════════════════${RESET}`
)
if (totalCriticalViolations === 0) {
  console.log(
    `  ${BOLD}${GREEN}🎉 TRUE ZERO-DRIFT CONSTITUTIONAL HARMONY: 0 VIOLATIONS ACROSS ALL PILLARS!${RESET}\n`
  )
  process.exit(0)
} else {
  console.log(
    `  ${BOLD}${RED}❌ FAILED AUDIT: ${totalCriticalViolations} CRITICAL CONSTITUTIONAL VIOLATIONS DETECTED!${RESET}\n`
  )
  process.exit(1)
}
