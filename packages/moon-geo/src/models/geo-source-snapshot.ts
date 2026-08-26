import { Vertex, fields } from '@moon/orm'

export default class GeoSourceSnapshot extends Vertex {
  static override _name = 'geo.source.snapshot'
  static override _description = 'Official Source Snapshot'

  sourceName = fields.Char({ required: true, size: 80, index: true })
  revision = fields.Char({ required: true, size: 40, index: true })
  checksum = fields.Char({ required: true, size: 64, index: true })
  status = fields.Selection({
    selection: [
      ['fetched', 'Fetched'],
      ['normalized', 'Normalized'],
      ['diffed', 'Diffed'],
      ['applied', 'Applied'],
      ['failed', 'Failed']
    ],
    default: 'fetched'
  })
  rawPath = fields.Char({ size: 255 })
  recordCount = fields.Integer({ default: 0 })
}
