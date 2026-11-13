import { test } from "vitest"
import assert from "node:assert/strict"
import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { collectQualityReproFuture } from "./umbrella-quality.mjs"
import qualityConfig from "../.audit/config/quality.v1.json" with { type: "json" }
import futureBaseline from "../.audit/config/future-baseline.v1.json" with { type: "json" }

const scoringConfig = {
  states: { known: "KNOWN_VALUE", unknown_required: "UNKNOWN_REQUIRED", not_applicable: "NOT_APPLICABLE" },
  unknown_policies: { strict_required_v1: { allow_numeric_when_unknown_required: false } },
  rounding: { decimals: 2 },
  score_bands: [{ label: "EXCELLENT", min: 95 }, { label: "GOOD", min: 85 }, { label: "CRITICAL", min: 0 }],
}

function fixture() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "umbrella-quality-"))
  for (const sub of [".audit/config", ".audit/schema", ".github/workflows", "scripts"]) fs.mkdirSync(path.join(dir, sub), { recursive: true })
  fs.writeFileSync(path.join(dir, "package.json"), JSON.stringify({ packageManager: "pnpm@10.33.4", engines: { node: ">=20" } }))
  fs.writeFileSync(path.join(dir, "pnpm-lock.yaml"), "lockfileVersion: '9.0'")
  fs.writeFileSync(path.join(dir, ".gitignore"), ".audit/umbrella-report.json\n")
  for (const file of qualityConfig.required_programmatic_files) {
    const full = path.join(dir, file); fs.mkdirSync(path.dirname(full), { recursive: true }); fs.writeFileSync(full, file.includes("umbrella-audit-core") ? "report_fingerprint" : "x")
  }
  fs.writeFileSync(path.join(dir, ".github/workflows/foundation-ci.yml"), `uses: actions/checkout@v4\nuses: actions/setup-node@v4\nuses: actions/github-script@v7\nnode-version: '22'\nrun: pnpm install --frozen-lockfile\nrun: pnpm audit:rules\nname: UMBRELLA v6 Evidence\nrun: pnpm test\nrun: pnpm typecheck\nrun: pnpm build\ngetBranch\nci-evidence.json`)
  fs.writeFileSync(path.join(dir, ".github/workflows/witness-postgres-certification.yml"), "db:install db:verify backup restore /health/ready")
  return dir
}

test("future readiness detects EOL engine floor, Node20-runtime actions, and missing update bot", () => {
  const dir = fixture()
  const result = collectQualityReproFuture(dir, scoringConfig, qualityConfig, futureBaseline)
  assert.ok(result.future_readiness.metric.value < 100)
  assert.ok(result.future_readiness.recommendations.some((item) => item.id === "node-engine-floor"))
  assert.ok(result.future_readiness.recommendations.some((item) => item.id === "dependency-update-automation"))
  assert.ok(result.future_readiness.recommendations.some((item) => item.id === "action:actions/checkout"))
})

test("reproducibility rewards lockfile/frozen installs but distinguishes non-SHA action pins", () => {
  const dir = fixture()
  const result = collectQualityReproFuture(dir, scoringConfig, qualityConfig, futureBaseline)
  assert.equal(result.reproducibility.details.install_commands, 1)
  assert.ok(result.reproducibility.metric.value > 50)
  assert.ok(result.reproducibility.metric.value < 100)
})
