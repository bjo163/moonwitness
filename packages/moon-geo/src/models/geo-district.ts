import { Vertex, fields } from '@moon/orm'

export default class GeoDistrict extends Vertex {
  static override _name = 'geo.district'
  static override _description = 'Indonesian District (Kecamatan)'

  name = fields.Char({ required: true, size: 80, index: true })
  kemendagriCode = fields.Char({ required: true, size: 20, unique: true, index: true })
  bpsCode = fields.Char({ size: 20, index: true })
  cityId = fields.Many2one({ comodel: 'geo.city', required: true, index: true })
  lat = fields.Float()
  lng = fields.Float()
  active = fields.Boolean({ default: true, index: true })
  villageIds = fields.One2many({ comodel: 'geo.village', inverse: 'districtId' })
}
