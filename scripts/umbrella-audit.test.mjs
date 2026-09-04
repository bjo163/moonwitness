import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"
import {
  buildReport,
  computeWeightedProfile,
  deriveDeploymentGate,
  sha256,
  validateConfig,
  validateReport,
} from "./umbrella-audit-core.mjs"

const root = path.resolve(fileURLToPath(new URL(".", import.meta.url)), "..")
const config = JSON.parse(fs.readFileSync(path.join(root, ".audit", "config", "scoring.v1.json"), "utf8"))
const schema = JSON.parse(fs.readFileSync(path.join(root, ".audit", "schema", "umbrella-report.schema.json"), "utf8"))

describe("UMBRELLA v6 Phase A contract", () => {
  it("validates versioned config and exact configured profile weights", () => {
    expect(validateConfig(config)).toBe(true)
    expect(config.profiles.RawHealth.dimensions.reduce((sum, item) => sum + item.weight, 0)).toBeCloseTo(config.validation.weight_sum_target)
    expect(config.profiles.DeploymentReadinessScore.dimensions.reduce((sum, item) => sum + item.weight, 0)).toBeCloseTo(config.validation.weight_sum_target)
  })

  it("keeps required unknown input null instead of converting it to zero", () => {
    const report = buildReport({
      config,
      sourceRevision: "deadbeef",
      generatedAt: "2026-09-04T00:00:00.000Z",
    })
    expect(report.scores.RawHealth.status).toBe("INSUFFICIENT")
    expect(report.scores.RawHealth.value).toBeNull()
    expect(report.scores.DeploymentReadinessScore.value).toBeNull()
    expect(report.scores.DeploymentGate.status).toBe("UNKNOWN")
    expect(report.overall.can_deploy).toBe(false)
  })

  it("renormalizes genuine NOT_APPLICABLE dimensions", () => {
    const profile = {
      version: "test",
      formula_id: "weighted_mean_v1",
      unknown_policy: "strict_required_v1",
      dimensions: [
        { id: "known", weight: 0.4, required: true },
        { id: "na", weight: 0.6, required: true },
      ],
    }
    const result = computeWeightedProfile("test", profile, {
      known: { state: "KNOWN_VALUE", value: 80, condition: "PASS", evidence_level: "E0", reason_codes: [] },
      na: { state: "NOT_APPLICABLE", value: null, condition: null, evidence_level: "E5", reason_codes: [] },
    }, config)
    expect(result.value).toBe(80)
    expect(result.status).toBe("KNOWN_VALUE")
  })

  it("refuses a numeric aggregate when one required input is unknown", () => {
    const profile = {
      version: "test",
      formula_id: "weighted_mean_v1",
      unknown_policy: "strict_required_v1",
      dimensions: [
        { id: "known", weight: 0.5, required: true },
        { id: "unknown", weight: 0.5, required: true },
      ],
    }
    const result = computeWeightedProfile("test", profile, {
      known: { state: "KNOWN_VALUE", value: 100, condition: "PASS", evidence_level: "E0", reason_codes: [] },
      unknown: { state: "UNKNOWN_REQUIRED", value: null, condition: "UNKNOWN", evidence_level: "E5", reason_codes: [] },
    }, config)
    expect(result.value).toBeNull()
    expect(result.unknown_required).toEqual(["unknown"])
  })

  it("keeps gate authority separate from a high score", () => {
    const profile = config.profiles.DeploymentReadinessScore
    const inputs = Object.fromEntries(profile.dimensions.map((dimension) => [dimension.id, {
      state: "KNOWN_VALUE",
      value: 100,
      condition: "PASS",
      evidence_level: "E0",
      reason_codes: [],
    }]))
    const score = computeWeightedProfile("DeploymentReadinessScore", profile, inputs, config)
    const gate = deriveDeploymentGate(profile, inputs, [{ id: "#18", status: "BLOCKED_EXTERNAL" }], 0, config)
    expect(score.value).toBe(100)
    expect(gate.status).toBe("BLOCKED_EXTERNAL")
    expect(gate.can_deploy).toBe(false)
  })

  it("produces a stable semantic fingerprint across timestamp changes", () => {
    const first = buildReport({ config, sourceRevision: "same-sha", generatedAt: "2026-09-04T00:00:00.000Z" })
    const second = buildReport({ config, sourceRevision: "same-sha", generatedAt: "2026-09-04T01:00:00.000Z" })
    expect(first.generated_at).not.toBe(second.generated_at)
    expect(first.report_fingerprint).toBe(second.report_fingerprint)
  })

  it("changes fingerprint when source revision changes", () => {
    const first = buildReport({ config, sourceRevision: "sha-a", generatedAt: "2026-09-04T00:00:00.000Z" })
    const second = buildReport({ config, sourceRevision: "sha-b", generatedAt: "2026-09-04T00:00:00.000Z" })
    expect(first.report_fingerprint).not.toBe(second.report_fingerprint)
  })

  it("validates required outputs, config hash, coverage invariants, and report fingerprint", () => {
    const report = buildReport({ config, sourceRevision: "deadbeef", generatedAt: "2026-09-04T00:00:00.000Z" })
    expect(validateReport(report, config)).toBe(true)
    expect(report.config_hash).toBe(sha256(config))
    for (const output of config.required_outputs) expect(report.scores).toHaveProperty(output)
  })

  it("publishes a JSON Schema that requires every canonical output", () => {
    const requiredScores = schema.properties.scores.required
    expect(new Set(requiredScores)).toEqual(new Set(config.required_outputs))
  })
})
