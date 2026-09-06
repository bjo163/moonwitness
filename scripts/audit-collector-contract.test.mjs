import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { afterEach, describe, expect, it } from "vitest"
import {
  buildCollectorCoverage,
  evaluateCollectorIntegrity,
  filterLegacyOutput,
  scanHardcodedLocalhost,
  scanRawSqlConcatenation,
} from "./audit-collector-contract.mjs"

const tempDirs = []
afterEach(() => {
  for (const dir of tempDirs.splice(0)) fs.rmSync(dir, { recursive: true, force: true })
})

function makeLegacy({ body = "", critical = "" } = {}) {
  return `
const VIOLATIONS = {
  hardcodedLocalhost: [],
  rawUiColors: [],
  rawSqlConcatenation: [],
  unknownBlocking: [],
}
${body}
const criticalViolations =
  VIOLATIONS.hardcodedLocalhost.length +
  VIOLATIONS.rawSqlConcatenation.length${critical ? ` +\n  ${critical}` : ""}

if (criticalViolations === 0) process.exit(0)
`
}

describe("audit collector contract", () => {
  it("never treats a required declared collector with no implementation as clean", () => {
    const coverage = buildCollectorCoverage(makeLegacy({ critical: "VIOLATIONS.unknownBlocking.length" }))
    expect(coverage.blockingUnresolved.map((entry) => entry.id)).toContain("unknownBlocking")
    expect(coverage.collectors.find((entry) => entry.id === "unknownBlocking")?.status).toBe("UNRESOLVED")
  })

  it("recognizes legacy and supplemental collector ownership", () => {
    const coverage = buildCollectorCoverage(makeLegacy({ body: "VIOLATIONS.rawUiColors.push({ file: 'x' })" }))
    expect(coverage.collectors.find((entry) => entry.id === "rawUiColors")?.status).toBe("IMPLEMENTED_LEGACY")
    expect(coverage.collectors.find((entry) => entry.id === "hardcodedLocalhost")?.status).toBe("IMPLEMENTED_SUPPLEMENTAL")
    expect(coverage.collectors.find((entry) => entry.id === "rawSqlConcatenation")?.status).toBe("IMPLEMENTED_SUPPLEMENTAL")
  })

  it("detects production-capable localhost fallback while excluding test paths", () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "mw-audit-"))
    tempDirs.push(root)
    fs.mkdirSync(path.join(root, "apps", "web"), { recursive: true })
    fs.writeFileSync(
      path.join(root, "apps", "web", "runtime.ts"),
      "const base = process.env.MOON_API_URL || `http://127.0.0.1:4000`\n"
    )
    fs.writeFileSync(
      path.join(root, "apps", "web", "runtime.test.ts"),
      "const base = process.env.MOON_API_URL || `http://127.0.0.1:4000`\n"
    )

    const result = scanHardcodedLocalhost(root)
    expect(result.findings).toHaveLength(1)
    expect(result.findings[0]).toMatchObject({
      file: "apps/web/runtime.ts",
      status: "SUPPRESSED_WITH_REASON",
      issue: 158,
    })
  })

  it("only classifies SQL-shaped interpolation, not ordinary selected/template UI code", () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "mw-audit-sql-"))
    tempDirs.push(root)
    fs.mkdirSync(path.join(root, "apps", "web"), { recursive: true })
    const file = path.join(root, "apps", "web", "runtime.ts")

    fs.writeFileSync(file, "const selected = true\nconst cls = `selected ${value}`\n")
    expect(scanRawSqlConcatenation(root).findings).toHaveLength(0)

    fs.writeFileSync(file, "const query = `SELECT * FROM users WHERE id = ${userId}`\n")
    expect(scanRawSqlConcatenation(root).findings).toHaveLength(1)
  })

  it("fails integrity for unsuppressed supplemental violations", () => {
    const coverage = { blockingUnresolved: [] }
    const result = evaluateCollectorIntegrity(coverage, [
      {
        id: "rawSqlConcatenation",
        findings: [{ file: "apps/api/x.ts", line: 1, status: "VIOLATION" }],
      },
    ])
    expect(result.ok).toBe(false)
  })

  it("filters legacy clean claims for zombie/superseded categories", () => {
    const output = [
      "✓ [LAW 01] Zero-Drift Semantic Palette (No raw inline hex styles): CLEAN",
      "🎉 SUPREME ARCHITECTURAL HARMONY: 0 CRITICAL CONSTITUTIONAL VIOLATIONS!",
      "✓ RAW UI COLORS: CLEAN",
    ].join("\n")
    const filtered = filterLegacyOutput(output)
    expect(filtered).not.toContain("No raw inline hex styles")
    expect(filtered).not.toContain("SUPREME ARCHITECTURAL HARMONY")
    expect(filtered).toContain("RAW UI COLORS: CLEAN")
  })
})
