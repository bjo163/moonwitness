import fs from "node:fs"
import path from "node:path"
import { spawnSync } from "node:child_process"
import { bandFor, computeWeightedProfile } from "./umbrella-audit-core.mjs"
import { runSupplementalCollectors } from "./audit-collector-contract.mjs"

function normalize(value) { return value.split(path.sep).join("/") }
function clamp(value) { return Math.max(0, Math.min(100, value)) }
function round(value, decimals = 2) { return Number(value.toFixed(decimals)) }
function ratioScore(passed, total) { return total === 0 ? 100 : (passed / total) * 100 }
function known(value, reasons = []) { return { state: "KNOWN_VALUE", value: clamp(value), condition: value >= 70 ? "PASS" : "WARN", evidence_level: "E1", reason_codes: reasons } }

function trackedFiles(rootDir) {
  const git = spawnSync("git", ["ls-files", "-z"], { cwd: rootDir, encoding: "utf8" })
  if (git.status === 0) return git.stdout.split("\0").filter(Boolean).map(normalize).sort((a, b) => a.localeCompare(b))
  const result = []
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (["node_modules", ".git", ".next", "dist", "build", "coverage", ".turbo"].includes(entry.name)) continue
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) walk(full)
      else if (entry.isFile()) result.push(normalize(path.relative(rootDir, full)))
    }
  }
  walk(rootDir)
  return result.sort((a, b) => a.localeCompare(b))
}

function read(rootDir, relative) {
  const full = path.join(rootDir, relative)
  return fs.existsSync(full) ? fs.readFileSync(full, "utf8") : ""
}
function allWorkflowText(rootDir, files) {
  return files.filter((file) => /^\.github\/workflows\/.*\.ya?ml$/.test(file)).map((file) => read(rootDir, file)).join("\n")
}

function actionUses(workflowText) {
  const result = []
  for (const match of workflowText.matchAll(/uses:\s*([^\s@]+)@([^\s#]+)/g)) result.push({ action: match[1], ref: match[2] })
  return result
}
function refMajor(ref) {
  const match = String(ref).match(/^v(\d+)(?:\.|$)/)
  return match ? Number(match[1]) : null
}
function actionPinScore(ref) {
  if (/^[0-9a-f]{40}$/i.test(ref)) return 100
  if (/^v\d+\.\d+\.\d+$/.test(ref)) return 90
  if (/^v\d+$/.test(ref)) return 70
  if (/^[0-9a-f]{7,39}$/i.test(ref)) return 80
  return 20
}
function nodeVersionPinScore(value) {
  const text = String(value).replace(/["']/g, "").trim()
  if (/^\d+\.\d+\.\d+$/.test(text)) return 100
  if (/^\d+\.\d+$/.test(text)) return 90
  if (/^\d+$/.test(text)) return 75
  return 25
}
function imagePinScore(ref) {
  if (ref.includes("@sha256:")) return 100
  const tag = ref.includes(":") ? ref.slice(ref.lastIndexOf(":") + 1) : "latest"
  if (tag === "latest" || !tag) return 0
  if (/^\d+\.\d+\.\d+(?:[-.][A-Za-z0-9.-]+)?$/.test(tag)) return 85
  if (/^\d+(?:\.\d+)?(?:[-.][A-Za-z0-9.-]+)?$/.test(tag)) return 65
  return 45
}

function programmaticQuality(rootDir, files, workflowText, scoringConfig, config) {
  const requiredFiles = config.required_programmatic_files
  const configDriven = ratioScore(requiredFiles.filter((file) => files.includes(file)).length, requiredFiles.length)
  const gitignore = read(rootDir, ".gitignore")
  const core = read(rootDir, "scripts/umbrella-audit-core.mjs")
  const generatedChecks = [files.includes(".audit/schema/umbrella-report.schema.json"), gitignore.includes(".audit/umbrella-report.json"), core.includes("report_fingerprint"), !files.includes(".audit/umbrella-report.json")]
  const generatedTruth = ratioScore(generatedChecks.filter(Boolean).length, generatedChecks.length)

  const testPattern = new RegExp(config.test_path_pattern)
  const nondeterministic = config.nondeterministic_test_patterns.map((pattern) => new RegExp(pattern))
  const testFiles = files.filter((file) => testPattern.test(file) && /\.[cm]?[jt]sx?$/.test(file))
  const nondeterministicFiles = testFiles.filter((file) => {
    const content = read(rootDir, file)
    return nondeterministic.some((pattern) => pattern.test(content)) && !/seed|fakeTimers|mockDate/i.test(content)
  })
  const deterministicTestData = testFiles.length ? 100 - (nondeterministicFiles.length / testFiles.length) * 100 : 100

  const automationCoverage = ratioScore(config.workflow_required_signals.filter((signal) => workflowText.includes(signal)).length, config.workflow_required_signals.length)
  const evidenceWorkflow = read(rootDir, ".github/workflows/foundation-ci.yml")
  const driftChecks = [files.includes("scripts/audit-collector-contract.mjs"), core.includes("report_fingerprint"), evidenceWorkflow.includes("getBranch"), files.includes(".audit/config/evidence.v1.json"), evidenceWorkflow.includes("ci-evidence.json")]
  const driftDetection = ratioScore(driftChecks.filter(Boolean).length, driftChecks.length)

  const inputs = {
    config_driven: known(configDriven),
    generated_truth: known(generatedTruth),
    deterministic_test_data: known(deterministicTestData, nondeterministicFiles.length ? ["NONDETERMINISTIC_TEST_DATA"] : []),
    automation_coverage: known(automationCoverage),
    drift_detection: known(driftDetection),
  }
  const profile = config.profiles.ProgrammaticQualityScore
  const baseProfile = { ...profile, formula_id: profile.base_formula_id }
  const metric = computeWeightedProfile("ProgrammaticQualityScore", baseProfile, inputs, scoringConfig)

  const hardcodes = runSupplementalCollectors(rootDir).flatMap((collector) => collector.findings.map((finding) => ({ collector: collector.id, ...finding })))
  const penalty = Math.min(config.hardcode_penalty.cap, hardcodes.reduce((sum, finding) => sum + (config.hardcode_penalty[finding.status] || 0), 0))
  if (metric.value !== null) {
    metric.value = round(clamp(metric.value - penalty), scoringConfig.rounding.decimals)
    metric.band = bandFor(metric.value, scoringConfig)
  }
  metric.formula_id = profile.formula_id
  return { metric, hardcode_penalty: penalty, hardcodes, nondeterministic_test_files: nondeterministicFiles.sort((a, b) => a.localeCompare(b)) }
}

function reproducibility(rootDir, files, workflowText, scoringConfig, config) {
  const pkg = JSON.parse(read(rootDir, "package.json") || "{}")
  const installMatches = [...workflowText.matchAll(/pnpm install[^\n]*/g)].map((match) => match[0])
  const frozenScore = ratioScore(installMatches.filter((line) => line.includes("--frozen-lockfile")).length, installMatches.length)
  const nodePins = [...workflowText.matchAll(/node-version:\s*([^\s#]+)/g)].map((match) => nodeVersionPinScore(match[1]))
  const actions = actionUses(workflowText)
  const actionPin = actions.length ? actions.reduce((sum, item) => sum + actionPinScore(item.ref), 0) / actions.length : 100

  const dockerText = [read(rootDir, "Dockerfile"), read(rootDir, "apps/api/Dockerfile"), read(rootDir, "docker-compose.yml")].join("\n")
  const imageRefs = [
    ...[...dockerText.matchAll(/^FROM\s+([^\s]+)(?:\s+AS\s+\S+)?/gmi)].map((m) => m[1]),
    ...[...dockerText.matchAll(/^\s*image:\s*([^\s#]+)/gmi)].map((m) => m[1]),
  ]
  const containerPin = imageRefs.length ? imageRefs.reduce((sum, ref) => sum + imagePinScore(ref), 0) / imageRefs.length : 100
  const certification = read(rootDir, ".github/workflows/witness-postgres-certification.yml")
  const certScore = ratioScore(config.certification_required_signals.filter((signal) => certification.toLowerCase().includes(signal.toLowerCase())).length, config.certification_required_signals.length)

  const inputs = {
    lockfile: known(files.includes("pnpm-lock.yaml") ? 100 : 0, files.includes("pnpm-lock.yaml") ? [] : ["LOCKFILE_MISSING"]),
    package_manager_pin: known(/^pnpm@\d+\.\d+\.\d+$/.test(pkg.packageManager || "") ? 100 : 40),
    frozen_install_ci: known(frozenScore),
    node_runtime_pin: known(nodePins.length ? nodePins.reduce((a, b) => a + b, 0) / nodePins.length : 0),
    container_pin: known(containerPin, containerPin < 100 ? ["CONTAINER_TAG_NOT_DIGEST_PINNED"] : []),
    action_pin: known(actionPin, actionPin < 100 ? ["WORKFLOW_ACTION_NOT_SHA_PINNED"] : []),
    clean_checkout_certification: known(certScore),
  }
  return { metric: computeWeightedProfile("ReproducibilityScore", config.profiles.ReproducibilityScore, inputs, scoringConfig), details: { install_commands: installMatches.length, action_uses: actions.length, container_images: imageRefs } }
}

function minimumEngineMajor(engineRange) {
  const match = String(engineRange || "").match(/(?:>=|\^|~)?\s*(\d+)/)
  return match ? Number(match[1]) : null
}

function futureReadiness(rootDir, files, workflowText, scoringConfig, config, baseline) {
  const pkg = JSON.parse(read(rootDir, "package.json") || "{}")
  const minMajor = minimumEngineMajor(pkg.engines?.node)
  const eol = new Set(baseline.node.eol_majors)
  const supported = new Set(baseline.node.production_supported_majors)
  const ciMajors = [...workflowText.matchAll(/node-version:\s*['"]?(\d+)/g)].map((m) => Number(m[1]))
  const engineScore = minMajor === null ? 0 : eol.has(minMajor) ? 50 : supported.has(minMajor) || minMajor >= baseline.node.current_major ? 100 : 70
  const ciRuntimeScore = ciMajors.length ? ratioScore(ciMajors.filter((major) => supported.has(major) || major >= baseline.node.current_major).length, ciMajors.length) : 0
  const runtimeSupport = (engineScore + ciRuntimeScore) / 2

  const uses = actionUses(workflowText)
  const knownUses = uses.filter((item) => baseline.github_actions.minimum_node24_major[item.action] !== undefined)
  const actionRuntime = knownUses.length ? ratioScore(knownUses.filter((item) => {
    const major = refMajor(item.ref)
    return major !== null && major >= baseline.github_actions.minimum_node24_major[item.action]
  }).length, knownUses.length) : 100
  const outdatedActions = knownUses.filter((item) => {
    const major = refMajor(item.ref)
    return major === null || major < baseline.github_actions.minimum_node24_major[item.action]
  }).map((item) => ({ ...item, minimum_node24_major: baseline.github_actions.minimum_node24_major[item.action], observed_current_major: baseline.github_actions.observed_current_major[item.action] || null }))

  const dependencyAutomationFiles = [".github/dependabot.yml", ".github/dependabot.yaml", "renovate.json", "renovate.json5", ".renovaterc", ".renovaterc.json"]
  const dependencyAutomation = dependencyAutomationFiles.some((file) => files.includes(file)) ? 100 : 0
  const releaseText = [read(rootDir, "RELEASE.md"), read(rootDir, "DEVELOPMENT.md"), read(rootDir, "ROADMAP.md")].join("\n").toLowerCase()
  const releaseSignals = ["upgrade", "lts", "deprecat", "dependency"]
  const releasePolicy = ratioScore(releaseSignals.filter((signal) => releaseText.includes(signal)).length, releaseSignals.length)
  const securityText = `${workflowText}\n${read(rootDir, "scripts/audit-rules.mjs")}\n${read(rootDir, "scripts/audit-collector-contract.mjs")}`.toLowerCase()
  const securityAutomation = ratioScore(config.security_signals.filter((signal) => securityText.includes(signal.toLowerCase())).length, config.security_signals.length)
  const baselineProvenance = baseline.as_of && baseline.sources?.length >= 3 && baseline.node?.production_supported_majors?.length ? 100 : 0

  const inputs = {
    runtime_support: known(runtimeSupport, eol.has(minMajor) ? ["ENGINE_RANGE_INCLUDES_EOL_NODE"] : []),
    actions_runtime: known(actionRuntime, outdatedActions.length ? ["ACTIONS_NODE20_RUNTIME_DEBT"] : []),
    dependency_update_automation: known(dependencyAutomation, dependencyAutomation ? [] : ["DEPENDENCY_UPDATE_AUTOMATION_MISSING"]),
    release_upgrade_policy: known(releasePolicy),
    security_automation: known(securityAutomation),
    baseline_provenance: known(baselineProvenance),
  }

  const recommendations = []
  if (eol.has(minMajor)) recommendations.push({ id: "node-engine-floor", current: pkg.engines?.node || null, recommendation: `exclude EOL Node ${minMajor}; production-supported majors at baseline are ${baseline.node.production_supported_majors.join(", ")}` })
  for (const action of outdatedActions) recommendations.push({ id: `action:${action.action}`, current: `${action.action}@${action.ref}`, recommendation: `move to Node24-capable major >= v${action.minimum_node24_major}; observed current major v${action.observed_current_major}` })
  if (!dependencyAutomation) recommendations.push({ id: "dependency-update-automation", current: "absent", recommendation: "add Dependabot or Renovate with controlled update policy" })

  return { metric: computeWeightedProfile("FutureReadinessScore", config.profiles.FutureReadinessScore, inputs, scoringConfig), recommendations, baseline: { as_of: baseline.as_of, sources: baseline.sources } }
}

export function collectQualityReproFuture(rootDir, scoringConfig, config, baseline) {
  const files = trackedFiles(rootDir)
  const workflowText = allWorkflowText(rootDir, files)
  return {
    programmatic_quality: programmaticQuality(rootDir, files, workflowText, scoringConfig, config),
    reproducibility: reproducibility(rootDir, files, workflowText, scoringConfig, config),
    future_readiness: futureReadiness(rootDir, files, workflowText, scoringConfig, config, baseline),
  }
}
