import { Vertex, fields } from '@moon/orm'

export default class GeoVillage extends Vertex {
  static override _name = 'geo.village'
  static override _description = 'Indonesian Sub-district / Village (Kelurahan / Desa)'

  name = fields.Char({ required: true, size: 80, index: true })
  type = fields.Selection({
    selection: [
      ['kelurahan', 'Kelurahan'],
      ['desa', 'Desa']
    ],
    default: 'desa'
  })
  kemendagriCode = fields.Char({ required: true, size: 25, unique: true, index: true })
  bpsCode = fields.Char({ size: 25, index: true })
  districtId = fields.Many2one({ comodel: 'geo.district', required: true, index: true })
  postalCode = fields.Char({ size: 10, index: true })
  lat = fields.Float()
  lng = fields.Float()
  active = fields.Boolean({ default: true, index: true })
}
