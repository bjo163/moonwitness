// Read-only behavioral probes. Run from the MoonWitness repository root.
// Optional arguments: path to Cosmic, path to the original Mizan agent.
import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import { pathToFileURL } from 'node:url'
import assert from 'node:assert/strict'

const root = process.cwd()
const cosmicRoot = path.resolve(process.argv[2] ?? '../cosmic')
const agentRoot = path.resolve(process.argv[3] ?? '../mizan')
const moon = await import(pathToFileURL(path.join(root, 'packages/moon-mizan/src/engine.ts')))
const cosmic = await import(pathToFileURL(path.join(cosmicRoot, 'packages/mizan-engine/src/index.ts')))
const agentSource = fs.readFileSync(path.join(agentRoot, 'app.js'), 'utf8')
const validatorSource = agentSource.slice(agentSource.indexOf('function validateResult('), agentSource.indexOf('function extractFirstJsonObject('))
assert.ok(validatorSource.startsWith('function validateResult('))
// Isolate the pure validator; never import the CLI, initialize credentials, or call AI.
const validateAgent = vm.runInNewContext(`(${validatorSource.trim()})`)
const base = {
  primaryFilterPassed: true, secondaryFilterPassed: true,
  powerRightScore: 8, powerLeftScore: 6, generalSufficient: false,
  balanceSatisfied: true, internalReferenceVerified: true,
  propheticReferenceRelevant: true, propheticReferenceWeight: 0, rating: 4,
}
const findings = []
function record(id, observed) { findings.push({ id, observed }) }

const chosen = moon.chooseMethod(base).method
const validated = moon.validateAssessment(base).method
assert.notEqual(chosen, validated)
record('method-preview-versus-final', { chosen, validated })
const fractional = moon.validateAssessment({ ...base, powerRightScore: 8.5 })
assert.equal(fractional.generalWeight, 14.5)
record('fractional-score-accepted-by-pure-ts-validator', fractional.generalWeight)

const looseAgent = {
  method: 'GENERAL_LIMITED',
  primary_filter: { rules: Array(4).fill({ status: 'FAIL' }) },
  secondary_filter: { rules: Array(4).fill({ status: 'FAIL' }) },
  power_right: { score: -100, criteria: Array(10).fill('duplicate') },
  power_left: { score: -100, criteria: Array(7).fill('duplicate') },
  general_weight: -200, prophetic: { reference_weight: -4 },
  total_weight: -999, total_max: 999, rating: -1,
}
const agentErrors = validateAgent(looseAgent)
assert.equal(agentErrors.length, 0)
record('agent-validator-accepts-invalid-limited-output', { errors: [...agentErrors], total: looseAgent.total_weight })

const semantic = { R: -0.8, G: 0.1, B: 0.6, L: 0 }
const zeroGates = cosmic.evaluateMizan({ semantic, actionGateVector: Array(9).fill(0) })
const oneGates = cosmic.evaluateMizan({ semantic, actionGateVector: Array(9).fill(1) })
assert.deepEqual(zeroGates.assessment, oneGates.assessment)
assert.equal(zeroGates.score, oneGates.score)
record('action-gates-do-not-change-current-mizan-score', { zeroGates: zeroGates.score, oneGates: oneGates.score })

const missing = cosmic.evaluateMizan()
assert.equal(missing.scale.scope, 0.5)
assert.equal(missing.assessment.confidence, 0.25)
record('missing-input-defaults', { scope: missing.scale.scope, confidence: missing.assessment.confidence, risk: missing.assessment.risk })
record('different-band-thresholds', { helper: cosmic.severityBand(35), result: cosmic.evaluateMizan({ semantic: { R: -0.63636, G: 0, B: 0, L: 0 } }).band })

const established = cosmic.evaluateQuranicMizan({
  observed: { intent: 'TEST', status: 'INFERRED', confidence: 0.9,
    quranGrounding: { coverage: 'DIRECT', direct: [] }, evidence: [{ status: 'VERIFIED' }] },
})
assert.equal(established.status, 'ESTABLISHED')
assert.equal(established.quranGrounding.refs.length, 0)
record('quranic-status-trusts-input-flags-without-reference-resolution', { status: established.status, refs: established.quranGrounding.refs })
const reserved = cosmic.evaluateQuranicMizan({ text: 'Kajian penggunaan kata surga dalam sebuah teks.' })
assert.equal(reserved.status, 'RESERVED')
record('reserved-detection-is-keyword-wide', reserved.status)

console.log(JSON.stringify({ scope: 'Pure function probes; no database, AI or network calls; Node 26 TypeScript stripping', findings }, null, 2))
