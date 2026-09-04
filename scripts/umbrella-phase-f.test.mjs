import test from "node:test"
import assert from "node:assert/strict"
import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { collectServiceInventory } from "./umbrella-inventory.mjs"
import { applyVerifiedProgress, collectVerifiedProgress } from "./umbrella-progress.mjs"

function tempRoot() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "umbrella-phase-f-"))
}

function write(root, relativePath, content) {
  const filePath = path.join(root, relativePath)
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, content)
}

const scoringConfig = {
  rounding: { decimals: 2 },
  score_bands: [
    { label: "EXCELLENT", min: 95 },
    { label: "GOOD", min: 85 },
    { label: "CRITICAL", min: 0 },
  ],
  progress_policy: { formula_id: "verified_dod_weighted_completion_v1" },
}

const progressConfig = {
  schema_version: 1,
  version: "1.0.0",
  resolution_states: { validated: "VALIDATED", partial: "CONFIRMED", empty: "TRACKED" },
  lifecycle_states: ["NEW", "CONFIRMED", "TRACKED", "FIXED", "VALIDATED", "SUPPRESSED_WITH_REASON", "REGRESSED", "BLOCKED_EXTERNAL"],
  completion_by_state: { NEW: 0, CONFIRMED: 0, TRACKED: 0, FIXED: 0.5, VALIDATED: 1, SUPPRESSED_WITH_REASON: 1, REGRESSED: 0, BLOCKED_EXTERNAL: 0 },
  work_items: [
    {
      id: "verified_work",
      weight: 1,
      linked_issue: 157,
      checks: [
        { id: "source_exists", type: "file_exists", path: "verified.txt" },
        { id: "runtime_context", type: "context_equals", context_path: "inventory.drift.status", value: "PASS" },
      ],
    },
  ],
}

test("closed administrative issue does not become completed without verified DoD", () => {
  const root = tempRoot()
  try {
    const issues = [{ number: 157, administrative_state: "closed", verified_state: "TRACKED", evidence_level: "E3" }]
    const progress = collectVerifiedProgress({
      rootDir: root,
      progressConfig,
      scoringConfig,
      issues,
      sourceContext: { inventory: { drift: { status: "FAIL" } } },
    })
    const report = { scores: { Progress: null }, issues: structuredClone(issues) }
    applyVerifiedProgress(report, progress, progressConfig)
    assert.equal(report.scores.Progress.value, 0)
    assert.equal(report.issues[0].administrative_state, "closed")
    assert.notEqual(report.issues[0].verified_state, "VALIDATED")
  } finally {
    fs.rmSync(root, { recursive: true, force: true })
  }
})

test("verified DoD drives progress to 100 independently of administrative state", () => {
  const root = tempRoot()
  try {
    write(root, "verified.txt", "ok\n")
    const issues = [{ number: 157, administrative_state: "open", verified_state: "TRACKED", evidence_level: "E3" }]
    const progress = collectVerifiedProgress({
      rootDir: root,
      progressConfig,
      scoringConfig,
      issues,
      sourceContext: { inventory: { drift: { status: "PASS" } } },
    })
    const report = { scores: { Progress: null }, issues: structuredClone(issues) }
    applyVerifiedProgress(report, progress, progressConfig)
    assert.equal(report.scores.Progress.value, 100)
    assert.equal(report.issues[0].administrative_state, "open")
    assert.equal(report.issues[0].verified_state, "VALIDATED")
  } finally {
    fs.rmSync(root, { recursive: true, force: true })
  }
})

function inventoryFixture(root, constantPort = 4000) {
  write(root, "docker-compose.yml", `services:\n  api:\n    build:\n      context: .\n      dockerfile: apps/api/Dockerfile\n    environment:\n      DATABASE_URL: \${DATABASE_URL:?required}\n    ports:\n      - "127.0.0.1:\${PORT_API:-4000}:4000"\n    depends_on:\n      postgres:\n        condition: service_healthy\n    healthcheck:\n      test: ["CMD-SHELL", "wget -qO- http://127.0.0.1:4000/health/ready"]\n  postgres:\n    image: postgres:18-alpine\n`)
  write(root, ".env.production.example", "PORT_API=4000\nDATABASE_URL=postgres://placeholder\n")
  write(root, "packages/types/src/constants.ts", `export const APP_PORTS = {\n  API_BACKEND: ${constantPort},\n} as const\n`)
  write(root, "apps/api/Dockerfile", "FROM node:22-alpine\n")
  write(root, "apps/api/package.json", JSON.stringify({ name: "api", dependencies: { fastify: "1.0.0" } }))
}

const inventoryConfig = {
  schema_version: 1,
  version: "1.0.0",
  sources: {
    compose: "docker-compose.yml",
    env_example: ".env.production.example",
    port_constants: "packages/types/src/constants.ts",
    workspace_roots: ["apps", "packages"],
  },
  application_port_map: { api: "API_BACKEND" },
}

test("generated inventory detects port drift and never copies env values", () => {
  const root = tempRoot()
  try {
    inventoryFixture(root, 4999)
    const drifted = collectServiceInventory(root, inventoryConfig)
    assert.equal(drifted.inventory.drift.status, "FAIL")
    assert.equal(drifted.inventory.drift.findings.some((finding) => finding.category === "port_mismatch"), true)
    assert.equal(JSON.stringify(drifted.inventory).includes("postgres://placeholder"), false)

    inventoryFixture(root, 4000)
    const clean = collectServiceInventory(root, inventoryConfig)
    assert.equal(clean.inventory.drift.status, "PASS")
    assert.equal(clean.inventory.drift.findings.length, 0)
    assert.deepEqual(clean.inventory.port_constants, { API_BACKEND: 4000 })
    assert.equal(clean.inventory.workspaces.some((workspace) => workspace.name === "api" && workspace.dependencies.includes("fastify")), true)
  } finally {
    fs.rmSync(root, { recursive: true, force: true })
  }
})
