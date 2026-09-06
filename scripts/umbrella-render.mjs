import assert from "node:assert/strict"

export const CANONICAL_SCORE_NAMES = [
  "RawHealth",
  "Progress",
  "DeploymentReadinessScore",
  "DeploymentGate",
  "AuditCoverage",
  "VerifiedCoverage",
  "EvidenceConfidence",
  "RepositoryHygieneScore",
  "ComplexityScore",
  "ProgrammaticQualityScore",
  "ReproducibilityScore",
  "FutureReadinessScore",
]

function escapeCell(value) {
  return String(value ?? "—").replaceAll("|", "\\|").replaceAll("\n", " ")
}

function displayMetric(metric) {
  if (!metric) return "MISSING"
  if (metric.value !== null && metric.value !== undefined) return String(metric.value)
  return metric.status || "UNKNOWN"
}

function canonicalScore(metric) {
  if (!metric) return null
  return {
    status: metric.status ?? null,
    value: metric.value ?? null,
    band: metric.band ?? null,
  }
}

function stableBlockerIds(report) {
  const gate = report?.scores?.DeploymentGate
  const ids = gate?.external_blockers || []
  return [...ids].map(String).sort((a, b) => a.localeCompare(b))
}

export function buildParityManifest(report) {
  return {
    schema_version: 1,
    source_revision: report.source_revision,
    report_fingerprint: report.report_fingerprint,
    overall: {
      status: report.overall?.status ?? null,
      can_deploy: Boolean(report.overall?.can_deploy),
    },
    scores: Object.fromEntries(CANONICAL_SCORE_NAMES.map((name) => [name, canonicalScore(report.scores?.[name])])),
    external_blockers: stableBlockerIds(report),
  }
}

function blockerLabel(blocker, index) {
  if (typeof blocker !== "object" || blocker === null) return String(blocker)
  return String(blocker.id ?? blocker.issue ?? blocker.number ?? blocker.finding_id ?? `blocker-${index + 1}`)
}

function blockerStatus(blocker) {
  if (typeof blocker !== "object" || blocker === null) return "BLOCKED_EXTERNAL"
  return String(blocker.status ?? blocker.state ?? blocker.classification ?? "BLOCKED_EXTERNAL")
}

function blockerReason(blocker) {
  if (typeof blocker !== "object" || blocker === null) return String(blocker)
  return String(blocker.reason ?? blocker.reason_code ?? blocker.title ?? blocker.description ?? "Observed external blocker")
}

export function renderUmbrellaStatus(report) {
  if (!report || typeof report !== "object") throw new Error("A validated UMBRELLA report object is required")
  if (!report.scores || !report.report_fingerprint || !report.source_revision) {
    throw new Error("Report is missing canonical score/provenance fields")
  }

  const manifest = buildParityManifest(report)
  const inventory = report.repositories?.[0]?.inventory
  const lines = [
    "# UMBRELLA Engineering Status",
    "",
    "> GENERATED FILE — derived from the canonical UMBRELLA machine report. Do not edit manually.",
    "",
    `<!-- UMBRELLA_PARITY:${JSON.stringify(manifest)} -->`,
    "",
    "## Provenance",
    "",
    "| Field | Value |",
    "|---|---|",
    `| Source revision | \`${escapeCell(report.source_revision)}\` |`,
    `| Model | \`${escapeCell(report.model_id)}@${escapeCell(report.scoring_model_version)}\` |`,
    `| Scoring config | \`${escapeCell(report.scoring_config_version)}\` |`,
    `| Config hash | \`${escapeCell(report.config_hash)}\` |`,
    `| Report fingerprint | \`${escapeCell(report.report_fingerprint)}\` |`,
    `| Generated at | \`${escapeCell(report.generated_at)}\` |`,
    "",
    "## Canonical State",
    "",
    "| Output | Value | Status | Band |",
    "|---|---:|---|---|",
  ]

  for (const name of CANONICAL_SCORE_NAMES) {
    const metric = report.scores[name]
    if (name === "DeploymentGate") {
      lines.push(`| ${name} | ${escapeCell(metric.status)} | ${escapeCell(metric.status)} | — |`)
    } else {
      lines.push(`| ${name} | ${escapeCell(displayMetric(metric))} | ${escapeCell(metric?.status)} | ${escapeCell(metric?.band)} |`)
    }
  }

  lines.push(
    "",
    "## Deployment Gate",
    "",
    `- **Overall:** ${escapeCell(report.overall?.status)}`,
    `- **Can deploy:** ${report.overall?.can_deploy ? "YES" : "NO"}`,
    `- **Gate:** ${escapeCell(report.scores.DeploymentGate?.status)}`,
    `- **Reason codes:** ${escapeCell((report.scores.DeploymentGate?.reason_codes || []).join(", ") || "none")}`,
    "",
    "## External Blockers",
    "",
  )

  const blockers = [...(report.external_blockers || [])].sort((a, b) => blockerLabel(a, 0).localeCompare(blockerLabel(b, 0)))
  if (blockers.length === 0) {
    lines.push("No external blockers are present in the machine report.")
  } else {
    lines.push("| Blocker | Status | Reason |", "|---|---|---|")
    blockers.forEach((blocker, index) => {
      lines.push(`| ${escapeCell(blockerLabel(blocker, index))} | ${escapeCell(blockerStatus(blocker))} | ${escapeCell(blockerReason(blocker))} |`)
    })
  }

  lines.push(
    "",
    "## Generated Service Inventory",
    "",
    `- Drift status: ${escapeCell(inventory?.drift?.status ?? "UNKNOWN")}`,
    `- Drift findings: ${inventory?.drift?.findings?.length ?? 0}`,
    `- Services: ${inventory?.services?.length ?? 0}`,
    `- Workspace packages: ${inventory?.workspaces?.length ?? 0}`,
    `- Production env keys: ${inventory?.env_example_keys?.length ?? 0}`,
    `- Canonical app ports: ${Object.keys(inventory?.port_constants || {}).length}`,
    "",
    "## Evidence Inventory",
    "",
    `- Components: ${report.components?.length ?? 0}`,
    `- Issues: ${report.issues?.length ?? 0}`,
    `- Evidence records: ${report.evidence?.length ?? 0}`,
    `- Hardcode findings: ${report.hardcodes?.length ?? 0}`,
    `- Hygiene records: ${report.hygiene?.length ?? 0}`,
    `- Complexity records: ${report.complexity?.length ?? 0}`,
    `- Future-tech records: ${report.future_tech?.length ?? 0}`,
    "",
    "This Markdown is a view of the JSON state only. Scoring, gating, progress, inventory drift, and issue truth are never recalculated here.",
    "",
  )

  return lines.join("\n")
}

export function extractParityManifest(markdown) {
  const match = String(markdown).match(/<!-- UMBRELLA_PARITY:(\{[^\n]+\}) -->/)
  if (!match) throw new Error("Rendered status is missing UMBRELLA parity manifest")
  return JSON.parse(match[1])
}

export function assertRenderedParity(markdown, report) {
  assert.deepEqual(extractParityManifest(markdown), buildParityManifest(report))
  assert.equal(markdown, renderUmbrellaStatus(report), "Rendered Markdown diverges from canonical report")
  return true
}
