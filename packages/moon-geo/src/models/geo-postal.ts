import { Vertex, fields } from '@moon/orm'

export default class GeoPostal extends Vertex {
  static override _name = 'geo.postal'
  static override _description = 'Postal Code'

  postalCode = fields.Char({ required: true, size: 10, index: true })
  villageId = fields.Many2one({ comodel: 'geo.village', index: true })
  districtId = fields.Many2one({ comodel: 'geo.district', index: true })
  cityId = fields.Many2one({ comodel: 'geo.city', index: true })
  provinceId = fields.Many2one({ comodel: 'geo.province', index: true })
}
