import { Vertex, fields } from '@moon/orm'

export default class VxZoneSubdivision extends Vertex {
  static override _name = 'vx.zone.subdivision'
  static override _description = 'Country Subdivision (State/Province)'

  name = fields.Char({ required: true, size: 120 })
  code = fields.Char({ required: true, size: 20, unique: true, index: true })
  countryId = fields.Many2one({ comodel: 'vx.zone', required: true, index: true })
  type = fields.Selection({
    selection: [
      ['state', 'State'],
      ['province', 'Province'],
      ['region', 'Region'],
      ['territory', 'Territory'],
      ['division', 'Division'],
      ['prefecture', 'Prefecture'],
      ['department', 'Department']
    ],
    default: 'province'
  })
}
