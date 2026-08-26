import { Vertex, fields } from '@moon/orm'

export default class MxMetric extends Vertex {
  static override _name = 'mx.metric'
  static override _description = 'System Metrics Tracker'

  name = fields.Char({ required: true, size: 120, index: true })
  value = fields.Float({ required: true })
  timestamp = fields.DateTime({ autoNowAdd: true, index: true })
}
