#!/usr/bin/env node

import fs from "node:fs"
import path from "node:path"
import { spawnSync } from "node:child_process"
import { fileURLToPath } from "node:url"
import { buildReport, validateConfig, validateReport } from "./umbrella-audit-core.mjs"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, "..")
const configPath = path.join(rootDir, ".audit", "config", "scoring.v1.json")
const defaultOutputPath = path.join(rootDir, ".audit", "umbrella-report.json")

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

const jsonMode = process.argv.includes("--json")
const writeMode = process.argv.includes("--write")
const validateMode = process.argv.includes("--validate")
const checkMode = process.argv.includes("--check")
const outputPath = path.resolve(rootDir, getArg("--output") || path.relative(rootDir, defaultOutputPath))

const config = readJson(configPath)
validateConfig(config)
const report = buildReport({
  config,
  sourceRevision: resolveSourceRevision(),
  generatedAt: getArg("--generated-at") || new Date().toISOString(),
})
validateReport(report, config)

if (writeMode) {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`)
}

if (jsonMode) {
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`)
} else if (validateMode) {
  console.log(`UMBRELLA v6 contract validation: PASS (${report.source_revision})`)
  console.log(`report_fingerprint=${report.report_fingerprint}`)
} else {
  console.log(`UMBRELLA v6 engineering report: ${writeMode ? path.relative(rootDir, outputPath) : "generated in-memory"}`)
  console.log(`source_revision=${report.source_revision}`)
  console.log(`RawHealth=${report.scores.RawHealth.status}`)
  console.log(`DeploymentReadinessScore=${report.scores.DeploymentReadinessScore.status}`)
  console.log(`DeploymentGate=${report.scores.DeploymentGate.status}`)
  console.log(`AuditCoverage=${report.scores.AuditCoverage.value}`)
  console.log(`VerifiedCoverage=${report.scores.VerifiedCoverage.value}`)
  console.log(`EvidenceConfidence=${report.scores.EvidenceConfidence.value}`)
  console.log(`report_fingerprint=${report.report_fingerprint}`)
}

if (checkMode && report.scores.DeploymentGate.status !== config.gate_policies.DeploymentGate.ready_status) {
  console.error(`Deployment gate is ${report.scores.DeploymentGate.status}; check failed by policy.`)
  process.exit(2)
}
