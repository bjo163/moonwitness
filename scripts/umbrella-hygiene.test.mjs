import { test } from "vitest"
import assert from "node:assert/strict"
import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { collectRepositoryHygiene } from "./umbrella-hygiene.mjs"

const scoringConfig = {
  states: { known: "KNOWN_VALUE", unknown_required: "UNKNOWN_REQUIRED", not_applicable: "NOT_APPLICABLE" },
  unknown_policies: { strict_required_v1: { allow_numeric_when_unknown_required: false } },
  rounding: { decimals: 2 },
  score_bands: [{ label: "EXCELLENT", min: 95 }, { label: "CRITICAL", min: 0 }],
}

const hygieneConfig = {
  profile: {
    version: "1.0.0", formula_id: "weighted_mean_v1", unknown_policy: "strict_required_v1",
    dimensions: [
      { id: "generated_artifacts", weight: .18, required: true }, { id: "gitignore_integrity", weight: .14, required: true },
      { id: "secret_hygiene", weight: .20, required: true }, { id: "stale_config", weight: .12, required: true },
      { id: "duplicate_config", weight: .12, required: true }, { id: "repo_root_clutter", weight: .10, required: true },
      { id: "dead_code_ratio", weight: .07, required: false }, { id: "unused_dependency_ratio", weight: .07, required: false }
    ]
  },
  penalties: { per_generated_artifact: 20, per_stale_config: 25, per_duplicate_config: 25, per_root_clutter_item: 5, secret_finding_score: 0 },
  generated_path_patterns: ["(^|/)dist(/|$)"],
  required_gitignore_entries: ["dist"],
  secret_patterns: [{ id: "pem_private_key", pattern: "-----BEGIN PRIVATE KEY-----" }],
  secret_scan: { max_file_bytes: 100000, exclude_patterns: [] },
  root_allow_patterns: ["^package\\.json$", "^\\.gitignore$"],
  duplicate_config_groups: [{ id: "locks", allowed_max: 1, paths: ["pnpm-lock.yaml", "yarn.lock"] }],
}

function fixture() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "umbrella-hygiene-"))
  fs.writeFileSync(path.join(dir, ".gitignore"), "dist\n")
  fs.writeFileSync(path.join(dir, "package.json"), JSON.stringify({ scripts: {} }))
  return dir
}

test("clean fixture yields measured score while unsupported dimensions remain explicit unknown", () => {
  const dir = fixture()
  const result = collectRepositoryHygiene(dir, scoringConfig, hygieneConfig)
  assert.equal(result.metric.status, "KNOWN_VALUE")
  assert.equal(result.metric.value, 100)
  assert.deepEqual(result.coverage.unknown_dimensions, ["dead_code_ratio", "unused_dependency_ratio"])
  assert.equal(result.coverage.measurement_coverage, 75)
})

test("tracked generated artifacts and private key patterns reduce score deterministically", () => {
  const dir = fixture()
  fs.mkdirSync(path.join(dir, "dist"))
  fs.writeFileSync(path.join(dir, "dist", "bundle.js"), "compiled")
  fs.writeFileSync(path.join(dir, "secret.txt"), "-----BEGIN PRIVATE KEY-----")
  const result = collectRepositoryHygiene(dir, scoringConfig, hygieneConfig)
  assert.ok(result.metric.value < 100)
  assert.equal(result.details.generated_artifact_violations, 1)
  assert.equal(result.details.secret_hygiene_findings, 1)
})

test("missing script target and duplicate lockfiles are classified", () => {
  const dir = fixture()
  fs.writeFileSync(path.join(dir, "package.json"), JSON.stringify({ scripts: { broken: "node scripts/missing.mjs" } }))
  fs.writeFileSync(path.join(dir, "pnpm-lock.yaml"), "lockfileVersion: '9.0'")
  fs.writeFileSync(path.join(dir, "yarn.lock"), "")
  const result = collectRepositoryHygiene(dir, scoringConfig, hygieneConfig)
  assert.equal(result.details.stale_config_count, 1)
  assert.equal(result.details.duplicate_config_count, 1)
})
