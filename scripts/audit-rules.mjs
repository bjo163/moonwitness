#!/usr/bin/env node

/** MoonWitness constitutional auditor: scan source, themes, visualizations, tests, docs, and tooling. */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const SKIP_DIRS = new Set(["node_modules", ".next", "dist", ".git", ".turbo", "coverage", "build"])
const TEXT_EXTS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".css", ".scss", ".less", ".md", ".mdx", ".json", ".yaml", ".yml", ".toml", ".ps1", ".sh", ".txt"])
const CATEGORIES = ["forbiddenTerminology", "filenameExports", "hardcodedColors", "hardcodedLocalhost", "shadows", "decorativeEffects", "themeParity", "contrast", "suspiciousPrimary", "domainExceptions", "unsupportedColorFormats", "maxLines", "ghostPaths", "legacyImports", "useClientPlacement", "inlineMocks", "pureComputeIsolation", "packageHierarchy", "packageContract", "secretLeaks", "unsafeLinks", "rawHtml", "rawSql", "directLocalStorage", "consoleLogs", "missingImageAlt"]
const findings = Object.fromEntries(CATEGORIES.map((name) => [name, []]))
const inventory = { files: 0, text: 0, skipped: 0, classes: {}, packages: 0 }
const CANONICAL = { cyan: "#00F0FF", green: "#00FF66", yellow: "#FFE600", purple: "#A100FF", pink: "#FF0055", dark: "#05070A", panel: "#0A0F17" }
const FORBIDDEN_WORDS = ["website", "web site", "page", "pages", "user", "users", "settings", "loading", "error", "success", "search", "logout", "click here"]
const COLOR_RE = /#[0-9a-f]{3,8}\b|rgba?\s*\([^)]*\)|hsla?\s*\([^)]*\)/gi
const UNSUPPORTED_COLOR_RE = /\b(?:oklch|oklab|hwb|lab|lch|color|color-mix|device-cmyk)\s*\(/gi
const DOMAIN_RULES = [
  { id: "seismix-canvas-and-series", test: (p) => /^apps\/web\/views\/seismix\//.test(p), reason: "Canvas, waveform, plate, and severity palettes encode domain data." },
  { id: "celestial-and-graph-visuals", test: (p) => /(^|\/)packages\/ui\/src\/(widgets\/(graph|monitoring)|.*(radar|celestial|eclipse|compass|sphere))\//.test(p), reason: "SVG/canvas/chart colors and motion encode a domain visualization." },
]

const rel = (file) => path.relative(ROOT, file).replaceAll(path.sep, "/")
const add = (category, detail) => findings[category].push(detail)
const classesFor = (p) => {
  const classes = new Set(); const lower = p.toLowerCase(); const ext = path.extname(p).toLowerCase()
  if (/^apps\/|^packages\//.test(lower) && TEXT_EXTS.has(ext)) classes.add("application-source")
  if (/\/(tests?|e2e)\/|\.(test|spec)\./.test(lower)) classes.add("tests")
  if (ext === ".md" || ext === ".mdx" || lower.startsWith("docs/") || lower.startsWith(".agents/") || lower === "agents.md") classes.add("docs")
  if (/^scripts\/|\/scripts\/|^\.github\/|(^|\/)(.*config|package\.json|pnpm-lock\.yaml|turbo\.json|vercel\.json|dockerfile|\.env)/.test(lower) || /\.(mjs|cjs|ps1|sh)$/.test(lower)) classes.add("tooling")
  if (/globals?\.(css|scss|less)$|theme|token|tailwind|postcss|design-token/.test(lower)) classes.add("theme")
  if (/(visual|chart|graph|map|radar|sphere|compass|eclipse|seismic|seismix|waveform|celestial|observatory|monitoring)/.test(lower)) classes.add("domain-visualization")
  return [...classes]
}
const domainRule = (p) => DOMAIN_RULES.find((rule) => rule.test(p))
const policyDoc = (p) => p === "AGENTS.md" || p === ".agents/AGENTS.md" || p.startsWith(".agents/rules/")
const isTokenSource = (p) => /packages\/ui\/src\/(tokens\/|styles\/globals\.css$)/.test(p)
const isCanonicalTokenLine = (p, line) => isTokenSource(p) && (/--(?:cyber|color-cyber)-|CyberColors|THEME_TOKENS|@theme|:root|^\.dark/.test(line) || /@utility (corner|glow|laser|panel|bg-)/.test(line))
const visualizationContext = (line) => /strokeStyle|fillStyle|stroke=|fill=|\b(series|palette|wave|severity|magnitude|plate|boundary|threshold|color|glow)\s*[:=]/i.test(line) && !/className=|style=/.test(line)
const codeStrings = (line) => [...line.matchAll(/(["'`])((?:\\.|(?!\1)[^\\])*)\1/g)].map((m) => m[2])

function walk(dir) {
  if (!fs.existsSync(dir)) return
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name); const pathname = rel(file)
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) { inventory.skipped++; continue }
      if (["@core", "@modules", "hud"].includes(entry.name)) add("ghostPaths", { path: pathname, type: "directory" })
      walk(file); continue
    }
    inventory.files++
    if (/^hud(?:[-_.]|$)/i.test(entry.name)) add("filenameExports", { file: pathname, kind: "filename", token: entry.name })
    if (!TEXT_EXTS.has(path.extname(entry.name).toLowerCase()) && !/^\.env(?:\.|$)/.test(entry.name)) continue
    let content
    try { content = fs.readFileSync(file, "utf8") } catch { continue }
    if (content.includes("\0")) continue
    inventory.text++; const classes = classesFor(pathname); classes.forEach((name) => { inventory.classes[name] = (inventory.classes[name] || 0) + 1 })
    auditFile(pathname, content, classes)
  }
}

function auditFile(file, content, classes) {
  const lines = content.split(/\r?\n/); const isTest = classes.includes("tests"); const isDocs = classes.includes("docs"); const domain = domainRule(file)
  if (lines.length > 400) add("maxLines", { file, lineCount: lines.length, classes })
  if (classes.includes("application-source") && !classes.includes("docs") && /['"]use client['"]/.test(content) && !/^['"]use client['"]$/.test(lines[0]?.trim())) add("useClientPlacement", { file, line: 1, content: lines[0]?.trim() || "" })
  for (const tag of content.match(/<a\s+[^>]*target=["']_blank["'][^>]*>/gis) || []) if (!classes.includes("docs") && (!/noopener/i.test(tag) || !/noreferrer/i.test(tag))) add("unsafeLinks", { file, snippet: tag.replace(/\s+/g, " ").slice(0, 100) })
  if (content.includes("dangerouslySetInnerHTML") && !/DOMPurify|sanitize/i.test(content)) add("rawHtml", { file })
  for (const match of content.matchAll(/\bexport\s+(?:default\s+)?(?:const|let|var|function|class|interface|type|enum)\s+([A-Za-z_$][\w$]*)/g)) if (/^HUD|HUD|useHUD/i.test(match[1])) add("filenameExports", { file, kind: "export", token: match[1] })
  for (let index = 0; index < lines.length; index++) {
    const line = lines[index]; const trimmed = line.trim(); const code = trimmed.replace(/^\/\/.*$/, "")
    if (!code || /^\/\*|^\*/.test(code)) continue
    const base = { file, line: index + 1, classes }
    const userFacing = />([^<{]*?)<|\b(?:title|label|placeholder|description|message|aria-label|heading|subtitle|buttonText|copy)\s*[:=]/i.test(code)
    if (!isDocs && !policyDoc(file) && userFacing) for (const value of codeStrings(code).concat([...code.matchAll(/>([^<{]*?)</g)].map((m) => m[1]))) { const term = FORBIDDEN_WORDS.find((word) => new RegExp(`\\b${word.replace(" ", "\\s+")}\\b`, "i").test(value)); if (term) { add("forbiddenTerminology", { ...base, term, snippet: trimmed.slice(0, 120) }); break } }
    const unsupported = code.match(UNSUPPORTED_COLOR_RE); if (unsupported && !isDocs) add("unsupportedColorFormats", { ...base, format: unsupported[0] })
    for (const match of code.matchAll(COLOR_RE)) {
      const literal = match[0]; const exception = domain && visualizationContext(code)
      if (exception) { add("domainExceptions", { ...base, rule: domain.id, kind: "color", value: literal, reason: domain.reason }); continue }
      if (isDocs || isCanonicalTokenLine(file, code)) continue
      if (isTest && /^#(?:00F0FF|00FF66|FFE600|A100FF|FF0055|05070A|0A0F17)$/i.test(literal)) continue
      add("hardcodedColors", { ...base, value: literal })
    }
    if (/(?:box-shadow|text-shadow|drop-shadow|shadow-\[)/i.test(code)) {
      if (domain && visualizationContext(code)) add("domainExceptions", { ...base, rule: domain.id, kind: "shadow", reason: domain.reason })
      else if (!isTokenSource(file) && !isDocs) add("shadows", { ...base, snippet: trimmed.slice(0, 120) })
    }
    const effect = code.match(/(?:backdrop-blur|\bblur[-(]|bg-(?:gradient|radial)|(?:linear|radial)-gradient|@keyframes|animation\s*:|animate-(?:pulse|ping|spin|bounce|\[))/i)
    const decorative = effect && /absolute|fixed|inset-|pointer-events-none|opacity-|bg-gradient|background(?:-image)?|::before|::after/i.test(code)
    if (decorative) {
      if (domain) add("domainExceptions", { ...base, rule: domain.id, kind: "decorative-effect", value: effect[0], reason: domain.reason })
      else if (!isTokenSource(file) && !/panel-glass|bg-(?:cosmic|dense)-grid|laser-conduit|@keyframes (?:heroShake|textGlow|holoScan|starTwinkle|cosmicDrift|breathingCyan|radarPulse)/.test(code)) add("decorativeEffects", { ...base, effect: effect[0] })
    }
    if (/(?:bg|text|border|stroke|fill)-primary|var\(--primary\)|--primary\s*:/.test(code) && /(?:bg-primary|background|absolute|fixed|inset-|min-h-screen|w-full|h-full)/.test(code)) add("suspiciousPrimary", { ...base, snippet: trimmed.slice(0, 120) })
    const pairs = colorPair(code); if (!isDocs && classes.includes("application-source") && pairs && contrastRatio(pairs[0], pairs[1]) < 4.5) add("contrast", { ...base, foreground: pairs[0], background: pairs[1], ratio: Number(contrastRatio(pairs[0], pairs[1]).toFixed(2)) })
    if (/\blocalStorage\.(?:getItem|setItem)\(/.test(code) && !isTest) add("directLocalStorage", base)
    if (/\bconsole\.(?:log|debug)\(/.test(code) && !isTest && !isDocs && !classes.includes("tooling")) add("consoleLogs", base)
    if (/<img\s+[^>]*>/i.test(code) && !/\balt=/.test(code)) add("missingImageAlt", base)
    if (/const\s+(?:MOCK_|mock|DUMMY_|dummy)\w*\s*=\s*\[/.test(code) && /views?/.test(file)) add("inlineMocks", base)
    if (/\b(?:sk-[A-Za-z0-9]{20,}|sk-ant-[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]{20,}|ey[A-Za-z0-9_-]{25,}\.[A-Za-z0-9_-]{25,})\b/.test(code) && !isDocs && !isTest) add("secretLeaks", base)
    if (/https?:\/\/(?:localhost|127\.0\.0\.1):\d+/.test(code) && !isTest && !isDocs && !/api-client\.ts$/.test(file)) add("hardcodedLocalhost", base)
    if (/from\s+["'](?:@core\/|@modules\/)/.test(code)) add("legacyImports", base)
    if (/moon-compute/.test(file) && /from\s+["'](?:fs|http|https|pg|mysql|sqlite|node-fetch)["']/.test(code)) add("pureComputeIsolation", base)
    if (/(?:moon-compute|moon-protocol|packages\/types)/.test(file) && /from\s+["'](?:@workspace\/(?:ui|hooks|state)|@moon\/server|@views|@app)["']/.test(code)) add("packageHierarchy", base)
    if (/(?:moon-orm|moon-server|apps\/api)/.test(file) && /\b(?:query|raw|execute)\s*\(\s*[`"']\s*(?:SELECT|INSERT|UPDATE|DELETE)\b.*(?:\$\{|['"]\s*\+)/i.test(code) && !isTest) add("rawSql", base)
  }
}

function hex(value) {
  const named = { white: "#FFFFFF", black: "#000000", "gray-500": "#6B7280", "gray-400": "#9CA3AF", "gray-600": "#4B5563", "red-500": "#EF4444", "blue-500": "#3B82F6", "cyan-400": "#22D3EE", "amber-400": "#FBBF24", "cyber-cyan": CANONICAL.cyan, "cyber-dark": CANONICAL.dark, "cyber-panel": CANONICAL.panel }
  if (named[value]) value = named[value]
  if (!/^#[0-9a-f]{6}$/i.test(value)) return null
  return [parseInt(value.slice(1, 3), 16), parseInt(value.slice(3, 5), 16), parseInt(value.slice(5, 7), 16)].map((v) => { const n = v / 255; return n <= 0.03928 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4 })
}
function colorPair(line) {
  const foreground = line.match(/(?:text|color)[:-](?:\[)?([a-z]+(?:-[a-z]+)?(?:-\d+)?|white|black)(?:\])?/i)?.[1] || line.match(/\bcolor\s*:\s*(#[0-9a-f]{6})/i)?.[1]
  const background = line.match(/(?:bg|background(?:Color)?)[ :-](?:\[)?([a-z]+(?:-[a-z]+)?(?:-\d+)?|white|black)(?:\])?/i)?.[1] || line.match(/\bbackground(?:-color)?\s*:\s*(#[0-9a-f]{6})/i)?.[1]
  return foreground && background ? [hex(foreground), hex(background)] : null
}
function contrastRatio(a, b) { if (!a || !b) return 21; const l1 = 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2]; const l2 = 0.2126 * b[0] + 0.7152 * b[1] + 0.0722 * b[2]; return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05) }

function auditPackages() {
  const dir = path.join(ROOT, "packages"); if (!fs.existsSync(dir)) return
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory() || SKIP_DIRS.has(entry.name)) continue; inventory.packages++
    const base = path.join(dir, entry.name); const pkgFile = path.join(base, "package.json"); const issue = (text) => add("packageContract", { package: entry.name, issue: text })
    if (!fs.existsSync(pkgFile)) { issue("Missing package.json"); continue }
    let pkg; try { pkg = JSON.parse(fs.readFileSync(pkgFile, "utf8")) } catch { issue("Invalid package.json"); continue }
    if (!/^@(workspace|moon)\//.test(pkg.name || "")) issue(`Non-canonical namespace: ${pkg.name || "missing"}`)
    if (!/^\d+\.\d+\.\d+/.test(pkg.version || "")) issue(`Invalid SemVer version: ${pkg.version || "missing"}`)
    if (!pkg.exports && !["eslint-config", "typescript-config"].includes(entry.name)) issue("Missing explicit exports map")
    if (!fs.existsSync(path.join(base, "src", "index.ts")) && !fs.existsSync(path.join(base, "src", "index.tsx")) && !fs.existsSync(path.join(base, "src", "index.js")) && !fs.existsSync(path.join(base, "index.ts")) && !["eslint-config", "typescript-config"].includes(entry.name)) issue("Missing public entrypoint")
    if (!fs.existsSync(path.join(base, "tsconfig.json")) && !["eslint-config", "typescript-config"].includes(entry.name)) issue("Missing tsconfig.json")
    const readme = path.join(base, "README.md"); if (!fs.existsSync(readme)) issue("Missing architectural README.md"); else { const text = fs.readFileSync(readme, "utf8"); if (!text.includes("# ◈")) issue("README missing '# ◈' title"); if (!/VERSION|Version|SYS-VER/i.test(text)) issue("README missing version declaration"); if (!/Usage|Quickstart|Running Locally|Installation|Overview/i.test(text)) issue("README missing usage guide"); if (!/Verification|Test|Build|Typecheck/i.test(text) && !["eslint-config", "typescript-config"].includes(entry.name)) issue("README missing verification instructions") }
    const source = path.join(base, "src", "index.ts"); if (fs.existsSync(source)) { const text = fs.readFileSync(source, "utf8"); if (/models\s*:\s*\[/.test(text)) { if (!fs.existsSync(path.join(base, "src", "demo-data.ts")) && !fs.existsSync(path.join(base, "src", "demo-data.js"))) issue("Model addon missing src/demo-data.ts"); if (!text.includes("loadDemoData")) issue("Model addon missing loadDemoData export"); if (!fs.existsSync(path.join(base, "src", "views.ts")) && !fs.existsSync(path.join(base, "src", "views.js"))) issue("Model addon missing src/views.ts"); if (!/views/.test(text)) issue("Model addon missing views export") } } }
}

function auditThemeParity() {
  const cssFile = "packages/ui/src/styles/globals.css"; const tokenFile = "packages/ui/src/tokens/theme-tokens.ts"; const css = path.join(ROOT, cssFile); const token = path.join(ROOT, tokenFile)
  const cssText = fs.existsSync(css) ? fs.readFileSync(css, "utf8") : ""; const tokenText = fs.existsSync(token) ? fs.readFileSync(token, "utf8") : ""
  for (const [name, value] of Object.entries(CANONICAL)) { const tokenName = `cyber-${name}`; if (!new RegExp(`--${tokenName}\\s*:`).test(cssText)) add("themeParity", { file: cssFile, issue: `Missing --${tokenName}` }); if (!tokenText.toUpperCase().includes(value.toUpperCase())) add("themeParity", { file: tokenFile, issue: `Missing canonical ${tokenName} value` }) }
  for (const portal of ["apps/web/app/layout.tsx", "apps/command-center/app/layout.tsx"]) { const file = path.join(ROOT, portal); const text = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : ""; if (!text.includes("@workspace/ui/globals.css")) add("themeParity", { file: portal, issue: "Portal does not import shared globals.css" }); if (!/\bdark\b/.test(text)) add("themeParity", { file: portal, issue: "Portal does not opt into the shared dark theme" }) }
}

function printCategory(name, label, critical = false) {
  const items = findings[name]; const mark = items.length ? (critical ? "❌" : "⚠️") : "✓"; console.log(`${mark} ${label}: ${items.length}`)
  for (const item of items.slice(0, 12)) console.log(`   • ${JSON.stringify(item)}`)
  if (items.length > 12) console.log(`   • … ${items.length - 12} more (counted, not suppressed)`)
}

console.log("◈ MOONWITNESS OS — CONSTITUTIONAL AUDITOR V9.5")
console.log("Inventorying application source, theme, domain visualization, tests, docs, and tooling...\n")
auditPackages(); auditThemeParity(); walk(ROOT)
console.log(`Scanned ${inventory.files} files (${inventory.text} text files) across ${inventory.packages} packages; generated directories excluded: ${inventory.skipped}.`)
console.log(`Classified files: ${Object.entries(inventory.classes).map(([key, value]) => `${key}=${value}`).join(", ")}\n`)
console.log("REQUESTED AUDIT CATEGORIES")
printCategory("forbiddenTerminology", "Forbidden terminology")
printCategory("filenameExports", "Forbidden filenames / exports", true)
printCategory("hardcodedColors", "Hardcoded colors", true)
printCategory("hardcodedLocalhost", "Hardcoded localhost URLs", true)
printCategory("shadows", "Shadows / glows")
printCategory("decorativeEffects", "Decorative blur / gradients / animation")
printCategory("themeParity", "Theme parity", true)
printCategory("contrast", "Contrast")
printCategory("suspiciousPrimary", "Suspicious primary use")
printCategory("domainExceptions", "Domain visualization exceptions")
printCategory("unsupportedColorFormats", "Unsupported color formats", true)
console.log("\nCONSTITUTIONAL / SECURITY AUDITS")
for (const [name, label, critical] of [["maxLines", "Files over 400 lines"], ["ghostPaths", "Ghost paths", true], ["legacyImports", "Legacy imports", true], ["useClientPlacement", "use client placement", true], ["inlineMocks", "Inline mocks"], ["pureComputeIsolation", "Pure compute isolation", true], ["packageHierarchy", "Package hierarchy", true], ["packageContract", "Package genesis contract", true], ["secretLeaks", "Secret leaks", true], ["unsafeLinks", "Unsafe links", true], ["rawHtml", "Unsanitized HTML"], ["rawSql", "Raw SQL concatenation", true], ["directLocalStorage", "Direct localStorage"], ["consoleLogs", "Console logging"], ["missingImageAlt", "Missing image alt"]]) printCategory(name, label, critical)
const critical = ["filenameExports", "hardcodedColors", "hardcodedLocalhost", "themeParity", "unsupportedColorFormats", "ghostPaths", "legacyImports", "useClientPlacement", "pureComputeIsolation", "packageHierarchy", "packageContract", "secretLeaks", "unsafeLinks", "rawSql"].reduce((total, name) => total + findings[name].length, 0)
console.log(`\n${critical ? `⚠️ ${critical} critical finding(s) require review.` : "🎉 SUPREME ARCHITECTURAL HARMONY: 0 critical findings."}`)
process.exitCode = critical ? 1 : 0
