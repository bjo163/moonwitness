import fs from "node:fs"
import path from "node:path"
import crypto from "node:crypto"
import { spawnSync } from "node:child_process"
import ts from "typescript"
import { computeWeightedProfile } from "./umbrella-audit-core.mjs"

function normalize(value) { return value.split(path.sep).join("/") }
function round(value, decimals = 2) { return Number(value.toFixed(decimals)) }
function clamp(value) { return Math.max(0, Math.min(100, value)) }
function uniqueSorted(values) { return [...new Set(values)].sort((a, b) => a.localeCompare(b)) }
function compile(patterns = []) { return patterns.map((p) => new RegExp(p)) }
function hash(value) { return crypto.createHash("sha1").update(value).digest("hex") }

function known(value, evidence = "E1", reasons = []) {
  return { state: "KNOWN_VALUE", value: clamp(value), condition: value >= 70 ? "PASS" : "WARN", evidence_level: evidence, reason_codes: reasons }
}
function unknown(reason) { return { state: "UNKNOWN_REQUIRED", value: null, condition: "UNKNOWN", evidence_level: "E5", reason_codes: [reason] } }

function listSourceFiles(rootDir, config) {
  const excludes = compile(config.exclude_patterns)
  const extensions = new Set(config.source_extensions)
  const git = spawnSync("git", ["ls-files", "-z"], { cwd: rootDir, encoding: "utf8" })
  let files = []
  if (git.status === 0) files = git.stdout.split("\0").filter(Boolean)
  else {
    const walk = (dir) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (["node_modules", ".git"].includes(entry.name)) continue
        const full = path.join(dir, entry.name)
        if (entry.isDirectory()) walk(full)
        else if (entry.isFile()) files.push(normalize(path.relative(rootDir, full)))
      }
    }
    walk(rootDir)
  }
  return files.map(normalize).filter((file) => extensions.has(path.extname(file).toLowerCase()) && fs.existsSync(path.join(rootDir, file)) && !excludes.some((re) => re.test(file))).sort((a, b) => a.localeCompare(b))
}

function isFunctionNode(node) {
  return ts.isFunctionDeclaration(node) || ts.isFunctionExpression(node) || ts.isArrowFunction(node) || ts.isMethodDeclaration(node) || ts.isConstructorDeclaration(node) || ts.isGetAccessorDeclaration(node) || ts.isSetAccessorDeclaration(node)
}

function functionName(node, sourceFile) {
  if (node.name?.getText) return node.name.getText(sourceFile)
  const parent = node.parent
  if (parent && ts.isVariableDeclaration(parent) && parent.name?.getText) return parent.name.getText(sourceFile)
  return `<anonymous@${sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1}>`
}

function scriptKindFor(file) {
  if (file.endsWith(".tsx")) return ts.ScriptKind.TSX
  if (file.endsWith(".jsx")) return ts.ScriptKind.JSX
  if (file.endsWith(".js") || file.endsWith(".mjs") || file.endsWith(".cjs")) return ts.ScriptKind.JS
  return ts.ScriptKind.TS
}

function analyzeFunction(node, sourceFile) {
  let cyclomatic = 1
  let cognitive = 0
  let maxNesting = 0
  const visit = (child, nesting) => {
    if (child !== node && isFunctionNode(child)) return
    let nextNesting = nesting
    let decision = false
    if (ts.isIfStatement(child) || ts.isForStatement(child) || ts.isForInStatement(child) || ts.isForOfStatement(child) || ts.isWhileStatement(child) || ts.isDoStatement(child) || ts.isCatchClause(child) || ts.isConditionalExpression(child)) decision = true
    if (ts.isCaseClause(child)) decision = true
    if (decision) {
      cyclomatic += 1
      cognitive += 1 + nesting
      nextNesting = nesting + 1
      maxNesting = Math.max(maxNesting, nextNesting)
    }
    if (ts.isBinaryExpression(child) && [ts.SyntaxKind.AmpersandAmpersandToken, ts.SyntaxKind.BarBarToken, ts.SyntaxKind.QuestionQuestionToken].includes(child.operatorToken.kind)) {
      cyclomatic += 1
      cognitive += 1
    }
    ts.forEachChild(child, (grandchild) => visit(grandchild, nextNesting))
  }
  if (node.body) visit(node.body, 0)
  const pos = sourceFile.getLineAndCharacterOfPosition(node.getStart())
  return { name: functionName(node, sourceFile), line: pos.line + 1, cyclomatic, cognitive, max_nesting: maxNesting }
}

function importsFor(sourceFile) {
  const imports = []
  const visit = (node) => {
    if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) imports.push(node.moduleSpecifier.text)
    if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword && node.arguments[0] && ts.isStringLiteral(node.arguments[0])) imports.push(node.arguments[0].text)
    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === "require" && node.arguments[0] && ts.isStringLiteral(node.arguments[0])) imports.push(node.arguments[0].text)
    ts.forEachChild(node, visit)
  }
  visit(sourceFile)
  return uniqueSorted(imports)
}

function resolveLocalImport(fromFile, specifier, fileSet) {
  if (!specifier.startsWith(".")) return null
  const base = normalize(path.posix.normalize(path.posix.join(path.posix.dirname(fromFile), specifier)))
  const candidates = [base, ...[".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"].map((ext) => `${base}${ext}`), ...[".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"].map((ext) => `${base}/index${ext}`)]
  return candidates.find((candidate) => fileSet.has(candidate)) || null
}

function tarjan(graph) {
  let index = 0
  const stack = []
  const onStack = new Set()
  const indices = new Map()
  const low = new Map()
  const components = []
  const visit = (v) => {
    indices.set(v, index); low.set(v, index); index += 1; stack.push(v); onStack.add(v)
    for (const w of graph.get(v) || []) {
      if (!indices.has(w)) { visit(w); low.set(v, Math.min(low.get(v), low.get(w))) }
      else if (onStack.has(w)) low.set(v, Math.min(low.get(v), indices.get(w)))
    }
    if (low.get(v) === indices.get(v)) {
      const component = []
      let w
      do { w = stack.pop(); onStack.delete(w); component.push(w) } while (w !== v)
      components.push(component.sort((a, b) => a.localeCompare(b)))
    }
  }
  for (const v of [...graph.keys()].sort((a, b) => a.localeCompare(b))) if (!indices.has(v)) visit(v)
  return components
}

function condensedDepth(graph, components) {
  const componentOf = new Map()
  components.forEach((component, index) => component.forEach((file) => componentOf.set(file, index)))
  const dag = new Map(components.map((_, index) => [index, new Set()]))
  for (const [from, targets] of graph) for (const to of targets) {
    const a = componentOf.get(from), b = componentOf.get(to)
    if (a !== b) dag.get(a).add(b)
  }
  const memo = new Map()
  const depth = (id) => {
    if (memo.has(id)) return memo.get(id)
    const value = 1 + Math.max(0, ...[...dag.get(id)].map(depth))
    memo.set(id, value); return value
  }
  return Math.max(0, ...[...dag.keys()].map(depth))
}

function thresholdScore(values, warn, critical) {
  if (!values.length) return 100
  const penalties = values.map((value) => value <= warn ? 0 : value >= critical ? 100 : ((value - warn) / (critical - warn)) * 100)
  return clamp(100 - penalties.reduce((a, b) => a + b, 0) / penalties.length)
}

function duplicateStats(rootDir, files, blockLines) {
  const blocks = new Map()
  for (const file of files) {
    const lines = fs.readFileSync(path.join(rootDir, file), "utf8").split(/\r?\n/).map((line) => line.trim()).filter((line) => line && !line.startsWith("//") && !line.startsWith("*") && !line.startsWith("/*"))
    for (let i = 0; i + blockLines <= lines.length; i += 1) {
      const normalized = lines.slice(i, i + blockLines).join("\n").replace(/\s+/g, " ")
      const key = hash(normalized)
      if (!blocks.has(key)) blocks.set(key, new Set())
      blocks.get(key).add(file)
    }
  }
  const duplicated = [...blocks.values()].filter((set) => set.size > 1)
  const participating = new Set(duplicated.flatMap((set) => [...set]))
  return { duplicate_blocks: duplicated.length, participating_files: participating.size, ratio: files.length ? participating.size / files.length : 0 }
}

function historyCounts(rootDir, files, config) {
  const total = spawnSync("git", ["rev-list", "--count", "HEAD"], { cwd: rootDir, encoding: "utf8" })
  const commits = total.status === 0 ? Number(total.stdout.trim()) : 0
  if (!Number.isFinite(commits) || commits < config.thresholds.min_history_commits) return { available: false, commits, changes: new Map() }
  const log = spawnSync("git", ["log", `-n${config.thresholds.history_lookback_commits}`, "--format=", "--name-only"], { cwd: rootDir, encoding: "utf8", maxBuffer: 20 * 1024 * 1024 })
  if (log.status !== 0) return { available: false, commits, changes: new Map() }
  const fileSet = new Set(files)
  const changes = new Map(files.map((file) => [file, 0]))
  for (const line of log.stdout.split(/\r?\n/).map((v) => normalize(v.trim())).filter(Boolean)) if (fileSet.has(line)) changes.set(line, (changes.get(line) || 0) + 1)
  return { available: true, commits, changes }
}

function criticalityFor(file, config) {
  for (const rule of config.criticality.rules) if (new RegExp(rule.pattern).test(file)) return rule.multiplier
  return config.criticality.default_multiplier
}

export function collectComplexity(rootDir, scoringConfig, config) {
  const files = listSourceFiles(rootDir, config)
  const fileSet = new Set(files)
  const graph = new Map(files.map((file) => [file, new Set()]))
  const fileMetrics = []

  for (const file of files) {
    const content = fs.readFileSync(path.join(rootDir, file), "utf8")
    const source = ts.createSourceFile(file, content, ts.ScriptTarget.Latest, true, scriptKindFor(file))
    const functions = []
    const visit = (node) => { if (isFunctionNode(node)) functions.push(analyzeFunction(node, source)); ts.forEachChild(node, visit) }
    visit(source)
    const localImports = importsFor(source).map((specifier) => resolveLocalImport(file, specifier, fileSet)).filter(Boolean)
    graph.set(file, new Set(localImports))
    fileMetrics.push({
      file,
      functions: functions.length,
      max_cyclomatic: Math.max(1, ...functions.map((fn) => fn.cyclomatic)),
      max_cognitive: Math.max(0, ...functions.map((fn) => fn.cognitive)),
      max_nesting: Math.max(0, ...functions.map((fn) => fn.max_nesting)),
      fan_out: localImports.length,
      criticality_multiplier: criticalityFor(file, config),
      function_metrics: functions.sort((a, b) => a.line - b.line || a.name.localeCompare(b.name)),
    })
  }

  const fanIn = new Map(files.map((file) => [file, 0]))
  for (const targets of graph.values()) for (const target of targets) fanIn.set(target, (fanIn.get(target) || 0) + 1)
  for (const metric of fileMetrics) metric.fan_in = fanIn.get(metric.file) || 0

  const components = tarjan(graph)
  const cycleComponents = components.filter((component) => component.length > 1 || (component.length === 1 && graph.get(component[0])?.has(component[0])))
  const cycleFiles = new Set(cycleComponents.flat())
  const depth = condensedDepth(graph, components)
  const duplication = duplicateStats(rootDir, files, config.thresholds.duplication_block_lines)
  const history = historyCounts(rootDir, files, config)
  const maxChanges = history.available ? Math.max(1, ...history.changes.values()) : 1
  const maxComplexity = Math.max(1, ...fileMetrics.map((m) => m.max_cyclomatic + m.max_cognitive))

  const hotspots = fileMetrics.map((metric) => {
    const normalizedComplexity = (metric.max_cyclomatic + metric.max_cognitive) / maxComplexity
    const changes = history.changes.get(metric.file) || 0
    const normalizedChangeFrequency = history.available ? changes / maxChanges : null
    const hotspotScore = history.available ? normalizedComplexity * normalizedChangeFrequency * metric.criticality_multiplier : null
    return { file: metric.file, complexity: round(normalizedComplexity, 4), changes, change_frequency: normalizedChangeFrequency === null ? null : round(normalizedChangeFrequency, 4), criticality_multiplier: metric.criticality_multiplier, hotspot_score: hotspotScore === null ? null : round(hotspotScore, 4) }
  }).sort((a, b) => (b.hotspot_score ?? -1) - (a.hotspot_score ?? -1) || a.file.localeCompare(b.file))

  const t = config.thresholds
  const testFiles = listSourceFiles(rootDir, { ...config, exclude_patterns: config.exclude_patterns.filter((p) => !p.includes("test") && !p.includes("spec")) }).filter((file) => /(?:\.test|\.spec)\.[cm]?[jt]sx?$/.test(file))
  const packages = uniqueSorted(files.map((file) => file.split("/").slice(0, 2).join("/")).filter((p) => p.includes("/")))
  const packagesWithTests = new Set(testFiles.map((file) => file.split("/").slice(0, 2).join("/")))
  const testability = packages.length ? (packages.filter((pkg) => packagesWithTests.has(pkg)).length / packages.length) * 100 : 100

  const inputs = {
    cyclomatic: known(thresholdScore(fileMetrics.map((m) => m.max_cyclomatic), t.cyclomatic_warn, t.cyclomatic_critical), "E1"),
    cognitive: known(thresholdScore(fileMetrics.map((m) => m.max_cognitive), t.cognitive_warn, t.cognitive_critical), "E1"),
    dependency_cycles: known(files.length ? 100 - (cycleFiles.size / files.length) * 100 : 100, "E1", cycleFiles.size ? ["DEPENDENCY_CYCLE"] : []),
    duplication: known(100 - duplication.ratio * 100, "E1", duplication.duplicate_blocks ? ["DUPLICATE_BLOCKS"] : []),
    fanout: known(thresholdScore(fileMetrics.map((m) => m.fan_out), t.fanout_warn, t.fanout_critical), "E1"),
    abstraction_depth: known(thresholdScore([depth], t.abstraction_depth_warn, t.abstraction_depth_critical), "E1"),
    testability: known(testability, "E1"),
    hotspot_history: history.available ? known(100 - Math.min(100, (hotspots[0]?.hotspot_score || 0) * 100), "E1") : unknown("INSUFFICIENT_GIT_HISTORY"),
  }

  const metric = computeWeightedProfile("ComplexityScore", config.profile, inputs, scoringConfig)
  return {
    metric,
    files: fileMetrics.sort((a, b) => a.file.localeCompare(b.file)),
    cycles: cycleComponents,
    hotspots,
    details: {
      source_files: files.length,
      dependency_cycle_components: cycleComponents.length,
      dependency_cycle_files: cycleFiles.size,
      duplicate_blocks: duplication.duplicate_blocks,
      duplication_file_ratio: round(duplication.ratio * 100, 2),
      abstraction_depth: depth,
      history_commits: history.commits,
      history_available: history.available,
      testability_package_coverage: round(testability, 2)
    }
  }
}
