import { Vertex, fields } from '@moon/orm'

export default class PxRequest extends Vertex {
  static _name = 'px.request'
  static _description = 'HTTP Request Performance Metrics'
  static _public = true

  method = fields.Selection({
    required: true,
    selection: [
      ['GET', 'GET'],
      ['POST', 'POST'],
      ['PUT', 'PUT'],
      ['DELETE', 'DELETE'],
      ['PATCH', 'PATCH'],
      ['OPTIONS', 'OPTIONS']
    ],
    index: true
  })
  
  path = fields.Char({ required: true, index: true })
  latencyMs = fields.Float({ required: true })
  statusCode = fields.Integer({ required: true, index: true })
  
  cacheStatus = fields.Selection({
    selection: [
      ['HIT', 'Cache Hit'],
      ['MISS', 'Cache Miss'],
      ['STALE', 'Stale Cache'],
      ['BYPASS', 'Cache Bypass'],
      ['N/A', 'Not Applicable']
    ],
    default: 'N/A',
    index: true
  })
  
  userAgent = fields.Text()
  ipAddress = fields.Char()
  requestSize = fields.Integer()
  responseSize = fields.Integer()
  errorMessage = fields.Text()
  
  timestamp = fields.DateTime({ autoNowAdd: true, index: true })
}
