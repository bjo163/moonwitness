import { Vertex, fields } from '@moon/orm'

export default class GeoCity extends Vertex {
  static override _name = 'geo.city'
  static override _description = 'Indonesian Regency / City (Kabupaten / Kota)'

  name = fields.Char({ required: true, size: 80, index: true })
  type = fields.Selection({
    selection: [
      ['kabupaten', 'Kabupaten'],
      ['kota', 'Kota']
    ],
    default: 'kabupaten'
  })
  kemendagriCode = fields.Char({ required: true, size: 15, unique: true, index: true })
  bpsCode = fields.Char({ size: 15, index: true })
  provinceId = fields.Many2one({ comodel: 'geo.province', required: true, index: true })
  lat = fields.Float()
  lng = fields.Float()
  active = fields.Boolean({ default: true, index: true })
  districtIds = fields.One2many({ comodel: 'geo.district', inverse: 'cityId' })
}
