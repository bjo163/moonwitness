import { Vertex, fields } from '@moon/orm'

export default class PxQuery extends Vertex {
  static _name = 'px.query'
  static _description = 'Database Query Performance Metrics'
  static _public = true

  model = fields.Char({ required: true, index: true })
  operation = fields.Selection({
    required: true,
    selection: [
      ['SELECT', 'Select/Read'],
      ['INSERT', 'Insert/Create'],
      ['UPDATE', 'Update/Write'],
      ['DELETE', 'Delete'],
      ['SEARCH', 'Search (ORM)'],
      ['BROWSE', 'Browse (ORM)'],
      ['RPC', 'RPC Call']
    ],
    index: true
  })
  
  executionMs = fields.Float({ required: true, index: true })
  isSlow = fields.Boolean({ default: false, index: true })
  queryHash = fields.Char({ index: true })
  recordCount = fields.Integer()
  
  userId = fields.Many2one({ comodel: 'vx.user' })
  stackTrace = fields.Text()
  
  hadError = fields.Boolean({ default: false, index: true })
  errorMessage = fields.Text()
  
  timestamp = fields.DateTime({ autoNowAdd: true, index: true })
}
