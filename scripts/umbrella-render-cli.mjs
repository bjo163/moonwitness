#!/usr/bin/env node

import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { validateConfig, validateReport } from "./umbrella-audit-core.mjs"
import { loadUmbrellaConfig } from "./umbrella-config.mjs"
import { assertRenderedParity, renderUmbrellaStatus } from "./umbrella-render.mjs"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, "..")

function getArg(prefix) {
  const match = process.argv.find((arg) => arg.startsWith(`${prefix}=`))
  return match ? match.slice(prefix.length + 1) : null
}

const reportPath = path.resolve(rootDir, getArg("--report") || ".audit/umbrella-report.json")
const outputPath = path.resolve(rootDir, getArg("--output") || ".audit/runtime/UMBRELLA_STATUS.md")
const checkMode = process.argv.includes("--check")
const dryRunMode = process.argv.includes("--dry-run")

if (!fs.existsSync(reportPath)) {
  console.error(`Canonical report not found: ${path.relative(rootDir, reportPath)}`)
  process.exit(2)
}

const report = JSON.parse(fs.readFileSync(reportPath, "utf8"))
const { config } = loadUmbrellaConfig(rootDir)
validateConfig(config)
validateReport(report, config)
const markdown = renderUmbrellaStatus(report)

if (checkMode) {
  if (!fs.existsSync(outputPath)) {
    console.error(`Rendered status not found: ${path.relative(rootDir, outputPath)}`)
    process.exit(3)
  }
  const existing = fs.readFileSync(outputPath, "utf8")
  try {
    assertRenderedParity(existing, report)
  } catch (error) {
    console.error(`UMBRELLA rendered status parity: FAIL — ${error.message}`)
    process.exit(4)
  }
  console.log(`UMBRELLA rendered status parity: PASS (${report.report_fingerprint})`)
} else if (dryRunMode) {
  console.log(`DRY_RUN render ${path.relative(rootDir, reportPath)} -> ${path.relative(rootDir, outputPath)} (${Buffer.byteLength(markdown)} bytes)`)
} else {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, markdown)
  console.log(`UMBRELLA human status rendered: ${path.relative(rootDir, outputPath)}`)
  console.log(`report_fingerprint=${report.report_fingerprint}`)
}
