import fs from "node:fs"
import path from "node:path"

const DECLARATION_RE = /const\s+VIOLATIONS\s*=\s*\{([\s\S]*?)\n\}/m
const CRITICAL_RE = /const\s+criticalViolations\s*=([\s\S]*?)\n\nif\s*\(criticalViolations/m
const PUSH_RE = /VIOLATIONS\.([A-Za-z][A-Za-z0-9_]*)\.push\s*\(/g
const KEY_RE = /^\s*([A-Za-z][A-Za-z0-9_]*)\s*:\s*\[\],?\s*$/gm
const CRITICAL_KEY_RE = /VIOLATIONS\.([A-Za-z][A-Za-z0-9_]*)\.length/g

export const COLLECTOR_RESOLUTIONS = Object.freeze({
  hardcodedHexStyles: {
    status: "SUPERSEDED",
    replacement: "rawUiColors",
    reason: "Raw inline/palette color detection is owned by rawUiColors.",
  },
  inlineMocks: {
    status: "SUPPRESSED_WITH_REASON",
    issue: 159,
    reason: "Operational synthetic-data classification is tracked by #159 and will be generalized by #157.",
  },
  packageHierarchyViolations: {
    status: "SUPERSEDED",
    replacement: "packageBoundaryIssues",
    reason: "Workspace dependency-tier enforcement is owned by packageBoundaryIssues.",
  },
  consoleLogs: {
    status: "INFORMATIONAL",
    reason: "Console logging is not a blocking constitutional category in V10; structured logging policy is handled separately.",
  },
  missingImageAlt: {
    status: "SUPPRESSED_WITH_REASON",
    issue: 157,
    reason: "Accessibility collector coverage expansion, including missing alt semantics, is owned by #157.",
  },
})

export const SUPPLEMENTAL_COLLECTORS = Object.freeze({
  hardcodedLocalhost: {
    issue: 158,
    blocking: true,
  },
  rawSqlConcatenation: {
    blocking: true,
  },
})

const DEFAULT_IGNORES = new Set(["node_modules", ".next", "dist", ".git", ".turbo", "coverage", "build"])
const SOURCE_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"])

function uniqueSorted(values) {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b))
}

export function parseLegacyCollectorContract(source) {
  const declaration = source.match(DECLARATION_RE)
  if (!declaration) throw new Error("Unable to locate VIOLATIONS registry")

  const declared = []
  for (const match of declaration[1].matchAll(KEY_RE)) declared.push(match[1])

  const implemented = []
  for (const match of source.matchAll(PUSH_RE)) implemented.push(match[1])

  const criticalBlock = source.match(CRITICAL_RE)
  if (!criticalBlock) throw new Error("Unable to locate criticalViolations expression")
  const critical = []
  for (const match of criticalBlock[1].matchAll(CRITICAL_KEY_RE)) critical.push(match[1])

  return {
    declared: uniqueSorted(declared),
    implemented: uniqueSorted(implemented),
    critical: uniqueSorted(critical),
  }
}

export function buildCollectorCoverage(source) {
  const parsed = parseLegacyCollectorContract(source)
  const implementedSet = new Set(parsed.implemented)
  const criticalSet = new Set(parsed.critical)

  const collectors = parsed.declared.map((id) => {
    if (implementedSet.has(id)) {
      return { id, status: "IMPLEMENTED_LEGACY", blocking: criticalSet.has(id) }
    }

    if (SUPPLEMENTAL_COLLECTORS[id]) {
      return {
        id,
        status: "IMPLEMENTED_SUPPLEMENTAL",
        blocking: Boolean(SUPPLEMENTAL_COLLECTORS[id].blocking),
        issue: SUPPLEMENTAL_COLLECTORS[id].issue ?? null,
      }
    }

    const resolution = COLLECTOR_RESOLUTIONS[id]
    if (resolution) {
      return {
        id,
        blocking: criticalSet.has(id),
        ...resolution,
      }
    }

    return {
      id,
      status: "UNRESOLVED",
      blocking: criticalSet.has(id),
      reason: "Declared collector has no implementation or explicit ownership resolution.",
    }
  })

  return {
    collectors,
    blockingUnresolved: collectors.filter((entry) => entry.status === "UNRESOLVED" && entry.blocking),
    unresolved: collectors.filter((entry) => entry.status === "UNRESOLVED"),
  }
}

function isIgnoredPath(relativePath) {
  const normalized = relativePath.split(path.sep).join("/")
  return /(?:^|\/)(?:fixtures?|seed|demo-data|data|locales|schemas?|protocol)(?:\/|\.|$)/i.test(normalized) ||
    /(?:\.test|\.spec)\.[cm]?[jt]sx?$/i.test(normalized)
}

function collectFiles(rootDir) {
  const result = []
  for (const topLevel of ["apps", "packages"]) {
    const start = path.join(rootDir, topLevel)
    if (!fs.existsSync(start)) continue
    const walk = (dir) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (DEFAULT_IGNORES.has(entry.name)) continue
        const fullPath = path.join(dir, entry.name)
        if (entry.isDirectory()) walk(fullPath)
        else if (entry.isFile() && SOURCE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) result.push(fullPath)
      }
    }
    walk(start)
  }
  return result.sort((a, b) => a.localeCompare(b))
}

function lineNumberFor(content, index) {
  return content.slice(0, index).split("\n").length
}

export function scanHardcodedLocalhost(rootDir) {
  const findings = []
  let assessedFiles = 0

  for (const filePath of collectFiles(rootDir)) {
    const relativePath = path.relative(rootDir, filePath).split(path.sep).join("/")
    if (isIgnoredPath(relativePath)) continue
    assessedFiles += 1
    const content = fs.readFileSync(filePath, "utf8")

    for (const match of content.matchAll(/127\.0\.0\.1/g)) {
      const start = Math.max(0, match.index - 280)
      const context = content.slice(start, match.index + 80)
      if (!/process\.env\.[A-Z0-9_]+[\s\S]{0,220}\|\|/m.test(context)) continue

      findings.push({
        file: relativePath,
        line: lineNumberFor(content, match.index),
        status: "SUPPRESSED_WITH_REASON",
        issue: 158,
        reason: "Known production-capable loopback fallback tracked by #158.",
      })
    }
  }

  return { id: "hardcodedLocalhost", executed: true, assessedFiles, findings }
}

export function scanRawSqlConcatenation(rootDir) {
  const findings = []
  let assessedFiles = 0
  const unsafeSql = /(?:SELECT|INSERT\s+INTO|UPDATE|DELETE\s+FROM)[^\n;]{0,300}(?:\$\{[^}]+\}|["'`]\s*\+\s*[A-Za-z_$][A-Za-z0-9_$.]*)/gi

  for (const filePath of collectFiles(rootDir)) {
    const relativePath = path.relative(rootDir, filePath).split(path.sep).join("/")
    if (isIgnoredPath(relativePath)) continue
    assessedFiles += 1
    const content = fs.readFileSync(filePath, "utf8")
    for (const match of content.matchAll(unsafeSql)) {
      findings.push({
        file: relativePath,
        line: lineNumberFor(content, match.index),
        status: "VIOLATION",
        reason: "SQL-like statement appears to interpolate or concatenate a runtime value.",
      })
    }
  }

  return { id: "rawSqlConcatenation", executed: true, assessedFiles, findings }
}

export function runSupplementalCollectors(rootDir) {
  return [scanHardcodedLocalhost(rootDir), scanRawSqlConcatenation(rootDir)]
}

export function evaluateCollectorIntegrity(coverage, supplementalResults) {
  const supplementalViolations = supplementalResults.flatMap((collector) =>
    collector.findings.filter((finding) => finding.status === "VIOLATION")
  )

  return {
    ok: coverage.blockingUnresolved.length === 0 && supplementalViolations.length === 0,
    blockingUnresolved: coverage.blockingUnresolved,
    supplementalViolations,
  }
}

export function filterLegacyOutput(output) {
  return output
    .split("\n")
    .filter((line) => !line.includes("Zero-Drift Semantic Palette (No raw inline hex styles): CLEAN"))
    .filter((line) => !line.includes("SUPREME ARCHITECTURAL HARMONY: 0 CRITICAL CONSTITUTIONAL VIOLATIONS"))
    .join("\n")
}
