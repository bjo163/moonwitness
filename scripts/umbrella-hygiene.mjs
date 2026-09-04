import fs from "node:fs"
import path from "node:path"
import { spawnSync } from "node:child_process"
import { computeWeightedProfile } from "./umbrella-audit-core.mjs"

const TEXT_EXTENSIONS = new Set([".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs", ".json", ".yml", ".yaml", ".md", ".txt", ".env", ".toml"])
const WALK_IGNORES = new Set(["node_modules", ".git"])

function normalize(value) {
  return value.split(path.sep).join("/")
}

function uniqueSorted(values) {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b))
}

function compilePatterns(patterns = []) {
  return patterns.map((pattern) => new RegExp(pattern))
}

function listTrackedFiles(rootDir) {
  const git = spawnSync("git", ["ls-files", "-z"], { cwd: rootDir, encoding: "utf8" })
  if (git.status === 0) return git.stdout.split("\0").filter(Boolean).map(normalize).sort((a, b) => a.localeCompare(b))

  const result = []
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (WALK_IGNORES.has(entry.name)) continue
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) walk(fullPath)
      else if (entry.isFile()) result.push(normalize(path.relative(rootDir, fullPath)))
    }
  }
  walk(rootDir)
  return result.sort((a, b) => a.localeCompare(b))
}

function scoreFromPenalty(count, penalty) {
  return Math.max(0, Math.min(100, 100 - count * penalty))
}

function known(value, evidenceLevel, reasonCodes = []) {
  return { state: "KNOWN_VALUE", value, condition: value >= 100 ? "PASS" : "WARN", evidence_level: evidenceLevel, reason_codes: reasonCodes }
}

function unknown(reason) {
  return { state: "UNKNOWN_REQUIRED", value: null, condition: "UNKNOWN", evidence_level: "E5", reason_codes: [reason] }
}

function scanGeneratedArtifacts(files, config) {
  const patterns = compilePatterns(config.generated_path_patterns)
  return files.filter((file) => patterns.some((pattern) => pattern.test(file)))
}

function scanGitignore(rootDir, config) {
  const gitignorePath = path.join(rootDir, ".gitignore")
  if (!fs.existsSync(gitignorePath)) return { missing: [...config.required_gitignore_entries], total: config.required_gitignore_entries.length }
  const lines = fs.readFileSync(gitignorePath, "utf8").split(/\r?\n/).map((line) => line.trim()).filter((line) => line && !line.startsWith("#"))
  const missing = config.required_gitignore_entries.filter((required) => !lines.includes(required))
  return { missing, total: config.required_gitignore_entries.length }
}

function isTextCandidate(filePath) {
  const base = path.basename(filePath)
  if (base.startsWith(".env")) return true
  return TEXT_EXTENSIONS.has(path.extname(base).toLowerCase()) || base === "Dockerfile"
}

function scanSecrets(rootDir, files, config) {
  const excludePatterns = compilePatterns(config.secret_scan.exclude_patterns)
  const secretPatterns = config.secret_patterns.map((entry) => ({ ...entry, regex: new RegExp(entry.pattern, "g") }))
  const findings = []
  let assessedFiles = 0

  for (const relativePath of files) {
    if (excludePatterns.some((pattern) => pattern.test(relativePath))) continue
    if (!isTextCandidate(relativePath)) continue
    const absolute = path.join(rootDir, relativePath)
    if (!fs.existsSync(absolute)) continue
    const stat = fs.statSync(absolute)
    if (!stat.isFile() || stat.size > config.secret_scan.max_file_bytes) continue
    assessedFiles += 1
    const content = fs.readFileSync(absolute, "utf8")
    for (const detector of secretPatterns) {
      detector.regex.lastIndex = 0
      for (const match of content.matchAll(detector.regex)) {
        findings.push({ id: detector.id, file: relativePath, line: content.slice(0, match.index).split("\n").length })
      }
    }
  }

  return { findings, assessedFiles }
}

function scanStaleConfig(rootDir, files) {
  const findings = []
  for (const packagePath of files.filter((file) => path.basename(file) === "package.json")) {
    let pkg
    try { pkg = JSON.parse(fs.readFileSync(path.join(rootDir, packagePath), "utf8")) } catch { continue }
    const baseDir = path.dirname(path.join(rootDir, packagePath))
    for (const [name, command] of Object.entries(pkg.scripts || {})) {
      const match = String(command).match(/(?:^|&&\s*|;\s*)node\s+([^\s;&|]+)/)
      if (!match) continue
      const target = match[1].replace(/^['"]|['"]$/g, "")
      if (target.startsWith("-") || target.includes("$")) continue
      if (!fs.existsSync(path.resolve(baseDir, target))) findings.push({ package: packagePath, script: name, target: normalize(path.relative(rootDir, path.resolve(baseDir, target))) })
    }
  }
  return findings.sort((a, b) => `${a.package}:${a.script}`.localeCompare(`${b.package}:${b.script}`))
}

function scanDuplicateConfig(files, config) {
  const findings = []
  const fileSet = new Set(files)
  for (const group of config.duplicate_config_groups) {
    const present = group.paths.filter((file) => fileSet.has(file))
    if (present.length > group.allowed_max) findings.push({ id: group.id, present })
  }
  return findings
}

function scanRootClutter(files, config) {
  const patterns = compilePatterns(config.root_allow_patterns)
  return files.filter((file) => !file.includes("/") && !patterns.some((pattern) => pattern.test(file))).sort((a, b) => a.localeCompare(b))
}

export function collectRepositoryHygiene(rootDir, scoringConfig, config) {
  const files = listTrackedFiles(rootDir)
  const generated = scanGeneratedArtifacts(files, config)
  const gitignore = scanGitignore(rootDir, config)
  const secrets = scanSecrets(rootDir, files, config)
  const staleConfig = scanStaleConfig(rootDir, files)
  const duplicates = scanDuplicateConfig(files, config)
  const rootClutter = scanRootClutter(files, config)

  const gitignoreScore = gitignore.total === 0 ? 100 : ((gitignore.total - gitignore.missing.length) / gitignore.total) * 100
  const inputs = {
    generated_artifacts: known(scoreFromPenalty(generated.length, config.penalties.per_generated_artifact), "E1", generated.length ? ["TRACKED_GENERATED_ARTIFACTS"] : []),
    gitignore_integrity: known(gitignoreScore, "E1", gitignore.missing.length ? ["MISSING_REQUIRED_GITIGNORE_ENTRY"] : []),
    secret_hygiene: known(secrets.findings.length ? config.penalties.secret_finding_score : 100, "E1", secrets.findings.length ? ["HIGH_CONFIDENCE_SECRET_PATTERN"] : []),
    stale_config: known(scoreFromPenalty(staleConfig.length, config.penalties.per_stale_config), "E1", staleConfig.length ? ["STALE_SCRIPT_TARGET"] : []),
    duplicate_config: known(scoreFromPenalty(duplicates.length, config.penalties.per_duplicate_config), "E1", duplicates.length ? ["DUPLICATE_CONFIG_OWNERSHIP"] : []),
    repo_root_clutter: known(scoreFromPenalty(rootClutter.length, config.penalties.per_root_clutter_item), "E1", rootClutter.length ? ["UNCLASSIFIED_ROOT_ITEM"] : []),
    dead_code_ratio: unknown("DEAD_CODE_COLLECTOR_NOT_YET_RELIABLE"),
    unused_dependency_ratio: unknown("UNUSED_DEPENDENCY_COLLECTOR_NOT_YET_RELIABLE"),
  }

  const metric = computeWeightedProfile("RepositoryHygieneScore", config.profile, inputs, scoringConfig)
  const knownCount = Object.values(inputs).filter((input) => input.state === scoringConfig.states.known).length
  const applicable = config.profile.dimensions.length
  const coverage = Number(((knownCount / applicable) * 100).toFixed(scoringConfig.rounding.decimals))

  const findings = [
    ...generated.map((file) => ({ category: "generated_artifact", file })),
    ...gitignore.missing.map((entry) => ({ category: "gitignore", entry })),
    ...secrets.findings.map((finding) => ({ category: "secret_hygiene", ...finding })),
    ...staleConfig.map((finding) => ({ category: "stale_config", ...finding })),
    ...duplicates.map((finding) => ({ category: "duplicate_config", ...finding })),
    ...rootClutter.map((file) => ({ category: "repo_root_clutter", file })),
  ].sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)))

  return {
    metric,
    coverage: {
      profile: "RepositoryHygieneScore",
      applicable_dimensions: applicable,
      measured_dimensions: knownCount,
      measurement_coverage: coverage,
      unknown_dimensions: uniqueSorted(Object.entries(inputs).filter(([, input]) => input.state !== scoringConfig.states.known).map(([id]) => id)),
    },
    findings,
    details: {
      tracked_files: files.length,
      secret_files_assessed: secrets.assessedFiles,
      generated_artifact_violations: generated.length,
      gitignore_violations: gitignore.missing.length,
      secret_hygiene_findings: secrets.findings.length,
      stale_config_count: staleConfig.length,
      duplicate_config_count: duplicates.length,
      repo_root_clutter_count: rootClutter.length,
    },
  }
}
