import { Vertex, fields } from '@moon/orm'
import { validateAssessment, type AssessmentInput } from '../engine.js'

export default class MzAssessment extends Vertex {
  static _name = 'mz.assessment'
  static _description = 'Mizan Assessment Result'

  caseId = fields.Many2one({ comodel: 'mz.case', required: true, index: true })
  method = fields.Selection({
    selection: [
      ['general', 'General'],
      ['general_limited', 'General Limited'],
      ['prophetic', 'Prophetic / Divine']
    ],
    default: 'general',
    index: true
  })
  generalSufficient = fields.Boolean({ default: false })
  balanceSatisfied = fields.Boolean({ default: false })
  internalReferenceVerified = fields.Boolean({ default: false })
  primaryFilterPassed = fields.Boolean({ default: false, index: true })
  secondaryFilterPassed = fields.Boolean({ default: false, index: true })
  powerRightScore = fields.Integer({ default: 0, min: 0, max: 10 })
  powerLeftScore = fields.Integer({ default: 0, min: 0, max: 7 })
  propheticReferenceWeight = fields.Integer({ default: 0, min: 0, max: 4 })
  generalWeight = fields.Integer({ default: 0, min: 0, max: 17, index: true })
  totalWeight = fields.Integer({ default: 0, min: 0, max: 21, index: true })
  rating = fields.Float({ default: 0, min: 0, max: 4.5 })
  isFinalized = fields.Boolean({ default: false, index: true })
  rightResult = fields.Text()
  leftResult = fields.Text()
  action = fields.Text()
  limitation = fields.Text()
  confidence = fields.Selection({
    selection: [
      ['low', 'Low'],
      ['moderate', 'Moderate'],
      ['high', 'High']
    ],
    default: 'low'
  })
  completedAt = fields.DateTime({ index: true })

  static async beforeSave(
    modelClass: typeof MzAssessment,
    env: any,
    vals: Record<string, unknown>,
    id?: number
  ) {
    const existing = id
      ? await modelClass.query(env).where('id', id).first() as Record<string, unknown> | null
      : null
    const assessment = { ...existing, ...vals }

    if (!assessment.isFinalized) return

    if (!id) {
      throw new Error('Finalize an existing assessment only after its filters and references are recorded.')
    }

    const MzFilter = env.getModel?.('mz.filter')
    const MzReference = env.getModel?.('mz.reference')
    if (!MzFilter || !MzReference) {
      throw new Error('Mizan filter or reference model is unavailable.')
    }

    const [primaryFilters, secondaryFilters, references] = await Promise.all([
      MzFilter.query(env).where('assessmentId', id).where('stage', 'primary').fetch(),
      MzFilter.query(env).where('assessmentId', id).where('stage', 'secondary').fetch(),
      MzReference.query(env).where('assessmentId', id).fetch()
    ])
    const filtersPass = (filters: Iterable<any>) => {
      const entries = Array.from(filters)
      return entries.length === 4 &&
        new Set(entries.map((filter) => filter.position)).size === 4 &&
        entries.every((filter) => filter.answer === 'yes')
    }
    const primaryFilterPassed = filtersPass(primaryFilters)
    const secondaryFilterPassed = filtersPass(secondaryFilters)
    const verifiedRelevantReference = Array.from(references).some(
      (reference: any) => reference.isVerified === true && reference.isRelevant === true
    )

    const decision = validateAssessment({
      primaryFilterPassed,
      secondaryFilterPassed,
      powerRightScore: Number(assessment.powerRightScore ?? 0),
      powerLeftScore: Number(assessment.powerLeftScore ?? 0),
      generalSufficient: Boolean(assessment.generalSufficient),
      balanceSatisfied: Boolean(assessment.balanceSatisfied),
      internalReferenceVerified: verifiedRelevantReference,
      propheticReferenceRelevant: verifiedRelevantReference,
      propheticReferenceWeight: Number(assessment.propheticReferenceWeight ?? 0),
      rating: Number(assessment.rating ?? 0)
    } satisfies AssessmentInput)

    vals.primaryFilterPassed = primaryFilterPassed
    vals.secondaryFilterPassed = secondaryFilterPassed
    vals.internalReferenceVerified = verifiedRelevantReference
    vals.method = decision.method
    vals.generalWeight = decision.generalWeight
    vals.totalWeight = decision.totalWeight
    vals.propheticReferenceWeight = decision.propheticReferenceWeight
    vals.limitation = decision.limitation
    if (!assessment.completedAt) vals.completedAt = new Date().toISOString()
  }
}
