import { Vertex, fields } from '@moon/orm'

export default class GeoCandidate extends Vertex {
  static override _name = 'geo.candidate'
  static override _description = 'Reconciliation Candidate'

  snapshotId = fields.Many2one({ comodel: 'geo.source.snapshot', required: true, index: true })
  model = fields.Char({ required: true, size: 80, index: true })
  action = fields.Selection({
    selection: [
      ['create', 'Create'],
      ['update', 'Update'],
      ['split', 'Split'],
      ['merge', 'Merge'],
      ['deprecate', 'Deprecate']
    ],
    default: 'create'
  })
  policy = fields.Selection({
    selection: [
      ['AUTO_SAFE', 'Auto Safe (Safe to apply automatically)'],
      ['REVIEW_REQUIRED', 'Review Required (Requires human operator review)'],
      ['BLOCKED', 'Blocked (Violates safety invariant or circuit breaker)']
    ],
    default: 'REVIEW_REQUIRED',
    index: true
  })
  reason = fields.Text()
  rawPayload = fields.Text()
  applied = fields.Boolean({ default: false, index: true })
}
