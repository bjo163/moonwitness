#!/usr/bin/env node

import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { spawnSync } from "node:child_process"
import { fileURLToPath } from "node:url"
import { assertCertificationPass, certifyUmbrellaOutputs, sha256Text } from "./umbrella-certification.mjs"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, "..")
const configPath = path.join(rootDir, ".audit", "config", "certification.v1.json")
const defaultOutputPath = path.join(rootDir, ".audit", "runtime", "umbrella-certification.json")

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"))
}

function getArg(prefix) {
  const match = process.argv.find((arg) => arg.startsWith(`${prefix}=`))
  return match ? match.slice(prefix.length + 1) : null
}

function resolveHeadSha() {
  const git = spawnSync("git", ["rev-parse", "HEAD"], { cwd: rootDir, encoding: "utf8" })
  if (git.status !== 0 || !git.stdout.trim()) throw new Error("Unable to resolve repository HEAD")
  return git.stdout.trim()
}

function runAudit({ label, tempDir, fixedGeneratedAt, ciEvidencePath }) {
  const reportPath = path.join(tempDir, `umbrella-report-${label}.json`)
  const statusPath = path.join(tempDir, `UMBRELLA_STATUS-${label}.md`)
  const args = [
    path.join(rootDir, "scripts", "umbrella-audit.mjs"),
    "--write",
    "--render",
    `--generated-at=${fixedGeneratedAt}`,
    `--output=${reportPath}`,
    `--status-output=${statusPath}`,
  ]
  if (ciEvidencePath) args.push(`--ci-evidence=${ciEvidencePath}`)

  const result = spawnSync(process.execPath, args, { cwd: rootDir, encoding: "utf8" })
  if (result.status !== 0) {
    throw new Error(`Audit replay ${label} failed\n${result.stdout || ""}\n${result.stderr || ""}`)
  }
  return {
    reportBytes: fs.readFileSync(reportPath, "utf8"),
    markdownBytes: fs.readFileSync(statusPath, "utf8"),
  }
}

const certificationConfigBytes = fs.readFileSync(configPath, "utf8")
const certificationConfig = JSON.parse(certificationConfigBytes)
const expectedSha = getArg("--expected-sha") || process.env.GITHUB_SHA || resolveHeadSha()
const actualHead = resolveHeadSha()
if (actualHead !== expectedSha) {
  throw new Error(`Exact-SHA checkout mismatch before certification: expected ${expectedSha}, got ${actualHead}`)
}

const ciEvidenceArg = getArg("--ci-evidence")
const ciEvidencePath = ciEvidenceArg ? path.resolve(rootDir, ciEvidenceArg) : null
if (ciEvidencePath && !fs.existsSync(ciEvidencePath)) throw new Error(`CI evidence not found: ${ciEvidencePath}`)

const outputPath = path.resolve(rootDir, getArg("--output") || path.relative(rootDir, defaultOutputPath))
const noWrite = process.argv.includes("--no-write")
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "moonwitness-umbrella-cert-"))

try {
  const first = runAudit({
    label: "a",
    tempDir,
    fixedGeneratedAt: certificationConfig.fixed_generated_at,
    ciEvidencePath,
  })
  const second = runAudit({
    label: "b",
    tempDir,
    fixedGeneratedAt: certificationConfig.fixed_generated_at,
    ciEvidencePath,
  })

  const result = certifyUmbrellaOutputs({
    reportBytesA: first.reportBytes,
    reportBytesB: second.reportBytes,
    markdownBytesA: first.markdownBytes,
    markdownBytesB: second.markdownBytes,
    expectedSha,
    certificationConfig,
    certificationConfigHash: sha256Text(certificationConfigBytes),
  })

  assertCertificationPass(result)
  if (!noWrite) {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true })
    fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`)
  }

  console.log(`UMBRELLA v6 certification: ${result.status} (${result.source_revision})`)
  console.log(`report_fingerprint=${result.report_fingerprint}`)
  console.log(`report_sha256=${result.artifacts.report_sha256}`)
  console.log(`markdown_sha256=${result.artifacts.markdown_sha256}`)
  console.log(`certification_config_hash=${result.certification_config_hash}`)
  for (const item of result.checks) console.log(`${item.id}=${item.status}`)
} finally {
  fs.rmSync(tempDir, { recursive: true, force: true })
}
