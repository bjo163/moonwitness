import crypto from "node:crypto"
import { assertRenderedParity } from "./umbrella-render.mjs"

export function sha256Text(value) {
  return crypto.createHash("sha256").update(String(value)).digest("hex")
}

export function scanSecretPatterns(text, patterns = []) {
  const findings = []
  for (const pattern of patterns) {
    const regex = new RegExp(pattern.regex, pattern.flags || "g")
    const matches = String(text).match(regex) || []
    if (matches.length > 0) findings.push({ id: pattern.id, count: matches.length })
  }
  return findings.sort((a, b) => a.id.localeCompare(b.id))
}

function check(id, passed, details = {}) {
  return { id, status: passed ? "PASS" : "FAIL", details }
}

export function certifyUmbrellaOutputs({
  reportBytesA,
  reportBytesB,
  markdownBytesA,
  markdownBytesB,
  expectedSha,
  certificationConfig,
  certificationConfigHash,
}) {
  const reportA = JSON.parse(reportBytesA)
  const reportB = JSON.parse(reportBytesB)

  let rendererParity = true
  let rendererParityError = null
  try {
    assertRenderedParity(markdownBytesA, reportA)
    assertRenderedParity(markdownBytesB, reportB)
  } catch (error) {
    rendererParity = false
    rendererParityError = error.message
  }

  const secretFindings = scanSecretPatterns(
    `${reportBytesA}\n${reportBytesB}\n${markdownBytesA}\n${markdownBytesB}`,
    certificationConfig.secret_patterns,
  )

  const checks = [
    check("machine_report_byte_parity", reportBytesA === reportBytesB),
    check(
      "report_fingerprint_parity",
      reportA.report_fingerprint === reportB.report_fingerprint,
      { report_fingerprint: reportA.report_fingerprint ?? null },
    ),
    check("rendered_markdown_byte_parity", markdownBytesA === markdownBytesB),
    check("renderer_manifest_parity", rendererParity, rendererParityError ? { error: rendererParityError } : {}),
    check(
      "source_revision_exact",
      Boolean(expectedSha) && reportA.source_revision === expectedSha && reportB.source_revision === expectedSha,
      { expected_sha: expectedSha, observed_sha: reportA.source_revision ?? null },
    ),
    check("secret_safety", secretFindings.length === 0, { finding_counts: secretFindings }),
  ].sort((a, b) => a.id.localeCompare(b.id))

  const byId = new Map(checks.map((item) => [item.id, item]))
  const missingRequired = certificationConfig.required_checks.filter((id) => !byId.has(id))
  const failedRequired = certificationConfig.required_checks.filter((id) => byId.get(id)?.status !== "PASS")
  const passed = missingRequired.length === 0 && failedRequired.length === 0

  return {
    schema_version: 1,
    certification_version: certificationConfig.version,
    status: passed ? "PASS" : "FAIL",
    source_revision: reportA.source_revision ?? null,
    report_fingerprint: reportA.report_fingerprint ?? null,
    certification_config_hash: certificationConfigHash,
    fixed_generated_at: certificationConfig.fixed_generated_at,
    checks,
    missing_required_checks: missingRequired,
    failed_required_checks: failedRequired,
    artifacts: {
      report_sha256: sha256Text(reportBytesA),
      markdown_sha256: sha256Text(markdownBytesA),
    },
  }
}

export function assertCertificationPass(result) {
  if (result.status !== "PASS") {
    const reasons = [...result.missing_required_checks, ...result.failed_required_checks]
    throw new Error(`UMBRELLA certification failed: ${reasons.join(", ") || "unknown failure"}`)
  }
  return true
}
