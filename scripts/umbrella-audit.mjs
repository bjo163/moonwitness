#!/usr/bin/env node

import fs from "node:fs"
import path from "node:path"
import { spawnSync } from "node:child_process"
import { fileURLToPath } from "node:url"
import { buildReport, sha256, validateConfig, validateReport } from "./umbrella-audit-core.mjs"
import { collectUmbrellaEvidence } from "./umbrella-evidence.mjs"
import { runSupplementalCollectors } from "./audit-collector-contract.mjs"
import { applyPhaseCMetrics, collectPhaseCMetrics } from "./umbrella-phase-c.mjs"
import { loadUmbrellaConfig } from "./umbrella-config.mjs"
import { writeGeneratedOutputs } from "./umbrella-output.mjs"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, "..")
const defaultOutputPath = path.join(rootDir, ".audit", "umbrella-report.json")
const defaultStatusPath = path.join(rootDir, ".audit", "runtime", "UMBRELLA_STATUS.md")

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"))
}

function getArg(prefix) {
  const match = process.argv.find((arg) => arg.startsWith(`${prefix}=`))
  return match ? match.slice(prefix.length + 1) : null
}

function resolveSourceRevision() {
  const explicit = getArg("--source-revision")
  if (explicit) return explicit
  const git = spawnSync("git", ["rev-parse", "HEAD"], { cwd: rootDir, encoding: "utf8" })
  if (git.status === 0 && git.stdout.trim()) return git.stdout.trim()
  if (process.env.GITHUB_SHA) return process.env.GITHUB_SHA
  return "UNKNOWN"
}

function rehashReport(report) {
  const fingerprintInput = structuredClone(report)
  delete fingerprintInput.generated_at
  delete fingerprintInput.report_fingerprint
  report.report_fingerprint = sha256(fingerprintInput)
}

const jsonMode = process.argv.includes("--json")
const writeMode = process.argv.includes("--write")
const validateMode = process.argv.includes("--validate")
const checkMode = process.argv.includes("--check")
const dryRunMode = process.argv.includes("--dry-run")
const fixSafeMode = process.argv.includes("--fix-safe")
const renderMode = process.argv.includes("--render") || fixSafeMode
const requestedWriteMode = writeMode || fixSafeMode
const outputPath = path.resolve(rootDir, getArg("--output") || path.relative(rootDir, defaultOutputPath))
const statusOutputPath = path.resolve(rootDir, getArg("--status-output") || path.relative(rootDir, defaultStatusPath))
const ciEvidenceArg = getArg("--ci-evidence")
const ciEvidencePath = ciEvidenceArg ? path.resolve(rootDir, ciEvidenceArg) : null

const {
  config,
  evidenceConfig,
  hygieneConfig,
  complexityConfig,
  qualityConfig,
  futureBaseline,
} = loadUmbrellaConfig(rootDir)
validateConfig(config)

const ciEvidence = ciEvidencePath && fs.existsSync(ciEvidencePath) ? readJson(ciEvidencePath) : null
const collected = collectUmbrellaEvidence({ rootDir, evidenceConfig, ciEvidence })
const report = buildReport({
  config,
  sourceRevision: resolveSourceRevision(),
  generatedAt: getArg("--generated-at") || new Date().toISOString(),
  observations: collected.observations,
  externalBlockers: collected.externalBlockers,
  p0Remaining: collected.p0Remaining,
})

report.evidence = collected.evidence
report.issues = collected.issues
report.repositories = collected.repositories
report.hardcodes = runSupplementalCollectors(rootDir)
  .flatMap((collector) => collector.findings.map((finding) => ({ collector: collector.id, ...finding })))
  .sort((a, b) => `${a.collector}:${a.file}:${a.line}`.localeCompare(`${b.collector}:${b.file}:${b.line}`))

const phaseC = collectPhaseCMetrics({
  rootDir,
  scoringConfig: config,
  hygieneConfig,
  complexityConfig,
  qualityConfig,
  futureBaseline,
})
applyPhaseCMetrics(report, phaseC)
rehashReport(report)
validateReport(report, config)

const outputResult = writeGeneratedOutputs({
  rootDir,
  report,
  reportPath: outputPath,
  statusPath: statusOutputPath,
  writeReport: requestedWriteMode,
  writeStatus: renderMode,
  dryRun: dryRunMode,
  safeFix: fixSafeMode,
})

const phaseCSummary = () => {
  for (const name of ["RepositoryHygieneScore", "ComplexityScore", "ProgrammaticQualityScore", "ReproducibilityScore", "FutureReadinessScore"]) {
    const metric = report.scores[name]
    console.log(`${name}=${metric.value ?? metric.status}`)
  }
}

if (jsonMode) {
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`)
} else if (validateMode) {
  console.log(`UMBRELLA v6 report validation: PASS (${report.source_revision})`)
  console.log(`RawHealth=${report.scores.RawHealth.value ?? report.scores.RawHealth.status}`)
  console.log(`DeploymentReadinessScore=${report.scores.DeploymentReadinessScore.value ?? report.scores.DeploymentReadinessScore.status}`)
  console.log(`DeploymentGate=${report.scores.DeploymentGate.status}`)
  phaseCSummary()
  console.log(`report_fingerprint=${report.report_fingerprint}`)
} else {
  const state = dryRunMode ? "dry-run" : requestedWriteMode ? path.relative(rootDir, outputPath) : "generated in-memory"
  console.log(`UMBRELLA v6 engineering report: ${state}`)
  console.log(`source_revision=${report.source_revision}`)
  console.log(`RawHealth=${report.scores.RawHealth.value ?? report.scores.RawHealth.status}`)
  console.log(`DeploymentReadinessScore=${report.scores.DeploymentReadinessScore.value ?? report.scores.DeploymentReadinessScore.status}`)
  console.log(`DeploymentGate=${report.scores.DeploymentGate.status}`)
  console.log(`AuditCoverage=${report.scores.AuditCoverage.value}`)
  console.log(`VerifiedCoverage=${report.scores.VerifiedCoverage.value}`)
  console.log(`EvidenceConfidence=${report.scores.EvidenceConfidence.value}`)
  phaseCSummary()
  console.log(`report_fingerprint=${report.report_fingerprint}`)
}

if (dryRunMode && !jsonMode) {
  console.log(`DRY_RUN mutations=0 planned_outputs=${outputResult.plan.length}`)
  for (const item of outputResult.plan) console.log(`DRY_RUN ${item.kind}=${item.path} bytes=${item.bytes}`)
} else if (fixSafeMode && !jsonMode) {
  console.log(`FIX_SAFE written=${outputResult.written.join(",") || "none"}`)
  console.log("FIX_SAFE scope=generated_outputs_only")
} else if (renderMode && !jsonMode && !validateMode) {
  console.log(`human_status=${path.relative(rootDir, statusOutputPath)}`)
}

if (checkMode && report.scores.DeploymentGate.status !== config.gate_policies.DeploymentGate.ready_status) {
  console.error(`Deployment gate is ${report.scores.DeploymentGate.status}; check failed by policy.`)
  process.exit(2)
}
