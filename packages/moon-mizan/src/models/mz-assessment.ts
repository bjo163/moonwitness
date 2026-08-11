import { Vertex, fields } from '@moon/orm'

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
}
