import { test } from "vitest"
import assert from "node:assert/strict"
import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { assertRenderedParity, buildParityManifest, renderUmbrellaStatus } from "./umbrella-render.mjs"
import { writeGeneratedOutputs } from "./umbrella-output.mjs"

function metric(value, status = "KNOWN_VALUE", band = "GOOD") {
  return { status, value, band, formula_id: "fixture", profile_version: "1" }
}

function fixtureReport() {
  return {
    schema_version: 1,
    generated_at: "2026-09-04T00:00:00.000Z",
    source_revision: "abc123",
    model_id: "moonwitness-umbrella-engineering-health",
    scoring_model_version: "1.1.0",
    scoring_config_version: "1.1.0",
    config_hash: "a".repeat(64),
    report_fingerprint: "b".repeat(64),
    overall: { status: "BLOCKED", can_deploy: false, reason_codes: ["EXTERNAL_BLOCKER"] },
    scores: {
      RawHealth: metric(100, "KNOWN_VALUE", "EXCELLENT"),
      Progress: metric(null, "INSUFFICIENT", null),
      DeploymentReadinessScore: metric(100, "KNOWN_VALUE", "EXCELLENT"),
      DeploymentGate: { status: "BLOCKED_EXTERNAL", can_deploy: false, failed_dimensions: [], unknown_dimensions: [], external_blockers: [18], reason_codes: ["EXTERNAL_BLOCKER"] },
      AuditCoverage: metric(100, "KNOWN_VALUE", "EXCELLENT"),
      VerifiedCoverage: metric(100, "KNOWN_VALUE", "EXCELLENT"),
      EvidenceConfidence: metric(100, "KNOWN_VALUE", "EXCELLENT"),
      RepositoryHygieneScore: metric(94.19, "KNOWN_VALUE", "GOOD"),
      ComplexityScore: metric(90.12, "KNOWN_VALUE", "GOOD"),
      ProgrammaticQualityScore: metric(93.63, "KNOWN_VALUE", "GOOD"),
      ReproducibilityScore: metric(83.67, "KNOWN_VALUE", "ACCEPTABLE"),
      FutureReadinessScore: metric(39.13, "KNOWN_VALUE", "POOR"),
    },
    external_blockers: [{ id: 18, status: "BLOCKED_EXTERNAL", reason: "branch enforcement" }],
    components: [],
    evidence: [],
    hardcodes: [],
    hygiene: [],
    complexity: [],
    future_tech: [],
  }
}

test("human renderer is deterministic and exactly parity-bound to the machine report", () => {
  const report = fixtureReport()
  const first = renderUmbrellaStatus(report)
  const second = renderUmbrellaStatus(structuredClone(report))
  assert.equal(first, second)
  assert.equal(assertRenderedParity(first, report), true)
  assert.equal(buildParityManifest(report).scores.FutureReadinessScore.value, 39.13)
  assert.match(first, /DeploymentGate \| BLOCKED_EXTERNAL/)
  assert.throws(() => assertRenderedParity(first.replace("94.19", "99.99"), report), /diverges/)
})

test("dry-run plans generated outputs and mutates zero files", () => {
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), "umbrella-phase-d-"))
  const reportPath = path.join(rootDir, ".audit", "umbrella-report.json")
  const statusPath = path.join(rootDir, ".audit", "runtime", "UMBRELLA_STATUS.md")
  const result = writeGeneratedOutputs({
    rootDir,
    report: fixtureReport(),
    reportPath,
    statusPath,
    writeReport: true,
    writeStatus: true,
    dryRun: true,
    safeFix: true,
  })
  assert.equal(result.plan.length, 2)
  assert.deepEqual(result.written, [])
  assert.equal(fs.existsSync(reportPath), false)
  assert.equal(fs.existsSync(statusPath), false)
})

test("fix-safe only writes reversible generated outputs under canonical audit paths", () => {
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), "umbrella-phase-d-safe-"))
  const reportPath = path.join(rootDir, ".audit", "umbrella-report.json")
  const statusPath = path.join(rootDir, ".audit", "runtime", "UMBRELLA_STATUS.md")
  const report = fixtureReport()

  const result = writeGeneratedOutputs({ rootDir, report, reportPath, statusPath, writeReport: true, writeStatus: true, safeFix: true })
  assert.deepEqual(result.written.sort(), [".audit/runtime/UMBRELLA_STATUS.md", ".audit/umbrella-report.json"].sort())
  assert.equal(JSON.parse(fs.readFileSync(reportPath, "utf8")).report_fingerprint, report.report_fingerprint)
  assert.equal(assertRenderedParity(fs.readFileSync(statusPath, "utf8"), report), true)

  assert.throws(() => writeGeneratedOutputs({
    rootDir,
    report,
    reportPath: path.join(rootDir, "package.json"),
    statusPath,
    writeReport: true,
    safeFix: true,
  }), /fix-safe report target/)

  assert.throws(() => writeGeneratedOutputs({
    rootDir,
    report,
    reportPath,
    statusPath: path.join(rootDir, "docs", "UMBRELLA_STATUS.md"),
    writeStatus: true,
    safeFix: true,
  }), /fix-safe status target/)
})
