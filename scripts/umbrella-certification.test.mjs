import { test } from "vitest"
import assert from "node:assert/strict"
import { assertCertificationPass, certifyUmbrellaOutputs, scanSecretPatterns, sha256Text } from "./umbrella-certification.mjs"
import { renderUmbrellaStatus } from "./umbrella-render.mjs"

function fixtureReport() {
  const metric = (value) => ({ status: "KNOWN_VALUE", value, band: "GOOD" })
  return {
    schema_version: 1,
    generated_at: "2000-01-01T00:00:00.000Z",
    source_revision: "abc123",
    model_id: "fixture",
    scoring_model_version: "1",
    scoring_config_version: "1",
    config_hash: "a".repeat(64),
    report_fingerprint: "b".repeat(64),
    overall: { status: "BLOCKED", can_deploy: false },
    scores: {
      RawHealth: metric(100),
      Progress: metric(90),
      DeploymentReadinessScore: metric(100),
      DeploymentGate: { status: "BLOCKED_EXTERNAL", external_blockers: [18], reason_codes: ["EXTERNAL_BLOCKER"] },
      AuditCoverage: metric(100),
      VerifiedCoverage: metric(100),
      EvidenceConfidence: metric(100),
      RepositoryHygieneScore: metric(94),
      ComplexityScore: metric(90),
      ProgrammaticQualityScore: metric(93),
      ReproducibilityScore: metric(83),
      FutureReadinessScore: metric(39),
    },
    components: [], evidence: [], hardcodes: [], hygiene: [], complexity: [], future_tech: [],
    external_blockers: [{ id: 18, status: "BLOCKED_EXTERNAL", reason: "branch protection" }],
  }
}

const config = {
  version: "1.0.0",
  fixed_generated_at: "2000-01-01T00:00:00.000Z",
  required_checks: [
    "machine_report_byte_parity",
    "report_fingerprint_parity",
    "rendered_markdown_byte_parity",
    "renderer_manifest_parity",
    "source_revision_exact",
    "secret_safety",
  ],
  secret_patterns: [{ id: "github_token", regex: "\\bghp_[A-Za-z0-9]{20,}\\b", flags: "g" }],
}

test("secret scanner returns classifications and counts without leaking matched values", () => {
  const secret = `ghp_${"A".repeat(24)}`
  const findings = scanSecretPatterns(`before ${secret} after`, config.secret_patterns)
  assert.deepEqual(findings, [{ id: "github_token", count: 1 }])
  assert.equal(JSON.stringify(findings).includes(secret), false)
})

test("certification passes only when machine, renderer, provenance, and secret checks agree", () => {
  const report = fixtureReport()
  const reportBytes = `${JSON.stringify(report, null, 2)}\n`
  const markdown = renderUmbrellaStatus(report)
  const result = certifyUmbrellaOutputs({
    reportBytesA: reportBytes,
    reportBytesB: reportBytes,
    markdownBytesA: markdown,
    markdownBytesB: markdown,
    expectedSha: "abc123",
    certificationConfig: config,
    certificationConfigHash: sha256Text(JSON.stringify(config)),
  })
  assert.equal(result.status, "PASS")
  assert.equal(assertCertificationPass(result), true)
  assert.equal(result.checks.every((item) => item.status === "PASS"), true)
})

test("certification fails closed on nondeterminism or source revision mismatch", () => {
  const reportA = fixtureReport()
  const reportB = { ...fixtureReport(), report_fingerprint: "c".repeat(64) }
  const bytesA = `${JSON.stringify(reportA, null, 2)}\n`
  const bytesB = `${JSON.stringify(reportB, null, 2)}\n`
  const result = certifyUmbrellaOutputs({
    reportBytesA: bytesA,
    reportBytesB: bytesB,
    markdownBytesA: renderUmbrellaStatus(reportA),
    markdownBytesB: renderUmbrellaStatus(reportB),
    expectedSha: "different-sha",
    certificationConfig: config,
    certificationConfigHash: "d".repeat(64),
  })
  assert.equal(result.status, "FAIL")
  assert.equal(result.failed_required_checks.includes("machine_report_byte_parity"), true)
  assert.equal(result.failed_required_checks.includes("source_revision_exact"), true)
  assert.throws(() => assertCertificationPass(result), /certification failed/)
})
