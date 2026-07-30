import { Vertex, fields } from '@moon/orm'

export default class MxMetric extends Vertex {
  static override _name = 'mx.metric'
  static override _description = 'System Metrics Tracker'
  static override _public = true

  name = fields.Char({ required: true, index: true })
  value = fields.Float({ required: true })
  timestamp = fields.DateTime({ autoNowAdd: true, index: true })
}
