import { Vertex, fields } from '@moon/orm'

export default class GeoHistory extends Vertex {
  static override _name = 'geo.history'
  static override _description = 'Administrative Boundary Change History'

  resModel = fields.Char({ required: true, size: 80, index: true })
  resId = fields.Integer({ required: true, index: true })
  changeType = fields.Selection({
    selection: [
      ['created', 'Created'],
      ['split', 'Split / Pemekaran'],
      ['merged', 'Merged / Penggabungan'],
      ['renamed', 'Renamed'],
      ['reclassified', 'Reclassified']
    ],
    default: 'created'
  })
  previousCode = fields.Char({ size: 30 })
  effectiveDate = fields.Date()
  legalBasis = fields.Char({ size: 255 })
  notes = fields.Text()
}
