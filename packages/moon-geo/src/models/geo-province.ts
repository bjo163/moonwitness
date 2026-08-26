import { Vertex, fields } from '@moon/orm'

export default class GeoProvince extends Vertex {
  static override _name = 'geo.province'
  static override _description = 'Indonesian Province'

  name = fields.Char({ required: true, size: 80, index: true })
  kemendagriCode = fields.Char({ required: true, size: 10, unique: true, index: true })
  bpsCode = fields.Char({ size: 10, index: true })
  isoCode = fields.Char({ size: 10, index: true })
  islandGroup = fields.Selection({
    selection: [
      ['sumatera', 'Sumatera'],
      ['jawa', 'Jawa'],
      ['kalimantan', 'Kalimantan'],
      ['sulawesi', 'Sulawesi'],
      ['bali_nusa_tenggara', 'Bali & Nusa Tenggara'],
      ['maluku', 'Maluku'],
      ['papua', 'Papua']
    ],
    default: 'jawa'
  })
  timezone = fields.Selection({
    selection: [
      ['WIB', 'WIB (UTC+7)'],
      ['WITA', 'WITA (UTC+8)'],
      ['WIT', 'WIT (UTC+9)']
    ],
    default: 'WIB'
  })
  lat = fields.Float()
  lng = fields.Float()
  active = fields.Boolean({ default: true, index: true })
  cityIds = fields.One2many({ comodel: 'geo.city', inverse: 'provinceId' })
}
