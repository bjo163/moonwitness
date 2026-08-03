import { Vertex, fields } from '@moon/orm'

export default class PxSystem extends Vertex {
  static _name = 'px.system'
  static _description = 'System Resource Metrics'
  static _public = true

  memoryUsedMb = fields.Float()
  memoryTotalMb = fields.Float()
  cpuUsagePercent = fields.Float()
  eventLoopLagMs = fields.Float()
  
  activeConnections = fields.Integer()
  totalConnections = fields.Integer()
  
  dbPoolActive = fields.Integer()
  dbPoolIdle = fields.Integer()
  
  uptimeSeconds = fields.Integer()
  timestamp = fields.DateTime({ autoNowAdd: true, index: true })
}
