import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { afterEach, describe, expect, it } from "vitest"
import evidenceConfig from "../.audit/config/evidence.v1.json" with { type: "json" }
import { collectUmbrellaEvidence } from "./umbrella-evidence.mjs"

const tempDirs = []
afterEach(() => {
  for (const dir of tempDirs.splice(0)) fs.rmSync(dir, { recursive: true, force: true })
})

function fixtureRoot() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "umbrella-evidence-"))
  tempDirs.push(root)
  fs.mkdirSync(path.join(root, ".github", "workflows"), { recursive: true })
  fs.mkdirSync(path.join(root, "apps", "api"), { recursive: true })
  fs.mkdirSync(path.join(root, "packages", "moon-server", "src"), { recursive: true })
  fs.mkdirSync(path.join(root, "packages", "moon-protocol", "src"), { recursive: true })
  fs.writeFileSync(path.join(root, "package.json"), JSON.stringify({ scripts: { build: "turbo build", test: "vitest run" } }))
  fs.writeFileSync(path.join(root, "turbo.json"), "{}")
  fs.writeFileSync(path.join(root, "Dockerfile"), "FROM node:22\n")
  fs.writeFileSync(path.join(root, "apps", "api", "Dockerfile"), "FROM node:22\n")
  fs.writeFileSync(path.join(root, ".github", "workflows", "foundation-ci.yml"), "name: Build\nrun: pnpm build\nname: Test\nrun: pnpm test\n")
  fs.writeFileSync(path.join(root, "docker-compose.yml"), [
    "DATABASE_URL: ${DATABASE_URL:?DATABASE_URL must be set}",
    "POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:?POSTGRES_PASSWORD must be set}",
    "JWT_SECRET: ${JWT_SECRET:?JWT_SECRET must be set}",
    "REDIS_PASSWORD: ${REDIS_PASSWORD:?REDIS_PASSWORD must be set}",
    "REDIS_URL: ${REDIS_URL:?REDIS_URL must be set}",
    "PUBLIC_API_URL:?PUBLIC_API_URL must be set",
    "/health/ready",
    "condition: service_healthy",
    "data:",
    "internal: true",
  ].join("\n"))
  fs.writeFileSync(path.join(root, "packages", "moon-server", "src", "telemetry.ts"), "NodeSDK @opentelemetry")
  fs.writeFileSync(path.join(root, "packages", "moon-protocol", "src", "registry.ts"), "/health/ready database connectivity")
  return root
}

function successCi({ protectedBranches = true, cert = "success" } = {}) {
  return {
    repository: "bjo163/moonwitness",
    source_revision: "abc123",
    foundation: { audit: "success", lint: "success", typecheck: "success", test: "success", build: "success" },
    certification: { status: cert === "pending" ? "in_progress" : "completed", conclusion: cert === "pending" ? null : cert },
    branches: { main: { protected: protectedBranches }, dev: { protected: protectedBranches } },
    issues: { "18": { state: "open" }, "26": { state: "open" } },
  }
}

describe("UMBRELLA evidence collectors", () => {
  it("keeps runtime/database/rollback unknown until exact-SHA certification completes", () => {
    const result = collectUmbrellaEvidence({ rootDir: fixtureRoot(), evidenceConfig, ciEvidence: successCi({ cert: "pending" }) })
    expect(result.observations.RawHealth.runtime.state).toBe("UNKNOWN_REQUIRED")
    expect(result.observations.DeploymentReadinessScore.database_migration.state).toBe("UNKNOWN_REQUIRED")
    expect(result.observations.DeploymentReadinessScore.rollback.state).toBe("UNKNOWN_REQUIRED")
  })

  it("promotes executed CI/certification evidence to E0 without manual scoring", () => {
    const result = collectUmbrellaEvidence({ rootDir: fixtureRoot(), evidenceConfig, ciEvidence: successCi() })
    expect(result.observations.RawHealth.build).toMatchObject({ state: "KNOWN_VALUE", value: 100, evidence_level: "E0" })
    expect(result.observations.RawHealth.runtime).toMatchObject({ state: "KNOWN_VALUE", value: 100, evidence_level: "E0" })
    expect(result.observations.DeploymentReadinessScore.ci_cd).toMatchObject({ value: 100, evidence_level: "E0" })
  })

  it("derives the P0 external blocker from observed branch enforcement, not issue-open state alone", () => {
    const blocked = collectUmbrellaEvidence({ rootDir: fixtureRoot(), evidenceConfig, ciEvidence: successCi({ protectedBranches: false }) })
    expect(blocked.p0Remaining).toBe(1)
    expect(blocked.externalBlockers).toHaveLength(1)
    expect(blocked.issues.find((issue) => issue.number === 18)?.verified_state).toBe("BLOCKED_EXTERNAL")

    const protectedState = collectUmbrellaEvidence({ rootDir: fixtureRoot(), evidenceConfig, ciEvidence: successCi({ protectedBranches: true }) })
    expect(protectedState.p0Remaining).toBe(0)
    expect(protectedState.externalBlockers).toHaveLength(0)
    expect(protectedState.issues.find((issue) => issue.number === 18)?.verified_state).toBe("VALIDATED")
  })

  it("computes source-contract values from check ratios", () => {
    const root = fixtureRoot()
    fs.rmSync(path.join(root, "apps", "api", "Dockerfile"))
    const result = collectUmbrellaEvidence({ rootDir: root, evidenceConfig })
    expect(result.observations.RawHealth.deployment.value).toBe(75)
    expect(result.observations.RawHealth.deployment.condition).toBe("FAIL")
    expect(result.observations.RawHealth.deployment.evidence_level).toBe("E1")
  })
})
