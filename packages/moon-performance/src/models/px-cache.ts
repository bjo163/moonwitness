import { Vertex, fields } from '@moon/orm'

export default class PxCache extends Vertex {
  static _name = 'px.cache'
  static _description = 'Cache Performance Statistics'
  static _public = true

  cacheKey = fields.Char({ required: true, index: true })
  hitCount = fields.Integer({ default: 0 })
  missCount = fields.Integer({ default: 0 })
  staleCount = fields.Integer({ default: 0 })
  
  avgLatencyMs = fields.Float()
  ttlSeconds = fields.Integer()
  cacheSize = fields.Integer()
  
  periodStart = fields.DateTime({ index: true })
  periodEnd = fields.DateTime({ index: true })
  lastAccess = fields.DateTime({ autoNow: true })
}
