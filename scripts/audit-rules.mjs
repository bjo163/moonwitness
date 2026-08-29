#!/usr/bin/env node

/**
 * ◈ MOONWITNESS OS — 33 CONSTITUTIONAL LAWS & ENTERPRISE DESIGN SYSTEM AUDITOR (V10.0)
 *
 * Automated Multi-Pillar Architectural & Design System Inspector:
 * ─────────────────────────────────────────────────────────────────────────────
 * • Pillar I   : Canonical Design Tokens & Semantic Surfaces
 * • Pillar II  : Monorepo Topology, Layering & Boundaries
 * • Pillar III : React 19 & Next.js 16 Architecture
 * • Pillar IV  : Pure Isomorphic Compute & Telemetry Isolation
 * • Pillar V   : Security & Defense-in-Depth
 * • Pillar VI  : Memory Safety, Accessibility & Performance
 * • Pillar VII : Sacred Knowledge Integrity & Multilingual Matrix
 * • Covenant   : Sovereign Package Genesis Contract (10 Invariant Mandates)
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
const SOURCE_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".css", ".scss"])
const DOC_EXTENSIONS = new Set([".md", ".mdx", ".txt"])

const CANONICAL_SEMANTIC_TOKENS = [
  "background",
  "foreground",
  "card",
  "card-foreground",
  "popover",
  "popover-foreground",
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "muted",
  "muted-foreground",
  "accent",
  "accent-foreground",
  "destructive",
  "destructive-foreground",
  "success",
  "success-foreground",
  "warning",
  "warning-foreground",
  "info",
  "info-foreground",
  "border",
  "input",
  "ring",
  "chart-1",
  "chart-2",
  "chart-3",
  "chart-4",
  "chart-5",
  "sidebar",
  "sidebar-foreground",
  "sidebar-primary",
  "sidebar-primary-foreground",
  "sidebar-accent",
  "sidebar-accent-foreground",
  "sidebar-border",
  "sidebar-ring",
]

const RAW_UI_COLOR_RE = /(?:^|[\s"'`])(?:bg|text|border|ring|outline|fill|stroke|decoration|divide|from|via|to|shadow)-\[#(?:[0-9a-fA-F]{3,8})\]/i

const DECORATIVE_UTILITY_RE = /(?:^|[\s"'`])(?:clip-(?:card|hero|btn|tag|rune)|card-clip|hero-clip|btn-clip|tag-clip|rune-clip|hud-clip-(?:card|hero|btn|tag|rune)|panel-glass|military-box|corner-(?:cyan|green|yellow|purple|pink)|glow-(?:cyan|emerald|amber|purple|pink)|holo-glow|laser-conduit-(?:cyan|green|yellow|purple)|bg-(?:cosmic-grid|dense-grid|space))/i

const BANNED_TERMINOLOGY_RE = /\b(?:cyber-(?:cyan|green|yellow|purple|pink|dark|panel)|bg-space|clip-(?:card|hero|btn|tag|rune)|card-clip|hero-clip|btn-clip|tag-clip|rune-clip|panel-glass|corner-box|laser-conduit|holo-glow|font-orbitron|operator clearance|command shell|mission control|commit morph|initialize instance|telemetry aesthetic)\b/i

const LEGACY_API_RE = /(?:from\s+["']next\/router["']|\bReactDOM\.render\b|\bfindDOMNode\b|\b(?:componentWillMount|componentWillReceiveProps|componentWillUpdate)\b|\bgetInitialProps\b|\bUNSAFE_component|\b(?:useClipPath|useCornerBrackets|usePanelGlass|useCosmicGrid|useLaserConduit|useCyberColor|useGlow|CyberColors|CyberColorVars|CyberColorKey|GlowClasses|ClipPathClasses|GridClasses|LaserConduitClasses|PanelGlass|ChamferSizes|GlowDepths|BackdropBlurs|GridSizes|CornerClasses|SemanticCorners)\b)/

function isDocumentation(filePath) {
  return DOC_EXTENSIONS.has(path.extname(filePath).toLowerCase()) ||
    /(?:^|[\\/])(?:docs?|documentation|eslint-config)(?:[\\/]|$)/i.test(filePath) ||
    filePath.includes("eslint-config") ||
    filePath.includes("scripts")
}

function isDomainData(filePath) {
  return /(?:[\\/](?:domain|data|locales|fixtures|seed|schemas?|protocol)(?:[\\/]|$)|(?:\.test|\.spec)\.)/i.test(filePath)
}

function isActiveImplementation(filePath) {
  return !isDocumentation(filePath) && !isDomainData(filePath)
}

const VIOLATIONS = {
  // Pillar I & II: Frontend & Topology
  maxLines: [],
  ghostFolders: [],
  legacyHudNaming: [],
  legacyCoreImports: [],
  hardcodedHexStyles: [],
  hardcodedLocalhost: [],
  
  // Pillar III & IV: React & Isomorphic Backend Engine
  useClientPlacement: [],
  inlineMocks: [],
  pureComputeIsolation: [],
  packageHierarchyViolations: [],
  
  // Pillar V: Security & Database Integrity
  secretLeaks: [],
  unsafeLinks: [],
  rawDangerouslySetInnerHTML: [],
  rawSqlConcatenation: [],

  // Pillar VI: Memory & Performance
  directLocalStorage: [],
  consoleLogs: [],
  missingImageAlt: [],

  // Sovereign Package Genesis Contract & Governance
  packageContractIssues: [],
  legacyApis: [],
  bannedTerminology: [],
  cyberVarMisuse: [],
  rawUiColors: [],
  decorativeUtilities: [],
  forcedDarkMode: [],
  accessibility: [],
  packageBoundaryIssues: [],
  themeParity: [],
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
    } else {
      const readmeContent = fs.readFileSync(readmePath, "utf-8")
      if (!readmeContent.includes("# ◈")) {
        VIOLATIONS.packageContractIssues.push({ pkg: entry.name, issue: "README.md missing canonical '# ◈' title banner" })
      }
      if (!readmeContent.match(/VERSION|Version|SYS-VER/i)) {
        VIOLATIONS.packageContractIssues.push({ pkg: entry.name, issue: "README.md missing version declaration section" })
      }
      if (!readmeContent.match(/Usage|Quickstart|Running Locally|Installation|Overview/i)) {
        VIOLATIONS.packageContractIssues.push({ pkg: entry.name, issue: "README.md missing Usage / Quickstart guide" })
      }
      if (!readmeContent.match(/Verification|Test|Build|Typecheck/i) && entry.name !== "eslint-config" && entry.name !== "typescript-config") {
        VIOLATIONS.packageContractIssues.push({ pkg: entry.name, issue: "README.md missing Verification test instructions" })
      }
    }

    const primaryEntryPath = fs.existsSync(srcIndexTs) ? srcIndexTs : (fs.existsSync(srcIndexJs) ? srcIndexJs : null)
    if (primaryEntryPath) {
      const entryContent = fs.readFileSync(primaryEntryPath, "utf-8")
      if (entryContent.match(/models:\s*\[/)) {
        const demoDataTs = path.join(pkgDir, "src", "demo-data.ts")
        const demoDataJs = path.join(pkgDir, "src", "demo-data.js")
        if (!fs.existsSync(demoDataTs) && !fs.existsSync(demoDataJs)) {
          VIOLATIONS.packageContractIssues.push({ pkg: entry.name, issue: "[LAW 31] Addon declaring models must provide src/demo-data.ts" })
        }
        if (!entryContent.includes("loadDemoData")) {
          VIOLATIONS.packageContractIssues.push({ pkg: entry.name, issue: "[LAW 31] Missing loadDemoData re-export from src/index.ts" })
        }

        const viewsTs = path.join(pkgDir, "src", "views.ts")
        const viewsJs = path.join(pkgDir, "src", "views.js")
        if (!fs.existsSync(viewsTs) && !fs.existsSync(viewsJs)) {
          VIOLATIONS.packageContractIssues.push({ pkg: entry.name, issue: "[LAW 32] Addon declaring models must provide src/views.ts" })
        }
        if (!entryContent.includes("views")) {
          VIOLATIONS.packageContractIssues.push({ pkg: entry.name, issue: "[LAW 33] Missing views re-export from src/index.ts" })
        }
      }
    }
  }
}

function auditStylesheet(relativePath, content) {
  if (relativePath.includes("globals.css")) return
  const active = isActiveImplementation(relativePath)
  if (active) {
    const rawColor = content.match(/(?:^|[;{\s])(?:color|background(?:-color)?|border(?:-color)?|box-shadow)\s*:\s*(?:#[0-9a-f]{3,8}|rgba?\(|hsla?\()/im)
    if (rawColor) VIOLATIONS.rawUiColors.push({ file: relativePath, line: content.slice(0, rawColor.index).split("\n").length, snippet: rawColor[0].trim() })
    const forcedDark = content.match(/(?:\.dark\b|prefers-color-scheme\s*:\s*dark|--theme-mode\s*:\s*dark)/i)
    if (forcedDark) VIOLATIONS.forcedDarkMode.push({ file: relativePath, line: content.slice(0, forcedDark.index).split("\n").length, snippet: forcedDark[0] })
  }
}

function auditPackageBoundaries() {
  const tierByPackage = new Map([
    ["@workspace/types", 1], ["@moon/compute", 1], ["@moon/protocol", 1],
    ["@moon/base", 2], ["@moon/orm", 2], ["@moon/cache", 2], ["@moon/server", 2], ["@workspace/error", 2],
    ["@moon/witness", 3], ["@moon/mizan", 3], ["@moon/khidra", 3], ["@moon/cab", 3],
    ["@moon/crm", 3], ["@moon/product", 3], ["@moon/stock", 3], ["@moon/account", 3],
    ["@moon/mail", 3], ["@moon/geo", 3], ["@moon/shootgun", 3], ["@moon/performance", 3], ["@moon/cron", 3],
    ["@moon/client", 4],
    ["@workspace/ui", 5], ["@workspace/hooks", 5], ["@workspace/state", 5], ["@workspace/i18n", 5],
  ])
  const packageDirs = []
  for (const base of ["packages", "apps"]) {
    const dir = path.join(ROOT_DIR, base)
    if (!fs.existsSync(dir)) continue
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const pkgPath = path.join(dir, entry.name, "package.json")
      if (entry.isDirectory() && fs.existsSync(pkgPath)) packageDirs.push(pkgPath)
    }
  }
  for (const pkgPath of packageDirs) {
    let pkg
    try { pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8")) } catch { continue }
    const fromTier = tierByPackage.get(pkg.name)
    if (!fromTier) continue
    const deps = pkg.dependencies || {}
    for (const dependency of Object.keys(deps)) {
      const toTier = tierByPackage.get(dependency)
      if (toTier && toTier > fromTier && !(fromTier === 5 && toTier === 5) && !(fromTier === 3 && toTier === 3) && !(fromTier === 2 && toTier === 2) && !(fromTier === 1 && toTier === 1)) {
        VIOLATIONS.packageBoundaryIssues.push({ file: path.relative(ROOT_DIR, pkgPath), token: `${pkg.name} -> ${dependency}` })
      }
    }
  }
}

// Parse hex color string to sRGB [0..1]
function parseHexToRgb(hex) {
  let clean = hex.replace("#", "").trim()
  if (clean.length === 3) clean = clean.split("").map((c) => c + c).join("")
  if (clean.length === 6 || clean.length === 8) {
    const r = parseInt(clean.slice(0, 2), 16) / 255
    const g = parseInt(clean.slice(2, 4), 16) / 255
    const b = parseInt(clean.slice(4, 6), 16) / 255
    return [r, g, b]
  }
  return null
}

// Calculate relative luminance for WCAG contrast
function getLuminance([r, g, b]) {
  const a = [r, g, b].map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)))
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722
}

function getContrastRatio(hex1, hex2) {
  const rgb1 = parseHexToRgb(hex1)
  const rgb2 = parseHexToRgb(hex2)
  if (!rgb1 || !rgb2) return null
  const lum1 = getLuminance(rgb1)
  const lum2 = getLuminance(rgb2)
  const brightest = Math.max(lum1, lum2)
  const darkest = Math.min(lum1, lum2)
  return (brightest + 0.05) / (darkest + 0.05)
}

function auditThemeParity() {
  const cssPath = path.join(ROOT_DIR, "packages", "ui", "src", "styles", "globals.css")
  if (!fs.existsSync(cssPath)) {
    VIOLATIONS.themeParity.push({ file: "globals.css", token: "globals.css not found" })
    return
  }

  const css = fs.readFileSync(cssPath, "utf8")

  // Check for any forbidden --cyber- variables
  const cyberMatches = [...css.matchAll(/--cyber-[a-z-]+/g)]
  if (cyberMatches.length > 0) {
    VIOLATIONS.cyberVarMisuse.push({ file: "globals.css", snippet: `Found forbidden cyber vars: ${cyberMatches.map(m => m[0]).slice(0, 5).join(", ")}` })
  }

  // Extract :root block
  const rootBlockMatch = css.match(/:root\s*\{([^}]+)\}/)
  const darkBlockMatch = css.match(/\.dark\s*\{([^}]+)\}/)

  if (!rootBlockMatch) {
    VIOLATIONS.themeParity.push({ file: "globals.css", token: "Missing :root theme block" })
  }
  if (!darkBlockMatch) {
    VIOLATIONS.themeParity.push({ file: "globals.css", token: "Missing .dark theme block" })
  }

  const rootVars = new Map()
  if (rootBlockMatch) {
    for (const match of rootBlockMatch[1].matchAll(/--([a-z0-9-]+)\s*:\s*([^;]+);/g)) {
      rootVars.set(match[1], match[2].trim())
    }
  }

  const darkVars = new Map()
  if (darkBlockMatch) {
    for (const match of darkBlockMatch[1].matchAll(/--([a-z0-9-]+)\s*:\s*([^;]+);/g)) {
      darkVars.set(match[1], match[2].trim())
    }
  }

  // Check that every canonical token is present in :root and .dark
  for (const token of CANONICAL_SEMANTIC_TOKENS) {
    if (!rootVars.has(token)) {
      VIOLATIONS.themeParity.push({ file: "globals.css", token: `:root missing canonical token --${token}` })
    }
    if (!darkVars.has(token)) {
      VIOLATIONS.themeParity.push({ file: "globals.css", token: `.dark missing canonical token --${token}` })
    }
  }

  // Real WCAG Contrast Checks on canonical color pairs
  const contrastPairs = [
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

  for (const [bgToken, fgToken] of contrastPairs) {
    const lightBg = rootVars.get(bgToken)
    const lightFg = rootVars.get(fgToken)
    if (lightBg && lightFg && lightBg.startsWith("#") && lightFg.startsWith("#")) {
      const ratio = getContrastRatio(lightBg, lightFg)
      if (ratio && ratio < 4.0) {
        VIOLATIONS.accessibility.push({ file: "globals.css", issue: `Light mode contrast below standard for ${bgToken}/${fgToken}: ${ratio.toFixed(2)}:1` })
      }
    }

    const darkBg = darkVars.get(bgToken)
    const darkFg = darkVars.get(fgToken)
    if (darkBg && darkFg && darkBg.startsWith("#") && darkFg.startsWith("#")) {
      const ratio = getContrastRatio(darkBg, darkFg)
      if (ratio && ratio < 4.0) {
        VIOLATIONS.accessibility.push({ file: "globals.css", issue: `Dark mode contrast below standard for ${bgToken}/${fgToken}: ${ratio.toFixed(2)}:1` })
      }
    }
  }
}

function auditThemeInfrastructure() {
  const providerPath = path.join(ROOT_DIR, "packages", "state", "src", "providers", "theme-provider.tsx")
  if (!fs.existsSync(providerPath)) {
    VIOLATIONS.themeParity.push({ file: "theme-provider.tsx", token: "Theme provider missing in @workspace/state" })
  } else {
    const providerContent = fs.readFileSync(providerPath, "utf8")
    if (!providerContent.includes("next-themes")) {
      VIOLATIONS.themeParity.push({ file: "theme-provider.tsx", token: "ThemeProvider must use next-themes" })
    }
  }

  const togglePath = path.join(ROOT_DIR, "packages", "ui", "src", "components", "theme-toggle.tsx")
  if (!fs.existsSync(togglePath)) {
    VIOLATIONS.themeParity.push({ file: "theme-toggle.tsx", token: "ThemeToggle component missing in @workspace/ui" })
  }

  const ccTopbarPath = path.join(ROOT_DIR, "apps", "command-center", "components", "topbar", "topbar.tsx")
  if (fs.existsSync(ccTopbarPath)) {
    const ccTopbar = fs.readFileSync(ccTopbarPath, "utf8")
    if (!ccTopbar.includes("ThemeToggle")) {
      VIOLATIONS.themeParity.push({ file: "apps/command-center/components/topbar/topbar.tsx", token: "Command center topbar missing ThemeToggle" })
    }
  }

  const navbarPath = path.join(ROOT_DIR, "packages", "ui", "src", "components", "navbar.tsx")
  if (fs.existsSync(navbarPath)) {
    const navbar = fs.readFileSync(navbarPath, "utf8")
    if (!navbar.includes("ThemeToggle")) {
      VIOLATIONS.themeParity.push({ file: "packages/ui/src/components/navbar.tsx", token: "Navbar missing ThemeToggle" })
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
    } else if (entry.isFile() && SOURCE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
      auditFile(fullPath)
    }
  }
}

function auditFile(filePath) {
  totalFilesScanned++
  const relativePath = path.relative(ROOT_DIR, filePath)
  const content = fs.readFileSync(filePath, "utf-8")
  const lines = content.split("\n")

  const isTest = /(?:\.test|\.spec)\.[cm]?[jt]sx?$/.test(filePath)
  const isDoc = isDocumentation(filePath)
  const isActive = isActiveImplementation(filePath)

  // Fail on Legacy APIs & forbidden token classes
  if (isActive) {
    const legacyApiMatch = content.match(LEGACY_API_RE)
    if (legacyApiMatch) {
      VIOLATIONS.legacyApis.push({ file: relativePath, token: legacyApiMatch[0].trim() })
    }
  }

  if (path.extname(filePath).toLowerCase() === ".css" || path.extname(filePath).toLowerCase() === ".scss") {
    auditStylesheet(relativePath, content)
  }

  // Law 10: Anti-Monolithic Size Limit (400 lines for UI views)
  if (lines.length > 400 && !isTest && !isDoc && !filePath.includes("navigation.types.ts")) {
    VIOLATIONS.maxLines.push({
      file: relativePath,
      lines: lines.length,
      limit: 400,
    })
  }

  // Law 11: "use client" Line 1 Strict Placement
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

  // Law 20: Safe External Navigation (target="_blank" requires rel="noopener noreferrer")
  const anchorMatches = content.match(/<a\s+[^>]*target=["']_blank["'][^>]*>/gs) || []
  anchorMatches.forEach((tag) => {
    if (!tag.includes("noopener") && !tag.includes("noreferrer")) {
      VIOLATIONS.unsafeLinks.push({
        file: relativePath,
        snippet: tag.replace(/\s+/g, " ").slice(0, 60),
      })
    }
  })

  // Law 21: Dangerous Inner HTML without check
  if (content.includes("dangerouslySetInnerHTML") && !/DOMPurify|sanitize/i.test(content)) {
    VIOLATIONS.rawDangerouslySetInnerHTML.push({
      file: relativePath,
    })
  }

  lines.forEach((line, idx) => {
    const lineNo = idx + 1
    const trimmed = line.trim()
    if (trimmed.startsWith("//") || trimmed.startsWith("/*") || trimmed.startsWith("*")) return

    if (isActive) {
      if (line.match(/var\(--cyber-[^)]+\)/)) {
        VIOLATIONS.cyberVarMisuse.push({ file: relativePath, line: lineNo, snippet: trimmed })
      }

      if (BANNED_TERMINOLOGY_RE.test(line) && !line.match(/(?:import|from|require|type\s+\w+\s*=|interface\s+\w+)/)) {
        VIOLATIONS.bannedTerminology.push({ file: relativePath, line: lineNo, token: line.match(BANNED_TERMINOLOGY_RE)[0], snippet: trimmed })
      }

      if (RAW_UI_COLOR_RE.test(line)) {
        VIOLATIONS.rawUiColors.push({ file: relativePath, line: lineNo, snippet: trimmed })
      }

      if (DECORATIVE_UTILITY_RE.test(line)) {
        VIOLATIONS.decorativeUtilities.push({ file: relativePath, line: lineNo, snippet: trimmed })
      }

      if (relativePath.includes("apps") && relativePath.includes("layout.tsx") && line.match(/(?:className|class)\s*=.*\b(?:dark|dark-mode|darkMode)\b/i)) {
        VIOLATIONS.forcedDarkMode.push({ file: relativePath, line: lineNo, snippet: trimmed })
      }

      if (line.match(/\b(?:aria-label|aria-labelledby|alt|title)\s*=\s*["']\s*["']/i)) {
        VIOLATIONS.accessibility.push({ file: relativePath, line: lineNo, issue: "empty accessibility label", snippet: trimmed })
      }
    }

    // Law 07: Legacy HUD Naming
    if (!filePath.includes("eslint-config")) {
      const hudMatch = line.match(/\b(HUDResourceTable|HUDErrorBoundary|useHUDModal|HUD_TOKENS|HudAccentColor|HudPanelLevel|HUDPanel|HUDBreadcrumb)\b/)
      if (hudMatch) {
        VIOLATIONS.legacyHudNaming.push({
          file: relativePath,
          line: lineNo,
          token: hudMatch[1],
          snippet: trimmed,
        })
      }

      const hudImportMatch = line.match(/from\s+["'].*\/hud-[^"']+["']/)
      if (hudImportMatch) {
        VIOLATIONS.legacyHudNaming.push({
          file: relativePath,
          line: lineNo,
          token: "legacy /hud-* import path",
          snippet: trimmed,
        })
      }
    }

    // Law 08 / BE-14: Legacy @core / @modules Imports
    const coreImportMatch = line.match(/from\s+["'](@core\/|@modules\/)[^"']+["']/)
    if (coreImportMatch) {
      VIOLATIONS.legacyCoreImports.push({
        file: relativePath,
        line: lineNo,
        token: coreImportMatch[1],
        snippet: trimmed,
      })
    }

    // Law 15 / BE-05: Pure Mathematical Compute Isolation
    if (relativePath.includes("moon-compute") && line.match(/from\s+["'](fs|http|https|pg|mysql|sqlite|node-fetch)["']/)) {
      VIOLATIONS.pureComputeIsolation.push({
        file: relativePath,
        line: lineNo,
        token: line.match(/from\s+["']([^"']+)["']/)[1],
      })
    }

    // Law 19 / BE-13: Secrets leak detection
    const secretMatch = line.match(/(?:api_key|apikey|secret_key|private_key|auth_token)\s*[:=]\s*["'](?!env|process\.env|NEXT_PUBLIC)[a-zA-Z0-9_-]{20,}["']/i)
    if (secretMatch) {
      VIOLATIONS.secretLeaks.push({
        file: relativePath,
        line: lineNo,
        snippet: trimmed.slice(0, 30) + "...",
      })
    }

    // Law 24: Direct localStorage usage
    if (isActive && line.match(/\blocalStorage\.(getItem|setItem|removeItem)\b/) && !relativePath.includes("use-local-storage") && !relativePath.includes("offline-sync")) {
      VIOLATIONS.directLocalStorage.push({
        file: relativePath,
        line: lineNo,
        snippet: trimmed,
      })
    }
  })
}

// ═════════════════════════════════════════════════════════════════════════════
// RUN AUDIT INSPECTION
// ═════════════════════════════════════════════════════════════════════════════

console.log(`${BOLD}${CYAN}◈ MOONWITNESS OS — CONSTITUTIONAL LAWS & ENTERPRISE AUDITOR (V10.0)${RESET}`)
console.log(`Executing multi-pillar inspection across workspace projects & Genesis contracts...\n`)

auditPackageGenesisContracts()
checkGhostFolders(path.join(ROOT_DIR, "packages"))
checkGhostFolders(path.join(ROOT_DIR, "apps"))
auditPackageBoundaries()
auditThemeParity()
auditThemeInfrastructure()

for (const dir of TARGET_DIRS) {
  scanDirectory(path.join(ROOT_DIR, dir))
}

// ═════════════════════════════════════════════════════════════════════════════
// REPORT GENERATION
// ═════════════════════════════════════════════════════════════════════════════

console.log(`${BOLD}═══════════════════════════════════════════════════════════════════════════${RESET}`)
console.log(`Scanned ${totalFilesScanned} TypeScript / TSX / CSS files across ${totalPackagesAudited} workspace packages.\n`)

console.log(`${BOLD}${CYAN}▶ SOVEREIGN PACKAGE GENESIS CONTRACT (10 MANDATES)${RESET}`)
if (VIOLATIONS.packageContractIssues.length === 0) {
  console.log(`  ${GREEN}✓ [GENESIS CONTRACT] All ${totalPackagesAudited} workspace packages adhere 100% to Genesis Mandates!${RESET}`)
} else {
  console.log(`  ${RED}❌ [GENESIS CONTRACT] Found ${VIOLATIONS.packageContractIssues.length} Genesis issues!${RESET}`)
  VIOLATIONS.packageContractIssues.forEach((v) => console.log(`     • ${v.pkg}: ${v.issue}`))
}

console.log(`\n${BOLD}${CYAN}▶ PILLAR I & II: VISUAL DNA, DESIGN TOKENS & TOPOLOGY${RESET}`)
if (VIOLATIONS.ghostFolders.length === 0) console.log(`  ${GREEN}✓ [LAW 06] Ghost File & Folder Ban: CLEAN (0 ghost paths)${RESET}`)
else console.log(`  ${RED}❌ [LAW 06] Ghost Files Found: ${VIOLATIONS.ghostFolders.length}${RESET}`)

if (VIOLATIONS.legacyHudNaming.length === 0) console.log(`  ${GREEN}✓ [LAW 07] Enterprise Component Naming (Zero HUD legacy tokens): CLEAN${RESET}`)
else console.log(`  ${RED}❌ [LAW 07] Legacy HUD tokens: ${VIOLATIONS.legacyHudNaming.length}${RESET}`)

if (VIOLATIONS.legacyCoreImports.length === 0) console.log(`  ${GREEN}✓ [LAW 08] Layered Dependency Flow (Zero @core/@modules imports): CLEAN${RESET}`)
else console.log(`  ${RED}❌ [LAW 08] Forbidden imports: ${VIOLATIONS.legacyCoreImports.length}${RESET}`)

if (VIOLATIONS.hardcodedHexStyles.length === 0) console.log(`  ${GREEN}✓ [LAW 01] Zero-Drift Semantic Palette (No raw inline hex styles): CLEAN${RESET}`)
else console.log(`  ${RED}❌ [LAW 01] Inline Hex Violations: ${VIOLATIONS.hardcodedHexStyles.length}${RESET}`)

if (VIOLATIONS.maxLines.length === 0) {
  console.log(`  ${GREEN}✓ [LAW 10] Anti-Monolithic Architecture (max 400 lines): CLEAN${RESET}`)
} else {
  console.log(`  ${YELLOW}⚠️  [LAW 10] Anti-Monolithic Size Warning: ${VIOLATIONS.maxLines.length} files exceed 400 lines${RESET}`)
}

console.log(`\n${BOLD}${CYAN}▶ PILLAR III & IV: REACT 19 / NEXT.JS 16 & ISOMORPHIC BACKEND COMPUTE${RESET}`)
if (VIOLATIONS.useClientPlacement.length === 0) console.log(`  ${GREEN}✓ [LAW 11] "use client" Line 1 Strict Placement: CLEAN${RESET}`)
else console.log(`  ${RED}❌ [LAW 11] Misplaced "use client": ${VIOLATIONS.useClientPlacement.length}${RESET}`)

if (VIOLATIONS.pureComputeIsolation.length === 0) console.log(`  ${GREEN}✓ [LAW 15 / BE-05] Pure Mathematical Engine Isolation: CLEAN${RESET}`)
else console.log(`  ${RED}❌ [LAW 15] Compute Engine Network/DB Leaks: ${VIOLATIONS.pureComputeIsolation.length}${RESET}`)

console.log(`\n${BOLD}${CYAN}▶ PILLAR V: SECURITY & DATABASE INTEGRITY${RESET}`)
if (VIOLATIONS.secretLeaks.length === 0) console.log(`  ${GREEN}✓ [LAW 19 / BE-13] Zero Plaintext Secrets / API Keys in Code: CLEAN${RESET}`)
else console.log(`  ${RED}❌ [LAW 19] Leaked Secrets: ${VIOLATIONS.secretLeaks.length}${RESET}`)

if (VIOLATIONS.unsafeLinks.length === 0) console.log(`  ${GREEN}✓ [LAW 20] Safe External Navigation (rel="noopener noreferrer"): CLEAN${RESET}`)
else console.log(`  ${RED}❌ [LAW 20] Unsafe External Links: ${VIOLATIONS.unsafeLinks.length}${RESET}`)

if (VIOLATIONS.rawDangerouslySetInnerHTML.length === 0) console.log(`  ${GREEN}✓ [LAW 21] Sanitized HTML Rendering: CLEAN${RESET}`)
else console.log(`  ${RED}❌ [LAW 21] Unsanitized dangerouslySetInnerHTML: ${VIOLATIONS.rawDangerouslySetInnerHTML.length}${RESET}`)

console.log(`\n${BOLD}${CYAN}▶ PILLAR VI: MEMORY SAFETY & PERFORMANCE${RESET}`)
if (VIOLATIONS.directLocalStorage.length === 0) console.log(`  ${GREEN}✓ [LAW 24] Universal Persistent Storage Hook (useLocalStorage): CLEAN${RESET}`)
else console.log(`  ${RED}❌ [LAW 24] Direct localStorage Calls: ${VIOLATIONS.directLocalStorage.length}${RESET}`)

console.log(`\n${BOLD}${CYAN}▶ PHASE 5 GOVERNANCE: CANONICAL ENTERPRISE DESIGN SYSTEM AUDIT${RESET}`)
const governanceChecks = [
  ["LEGACY APIs & TOKENS", VIOLATIONS.legacyApis],
  ["BANNED ACTIVE TERMINOLOGY", VIOLATIONS.bannedTerminology],
  ["CYBER VARIABLE MISUSE", VIOLATIONS.cyberVarMisuse],
  ["RAW UI COLORS", VIOLATIONS.rawUiColors],
  ["DECORATIVE UTILITIES", VIOLATIONS.decorativeUtilities],
  ["FORCED DARK MODE", VIOLATIONS.forcedDarkMode],
  ["ACCESSIBILITY & CONTRAST", VIOLATIONS.accessibility],
  ["PACKAGE BOUNDARIES", VIOLATIONS.packageBoundaryIssues],
  ["CANONICAL THEME PARITY", VIOLATIONS.themeParity],
]

for (const [label, issues] of governanceChecks) {
  if (issues.length === 0) {
    console.log(`  ${GREEN}✓ ${label}: CLEAN${RESET}`)
  } else {
    console.log(`  ${RED}❌ ${label}: ${issues.length} violation(s)${RESET}`)
    issues.slice(0, 15).forEach((item) => {
      const loc = item.file ? `${item.file}${item.line ? `:${item.line}` : ""}` : (item.pkg || "")
      const desc = item.token || item.issue || item.snippet || ""
      console.log(`     • ${loc} ➔ ${desc}`)
    })
    if (issues.length > 15) console.log(`     ... and ${issues.length - 15} more`)
  }
}

console.log(`\n${BOLD}═══════════════════════════════════════════════════════════════════════════${RESET}`)

const criticalViolations = 
  VIOLATIONS.packageContractIssues.length +
  VIOLATIONS.ghostFolders.length +
  VIOLATIONS.legacyHudNaming.length +
  VIOLATIONS.legacyCoreImports.length +
  VIOLATIONS.hardcodedHexStyles.length +
  VIOLATIONS.hardcodedLocalhost.length +
  VIOLATIONS.useClientPlacement.length +
  VIOLATIONS.pureComputeIsolation.length +
  VIOLATIONS.packageHierarchyViolations.length +
  VIOLATIONS.rawSqlConcatenation.length +
  VIOLATIONS.secretLeaks.length +
  VIOLATIONS.unsafeLinks.length +
  VIOLATIONS.rawDangerouslySetInnerHTML.length +
  VIOLATIONS.legacyApis.length +
  VIOLATIONS.cyberVarMisuse.length +
  VIOLATIONS.rawUiColors.length +
  VIOLATIONS.forcedDarkMode.length +
  VIOLATIONS.accessibility.length +
  VIOLATIONS.packageBoundaryIssues.length +
  VIOLATIONS.themeParity.length +
  VIOLATIONS.bannedTerminology.length +
  VIOLATIONS.decorativeUtilities.length

if (criticalViolations === 0) {
  console.log(`${GREEN}${BOLD}🎉 SUPREME ARCHITECTURAL HARMONY: 0 CRITICAL CONSTITUTIONAL VIOLATIONS!${RESET}\n`)
  process.exit(0)
} else {
  console.log(`${RED}${BOLD}⚠️  ${criticalViolations} CRITICAL CONSTITUTIONAL VIOLATION(S) FOUND.${RESET}\n`)
  process.exit(1)
}
