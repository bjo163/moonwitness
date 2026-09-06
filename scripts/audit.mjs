#!/usr/bin/env node

import fs from "node:fs"
import path from "node:path"
import { spawnSync } from "node:child_process"
import { fileURLToPath } from "node:url"
import {
  buildCollectorCoverage,
  evaluateCollectorIntegrity,
  filterLegacyOutput,
  runSupplementalCollectors,
} from "./audit-collector-contract.mjs"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, "..")
const legacyAuditor = path.join(__dirname, "audit-rules.mjs")
const jsonMode = process.argv.includes("--collector-json")

const legacySource = fs.readFileSync(legacyAuditor, "utf8")
const coverage = buildCollectorCoverage(legacySource)
const supplemental = runSupplementalCollectors(rootDir)
const integrity = evaluateCollectorIntegrity(coverage, supplemental)

const report = {
  schemaVersion: 1,
  generatedBy: "scripts/audit.mjs",
  collectors: coverage.collectors,
  supplemental,
  integrity,
}

if (jsonMode) {
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`)
  process.exit(integrity.ok ? 0 : 1)
}

console.log("◈ AUDIT COLLECTOR CONTRACT")
for (const collector of coverage.collectors) {
  const details = [collector.status]
  if (collector.replacement) details.push(`replacement=${collector.replacement}`)
  if (collector.issue) details.push(`issue=#${collector.issue}`)
  if (collector.reason) details.push(collector.reason)
  console.log(`  • ${collector.id}: ${details.join(" | ")}`)
}

for (const collector of supplemental) {
  const unsuppressed = collector.findings.filter((finding) => finding.status === "VIOLATION").length
  const suppressed = collector.findings.filter((finding) => finding.status === "SUPPRESSED_WITH_REASON").length
  console.log(
    `  • ${collector.id}: executed=true assessedFiles=${collector.assessedFiles} violations=${unsuppressed} suppressed=${suppressed}`
  )
}

if (!integrity.ok) {
  if (integrity.blockingUnresolved.length > 0) {
    console.error("\nBlocking unresolved collectors:")
    for (const collector of integrity.blockingUnresolved) console.error(`  - ${collector.id}`)
  }
  if (integrity.supplementalViolations.length > 0) {
    console.error("\nBlocking supplemental findings:")
    for (const finding of integrity.supplementalViolations) {
      console.error(`  - ${finding.file}:${finding.line} ${finding.reason}`)
    }
  }
  process.exit(1)
}

console.log("\nCollector integrity: PASS")
console.log("Running constitutional auditor...\n")

const legacy = spawnSync(process.execPath, [legacyAuditor], {
  cwd: rootDir,
  encoding: "utf8",
  env: process.env,
})

if (legacy.stdout) process.stdout.write(filterLegacyOutput(legacy.stdout))
if (legacy.stderr) process.stderr.write(legacy.stderr)

if (legacy.status !== 0) process.exit(legacy.status ?? 1)

const trackedDebt = coverage.collectors.filter((entry) => entry.status === "SUPPRESSED_WITH_REASON")
const supplementalSuppressed = supplemental.flatMap((entry) =>
  entry.findings.filter((finding) => finding.status === "SUPPRESSED_WITH_REASON")
)

if (trackedDebt.length > 0 || supplementalSuppressed.length > 0) {
  const issues = [...new Set([
    ...trackedDebt.map((entry) => entry.issue).filter(Boolean),
    ...supplementalSuppressed.map((entry) => entry.issue).filter(Boolean),
  ])].sort((a, b) => a - b)
  console.log(`\nCANONICAL AUDIT: PASS WITH TRACKED DEBT${issues.length ? ` (${issues.map((issue) => `#${issue}`).join(", ")})` : ""}`)
} else {
  console.log("\nCANONICAL AUDIT: PASS")
}
