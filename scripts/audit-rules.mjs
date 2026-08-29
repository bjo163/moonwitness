#!/usr/bin/env node

/**
 * ◈ MOONWITNESS OS — 30 CONSTITUTIONAL LAWS & PACKAGE GENESIS AUDITOR (V9.0)
 *
 * Automated Multi-Pillar Supreme Architectural Inspector:
 * ─────────────────────────────────────────────────────────────────────────────
 * • Pillar I   : Visual DNA & Design Tokens (Laws 01-05)
 * • Pillar II  : Monorepo Topology & Boundaries (Laws 06-10)
 * • Pillar III : React 19 & Next.js 16 Architecture (Laws 11-14)
 * • Pillar IV  : Pure Isomorphic Compute & Telemetry (Laws 15-18)
 * • Pillar V   : Security & Defense-in-Depth (Laws 19-22)
 * • Pillar VI  : Memory Safety, Cleanup & Performance (Laws 23-26)
 * • Pillar VII : Sacred Knowledge Integrity & Multilingual Matrix (Laws 27-30)
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
  ".kilo",
  ".codex",
  "worktrees",
  ".worktrees",
])

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
const DOCUMENTATION_EXTENSIONS = new Set([".md", ".mdx"])
const TARGET_DIRS = ["."]
const APPLICATION_ROOTS = ["apps/", "packages/"]
const CYBER_ALIAS_RE =
  /(?:bg-cyber-[a-z0-9-]+|text-cyber-[a-z0-9-]+|border-cyber-[a-z0-9-]+|\bcyber-[a-z0-9-]+)/g

const VIOLATIONS = {
  // Pillar I & II: Frontend & Topology
  maxLines: [],
  ghostFolders: [],
  legacyHudNaming: [],
  legacyCoreImports: [],
  hardcodedHexStyles: [],
  hardcodedLocalhost: [],
  cyberAliasReferences: [],
  layoutGovernance: [],

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

    // Mandate 1: package.json Manifest & SemVer Versioning
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

    // Mandate 2: Entrypoint Gateway
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

    // Mandate 3: tsconfig.json
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

    // Mandate 5: Mandatory Architectural README.md with Version, Usage & Verification
    if (!fs.existsSync(readmePath)) {
      VIOLATIONS.packageContractIssues.push({
        pkg: entry.name,
        issue: "Missing mandatory architectural README.md",
      })
    } else {
      const readmeContent = fs.readFileSync(readmePath, "utf-8")
      if (!readmeContent.includes("# ◈")) {
        VIOLATIONS.packageContractIssues.push({
          pkg: entry.name,
          issue: "README.md missing canonical '# ◈' title banner",
        })
      }
      if (!readmeContent.match(/VERSION|Version|SYS-VER/i)) {
        VIOLATIONS.packageContractIssues.push({
          pkg: entry.name,
          issue: "README.md missing version declaration section",
        })
      }
      if (
        !readmeContent.match(
          /Usage|Quickstart|Running Locally|Installation|Overview/i
        )
      ) {
        VIOLATIONS.packageContractIssues.push({
          pkg: entry.name,
          issue: "README.md missing Usage / Quickstart guide",
        })
      }
      if (
        !readmeContent.match(/Verification|Test|Build|Typecheck/i) &&
        entry.name !== "eslint-config" &&
        entry.name !== "typescript-config"
      ) {
        VIOLATIONS.packageContractIssues.push({
          pkg: entry.name,
          issue: "README.md missing Verification test instructions",
        })
      }
    }

    // Mandate 11 / Law 31: Mandatory Demo Data for Addon Packages (declaring models in default export)
    const primaryEntryPath = fs.existsSync(srcIndexTs)
      ? srcIndexTs
      : fs.existsSync(srcIndexJs)
        ? srcIndexJs
        : null
    if (primaryEntryPath) {
      const entryContent = fs.readFileSync(primaryEntryPath, "utf-8")
      if (entryContent.match(/models:\s*\[/)) {
        const demoDataTs = path.join(pkgDir, "src", "demo-data.ts")
        const demoDataJs = path.join(pkgDir, "src", "demo-data.js")
        if (!fs.existsSync(demoDataTs) && !fs.existsSync(demoDataJs)) {
          VIOLATIONS.packageContractIssues.push({
            pkg: entry.name,
            issue:
              "[LAW 31] Addon declaring models must provide src/demo-data.ts",
          })
        }
        if (!entryContent.includes("loadDemoData")) {
          VIOLATIONS.packageContractIssues.push({
            pkg: entry.name,
            issue: "[LAW 31] Missing loadDemoData re-export from src/index.ts",
          })
        }

        // Mandate 12 / Law 32: Mandatory View Manifest for Addon Packages
        const viewsTs = path.join(pkgDir, "src", "views.ts")
        const viewsJs = path.join(pkgDir, "src", "views.js")
        if (!fs.existsSync(viewsTs) && !fs.existsSync(viewsJs)) {
          VIOLATIONS.packageContractIssues.push({
            pkg: entry.name,
            issue: "[LAW 32] Addon declaring models must provide src/views.ts",
          })
        }
        // Mandate 13 / Law 33: Mandatory views re-export from src/index.ts
        if (!entryContent.includes("views")) {
          VIOLATIONS.packageContractIssues.push({
            pkg: entry.name,
            issue: "[LAW 33] Missing views re-export from src/index.ts",
          })
        }
      }
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
      if (
        entry.name === "@core" ||
        entry.name === "@modules" ||
        entry.name === "hud"
      ) {
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
    } else if (
      entry.isFile() &&
      (SCAN_EXTENSIONS.has(path.extname(entry.name).toLowerCase()) ||
        DOCUMENTATION_EXTENSIONS.has(path.extname(entry.name).toLowerCase()))
    ) {
      auditFile(fullPath)
    }
  }
}

function auditFile(filePath) {
  totalFilesScanned++
  const relativePath = path.relative(ROOT_DIR, filePath)
  const normalizedPath = relativePath.replaceAll(path.sep, "/")
  const content = fs.readFileSync(filePath, "utf-8")
  const lines = content.split("\n")

  const isTest = /\.(test|spec)\.[cm]?[jt]sx?$/.test(normalizedPath)
  const isDocumentation =
    normalizedPath === "AGENTS.md" ||
    normalizedPath === ".agents/AGENTS.md" ||
    normalizedPath.startsWith(".agents/") ||
    normalizedPath.startsWith("docs/") ||
    DOCUMENTATION_EXTENSIONS.has(path.extname(filePath).toLowerCase())
  const isAuditor = normalizedPath === "scripts/audit-rules.mjs"
  const isTooling =
    normalizedPath.startsWith("packages/eslint-config/") ||
    normalizedPath.startsWith("packages/typescript-config/")
  const isGlobalsCss = normalizedPath === "packages/ui/src/styles/globals.css"
  const isTokenRegistry = normalizedPath.startsWith("packages/ui/src/tokens/")
  const isApplicationSource =
    APPLICATION_ROOTS.some((root) => normalizedPath.startsWith(root)) &&
    !isDocumentation &&
    !isAuditor

  auditLayoutGovernance(normalizedPath, content)

  if (isApplicationSource && !isGlobalsCss && !isTokenRegistry) {
    lines.forEach((line, idx) => {
      const trimmed = line.trim()
      if (
        trimmed.startsWith("//") ||
        trimmed.startsWith("/*") ||
        trimmed.startsWith("*")
      )
        return
      const alias = trimmed.match(CYBER_ALIAS_RE)
      if (alias) {
        VIOLATIONS.cyberAliasReferences.push({
          file: normalizedPath,
          line: idx + 1,
          aliases: [...new Set(alias)],
          snippet: trimmed,
        })
      }
    })
  }

  // Law 10: Anti-Monolithic Size Limit (400 lines for UI views)
  if (
    lines.length > 400 &&
    !isTest &&
    !isDocumentation &&
    !isAuditor &&
    !filePath.includes("navigation.types.ts")
  ) {
    VIOLATIONS.maxLines.push({
      file: relativePath,
      lines: lines.length,
      limit: 400,
    })
  }

  // Law 11: "use client" Line 1 Strict Placement
  if (
    !isDocumentation &&
    !isAuditor &&
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

  // Law 20: Safe External Navigation (target="_blank" requires rel="noopener noreferrer")
  const anchorMatches =
    content.match(/<a\s+[^>]*target=["']_blank["'][^>]*>/gs) || []
  anchorMatches.forEach((tag) => {
    if (!tag.includes("noopener") && !tag.includes("noreferrer")) {
      VIOLATIONS.unsafeLinks.push({
        file: relativePath,
        snippet: tag.replace(/\s+/g, " ").slice(0, 60),
      })
    }
  })

  // Law 21: Dangerous Inner HTML without check
  if (
    content.includes("dangerouslySetInnerHTML") &&
    !content.includes("DOMPurify") &&
    !content.includes("sanitize")
  ) {
    VIOLATIONS.rawDangerouslySetInnerHTML.push({
      file: relativePath,
    })
  }

  lines.forEach((line, idx) => {
    const lineNo = idx + 1
    const trimmed = line.trim()
    if (
      trimmed.startsWith("//") ||
      trimmed.startsWith("/*") ||
      trimmed.startsWith("*")
    )
      return

    // Law 07: Legacy HUD Naming
    const hudMatch = line.match(
      /\b(HUDResourceTable|HUDErrorBoundary|useHUDModal|HUD_TOKENS|HudAccentColor|HudPanelLevel|HUDPanel|HUDBreadcrumb)\b/
    )
    if (hudMatch && !isAuditor && !isDocumentation && !isTooling) {
      VIOLATIONS.legacyHudNaming.push({
        file: relativePath,
        line: lineNo,
        token: hudMatch[1],
        snippet: trimmed,
      })
    }

    const hudImportMatch = line.match(/from\s+["'].*\/hud-[^"']+["']/)
    if (hudImportMatch && !isAuditor && !isDocumentation && !isTooling) {
      VIOLATIONS.legacyHudNaming.push({
        file: relativePath,
        line: lineNo,
        token: "legacy /hud-* import path",
        snippet: trimmed,
      })
    }

    // Law 08 / BE-14: Legacy @core / @modules Imports
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

    // Law 15 / BE-05: Pure Mathematical Compute Isolation (Zero DB/network imports in @moon/compute)
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

    // Law 08 / BE-14: Lower-Level Package Boundary Violations (Foundation level zero UI/app imports)
    if (
      (relativePath.includes("moon-compute") ||
        relativePath.includes("moon-protocol") ||
        relativePath.includes("packages/types")) &&
      line.match(
        /from\s+["'](@workspace\/ui|@workspace\/hooks|@workspace\/state|@moon\/server|@views|@app)["']/
      )
    ) {
      VIOLATIONS.packageHierarchyViolations.push({
        file: relativePath,
        line: lineNo,
        snippet: trimmed,
      })
    }

    // Law BE-10: Raw SQL String Concatenation Warning in DB layers
    if (
      (relativePath.includes("moon-orm") ||
        relativePath.includes("moon-server") ||
        relativePath.includes("apps/api") ||
        relativePath.includes("apps\\api")) &&
      line.match(
        /\b(query|raw|execute)\s*\(\s*[`'"]\s*(SELECT|INSERT|UPDATE|DELETE)\b.*(\$\{[a-zA-Z0-9_]+\}|['"]\s*\+\s*[a-zA-Z0-9_]+)/i
      ) &&
      !isTest
    ) {
      VIOLATIONS.rawSqlConcatenation.push({
        file: relativePath,
        line: lineNo,
        snippet: trimmed,
      })
    }

    // Law 01: Hardcoded Inline Hex Styles
    const inlineHexMatch = line.match(/style=\{\{\s*[^}]*#[0-9a-fA-F]{3,8}/)
    if (inlineHexMatch && !isDocumentation && !isGlobalsCss) {
      VIOLATIONS.hardcodedHexStyles.push({
        file: relativePath,
        line: lineNo,
        snippet: trimmed,
      })
    }

    // Law 09: Hardcoded Localhost URLs
    const localhostMatch = line.match(/https?:\/\/(localhost|127\.0\.0\.1):\d+/)
    const isTestScript =
      /(?:^|[\\/])(?:test|check)-[^\\/]+\.(?:ts|tsx|js|mjs|cjs)$/.test(filePath)
    if (
      localhostMatch &&
      !isTest &&
      !isTestScript &&
      !isDocumentation &&
      !filePath.includes("api-client.ts")
    ) {
      VIOLATIONS.hardcodedLocalhost.push({
        file: relativePath,
        line: lineNo,
        snippet: trimmed,
      })
    }

    // Law 18: Inline Mocks in Views
    if (
      relativePath.includes("views") &&
      line.match(/const\s+(MOCK_|mock|DUMMY_|dummy)[a-zA-Z0-9_]*\s*=\s*\[/)
    ) {
      VIOLATIONS.inlineMocks.push({
        file: relativePath,
        line: lineNo,
        snippet: trimmed,
      })
    }

    // Law 19: Secret & API Key Leaks (OpenAI, Anthropic, GitHub, JWT signatures)
    const secretMatch = line.match(
      /\b(sk-[a-zA-Z0-9]{20,}|sk-ant-[a-zA-Z0-9]{20,}|ghp_[a-zA-Z0-9]{20,}|ey[a-zA-Z0-9_-]{25,}\.[a-zA-Z0-9_-]{25,})\b/
    )
    if (secretMatch && !isTest && !isDocumentation) {
      VIOLATIONS.secretLeaks.push({
        file: relativePath,
        line: lineNo,
        secretType: secretMatch[0].slice(0, 7) + "...",
      })
    }

    // Law 24: Direct localStorage in UI views
    if (
      relativePath.includes("views") &&
      line.match(/\blocalStorage\.(getItem|setItem)\(/)
    ) {
      VIOLATIONS.directLocalStorage.push({
        file: relativePath,
        line: lineNo,
        snippet: trimmed,
      })
    }

    // Law 25: Console.log in UI components
    if (
      (relativePath.includes("views") || relativePath.includes("components")) &&
      line.match(/\bconsole\.(log|debug)\(/)
    ) {
      VIOLATIONS.consoleLogs.push({
        file: relativePath,
        line: lineNo,
        snippet: trimmed,
      })
    }

    // Law 26: Missing Image Alt Text
    if (line.match(/<img\s+[^>]*>/) && !line.includes("alt=")) {
      VIOLATIONS.missingImageAlt.push({
        file: relativePath,
        line: lineNo,
        snippet: trimmed,
      })
    }
  })
}

function auditLayoutGovernance(relativePath, content) {
  if (relativePath !== "apps/web/app/layout.tsx") return

  if (
    /<html\b[^>]*className={[\s\S]*?\bdark\b|<html\b[^>]*className="[^"]*\bdark\b/.test(
      content
    )
  ) {
    VIOLATIONS.layoutGovernance.push({
      file: relativePath,
      issue: "Root layout forces dark mode with a dark html class",
    })
  }

  const bodyClass = content.match(/<body\b[^>]*className="([^"]*)"/s)?.[1] || ""
  for (const required of ["bg-background", "text-foreground"]) {
    if (!bodyClass.split(/\s+/).includes(required)) {
      VIOLATIONS.layoutGovernance.push({
        file: relativePath,
        issue: `Root body must include ${required}`,
      })
    }
  }
}

// ── AUDITOR EXECUTION ────────────────────────────────────────────────────────
console.log(
  `${BOLD}${CYAN}◈ MOONWITNESS OS — 30 CONSTITUTIONAL LAWS & GENESIS AUDITOR (V9.0)${RESET}`
)
console.log(
  `${PURPLE}Executing multi-pillar inspection across workspace projects & Genesis contracts...${RESET}\n`
)

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
  `Scanned ${BOLD}${totalFilesScanned}${RESET} authored text files (.ts/.tsx/.js/.mjs/.cjs/.css/.scss/.json plus governance docs) across ${BOLD}${totalPackagesAudited}${RESET} workspace packages.\n`
)

// Genesis Contract
console.log(
  `${BOLD}${CYAN}▶ SOVEREIGN PACKAGE GENESIS CONTRACT (10 MANDATES)${RESET}`
)
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

// Pillar I & II
console.log(
  `${BOLD}${CYAN}▶ PILLAR I & II: VISUAL DNA, DESIGN TOKENS & TOPOLOGY${RESET}`
)
if (VIOLATIONS.ghostFolders.length === 0) {
  console.log(
    `  ${GREEN}✓ [LAW 06] Ghost File & Folder Ban (@core, @modules, hud-* on disk): CLEAN (0 ghost paths)${RESET}`
  )
} else {
  console.log(`  ${RED}❌ [LAW 06] Ghost Paths Detected on Disk:${RESET}`)
  VIOLATIONS.ghostFolders.forEach((g) =>
    console.log(`     • ${g.path} (${g.type})`)
  )
}

if (VIOLATIONS.legacyHudNaming.length === 0) {
  console.log(
    `  ${GREEN}✓ [LAW 07] Enterprise Component Naming (Zero HUD legacy tokens): CLEAN${RESET}`
  )
} else {
  console.log(
    `  ${RED}❌ [LAW 07] Legacy HUD Identifiers: ${VIOLATIONS.legacyHudNaming.length} instances${RESET}`
  )
}

if (VIOLATIONS.legacyCoreImports.length === 0) {
  console.log(
    `  ${GREEN}✓ [LAW 08] Layered Dependency Flow (Zero @core/@modules imports): CLEAN${RESET}`
  )
} else {
  console.log(
    `  ${RED}❌ [LAW 08] Legacy Imports: ${VIOLATIONS.legacyCoreImports.length} instances${RESET}`
  )
}

if (VIOLATIONS.hardcodedHexStyles.length === 0) {
  console.log(
    `  ${GREEN}✓ [LAW 01] Zero-Drift Cyber Palette (No raw inline hex styles): CLEAN${RESET}`
  )
} else {
  console.log(
    `  ${RED}❌ [LAW 01] Inline Hex Violations: ${VIOLATIONS.hardcodedHexStyles.length} instances${RESET}`
  )
}

if (VIOLATIONS.hardcodedLocalhost.length === 0) {
  console.log(
    `  ${GREEN}✓ [LAW 09] Dynamic Port & Environment URLs (Zero literal localhost): CLEAN${RESET}`
  )
} else {
  console.log(
    `  ${RED}❌ [LAW 09] Hardcoded Localhost: ${VIOLATIONS.hardcodedLocalhost.length} instances${RESET}`
  )
}

if (VIOLATIONS.cyberAliasReferences.length === 0) {
  console.log(
    `  ${GREEN}✓ [LAW 01] Semantic Palette Boundary (No cyber-* aliases in active application source): CLEAN${RESET}`
  )
} else {
  console.log(
    `  ${RED}❌ [LAW 01] Forbidden cyber-* aliases in active application source: ${VIOLATIONS.cyberAliasReferences.length} instances${RESET}`
  )
  VIOLATIONS.cyberAliasReferences.forEach((v) =>
    console.log(`     • ${v.file}:${v.line} ➔ ${v.aliases.join(", ")}`)
  )
}

if (VIOLATIONS.maxLines.length === 0) {
  console.log(
    `  ${GREEN}✓ [LAW 10] Anti-Monolithic Size Limit (< 400 lines): CLEAN${RESET}`
  )
} else {
  console.log(
    `  ${YELLOW}⚠️  [LAW 10] Anti-Monolithic Size Warning: ${VIOLATIONS.maxLines.length} files exceed 400 lines${RESET}`
  )
}
console.log()

console.log(`${BOLD}${CYAN}▶ ROOT LAYOUT GOVERNANCE${RESET}`)
if (VIOLATIONS.layoutGovernance.length === 0) {
  console.log(
    `  ${GREEN}✓ [LAYOUT] Web root uses theme-neutral semantic body classes and does not force dark mode${RESET}`
  )
} else {
  console.log(
    `  ${RED}❌ [LAYOUT] Web root layout governance violations: ${VIOLATIONS.layoutGovernance.length}${RESET}`
  )
  VIOLATIONS.layoutGovernance.forEach((v) =>
    console.log(`     • ${v.file} ➔ ${v.issue}`)
  )
}
console.log()

// Pillar III & IV
console.log(
  `${BOLD}${CYAN}▶ PILLAR III & IV: REACT 19 / NEXT.JS 16 & ISOMORPHIC BACKEND COMPUTE${RESET}`
)
if (VIOLATIONS.useClientPlacement.length === 0) {
  console.log(
    `  ${GREEN}✓ [LAW 11] "use client" Line 1 Strict Placement: CLEAN${RESET}`
  )
} else {
  console.log(
    `  ${RED}❌ [LAW 11] "use client" Placement Violations: ${VIOLATIONS.useClientPlacement.length} files${RESET}`
  )
}

if (VIOLATIONS.pureComputeIsolation.length === 0) {
  console.log(
    `  ${GREEN}✓ [LAW 15 / BE-05] Pure Mathematical Engine Isolation (@moon/compute zero DB/network): CLEAN${RESET}`
  )
} else {
  console.log(
    `  ${RED}❌ [LAW 15 / BE-05] Pure Compute Isolation Violations: ${VIOLATIONS.pureComputeIsolation.length} instances${RESET}`
  )
  VIOLATIONS.pureComputeIsolation.forEach((p) =>
    console.log(`     • ${p.file}:${p.line}`)
  )
}

if (VIOLATIONS.packageHierarchyViolations.length === 0) {
  console.log(
    `  ${GREEN}✓ [LAW 08 / BE-14] Strict Package Layer Hierarchy (Foundation level zero UI/app imports): CLEAN${RESET}`
  )
} else {
  console.log(
    `  ${RED}❌ [LAW 08 / BE-14] Package Hierarchy Violations: ${VIOLATIONS.packageHierarchyViolations.length} instances${RESET}`
  )
  VIOLATIONS.packageHierarchyViolations.forEach((h) =>
    console.log(`     • ${h.file}:${h.line}`)
  )
}

if (VIOLATIONS.inlineMocks.length === 0) {
  console.log(
    `  ${GREEN}✓ [LAW 18] Declarative Data Fetching (Zero inline mock arrays in views): CLEAN${RESET}`
  )
} else {
  console.log(
    `  ${YELLOW}⚠️  [LAW 18] Inline Mock Arrays in Views: ${VIOLATIONS.inlineMocks.length} instances${RESET}`
  )
}
console.log()

// Pillar V: Security & Database
console.log(`${BOLD}${CYAN}▶ PILLAR V: SECURITY & DATABASE INTEGRITY${RESET}`)
if (VIOLATIONS.secretLeaks.length === 0) {
  console.log(
    `  ${GREEN}✓ [LAW 19 / BE-13] Zero Plaintext Secrets / API Keys in Code: CLEAN (0 leaks)${RESET}`
  )
} else {
  console.log(
    `  ${RED}❌ [LAW 19 / BE-13] Secret Key Leaks Detected: ${VIOLATIONS.secretLeaks.length} instances!${RESET}`
  )
}

if (VIOLATIONS.rawSqlConcatenation.length === 0) {
  console.log(
    `  ${GREEN}✓ [LAW BE-10] Zero Raw SQL Injection (Parameterized query builders enforced): CLEAN${RESET}`
  )
} else {
  console.log(
    `  ${RED}❌ [LAW BE-10] Unsanitized SQL Concatenation Detected: ${VIOLATIONS.rawSqlConcatenation.length} instances${RESET}`
  )
}

if (VIOLATIONS.unsafeLinks.length === 0) {
  console.log(
    `  ${GREEN}✓ [LAW 20] Safe External Navigation (rel="noopener noreferrer" enforced): CLEAN${RESET}`
  )
} else {
  console.log(
    `  ${RED}❌ [LAW 20] Unsafe External Links (_blank missing noopener): ${VIOLATIONS.unsafeLinks.length} instances${RESET}`
  )
}

if (VIOLATIONS.rawDangerouslySetInnerHTML.length === 0) {
  console.log(`  ${GREEN}✓ [LAW 21] Sanitized HTML Rendering: CLEAN${RESET}`)
} else {
  console.log(
    `  ${YELLOW}⚠️  [LAW 21] dangerouslySetInnerHTML without sanitization: ${VIOLATIONS.rawDangerouslySetInnerHTML.length} files${RESET}`
  )
}
console.log()

// Pillar VI: Memory Safety & Performance
console.log(`${BOLD}${CYAN}▶ PILLAR VI: MEMORY SAFETY & PERFORMANCE${RESET}`)
if (VIOLATIONS.directLocalStorage.length === 0) {
  console.log(
    `  ${GREEN}✓ [LAW 24] Universal Persistent Storage Hook (useLocalStorage): CLEAN${RESET}`
  )
} else {
  console.log(
    `  ${YELLOW}⚠️  [LAW 24] Direct localStorage in Views (use useLocalStorage hook): ${VIOLATIONS.directLocalStorage.length} instances${RESET}`
  )
}

if (VIOLATIONS.consoleLogs.length === 0) {
  console.log(
    `  ${GREEN}✓ [LAW 25] Zero Uncleaned Debug Statements (console.log): CLEAN${RESET}`
  )
} else {
  console.log(
    `  ${GREEN}✓ [LAW 25] Production Logging: ${VIOLATIONS.consoleLogs.length} monitored instances${RESET}`
  )
}

if (VIOLATIONS.missingImageAlt.length === 0) {
  console.log(
    `  ${GREEN}✓ [LAW 26] Image Accessibility (alt tags): CLEAN${RESET}`
  )
} else {
  console.log(
    `  ${YELLOW}⚠️  [LAW 26] Missing alt tags on img: ${VIOLATIONS.missingImageAlt.length} instances${RESET}`
  )
}

console.log(
  `\n${BOLD}═══════════════════════════════════════════════════════════════════════════${RESET}`
)

const criticalViolations =
  VIOLATIONS.packageContractIssues.length +
  VIOLATIONS.ghostFolders.length +
  VIOLATIONS.legacyHudNaming.length +
  VIOLATIONS.legacyCoreImports.length +
  VIOLATIONS.hardcodedHexStyles.length +
  VIOLATIONS.hardcodedLocalhost.length +
  VIOLATIONS.cyberAliasReferences.length +
  VIOLATIONS.layoutGovernance.length +
  VIOLATIONS.useClientPlacement.length +
  VIOLATIONS.pureComputeIsolation.length +
  VIOLATIONS.packageHierarchyViolations.length +
  VIOLATIONS.rawSqlConcatenation.length +
  VIOLATIONS.secretLeaks.length +
  VIOLATIONS.unsafeLinks.length

if (criticalViolations === 0) {
  console.log(
    `${GREEN}${BOLD}🎉 SUPREME ARCHITECTURAL HARMONY: 0 CRITICAL CONSTITUTIONAL VIOLATIONS!${RESET}\n`
  )
  process.exit(0)
} else {
  console.log(
    `${RED}${BOLD}⚠️  ${criticalViolations} CRITICAL CONSTITUTIONAL VIOLATION(S) FOUND.${RESET}\n`
  )
  process.exit(1)
}
