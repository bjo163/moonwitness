import { Vertex, fields } from '@moon/orm'

export default class StockLocation extends Vertex {
  static override _name = 'stock.location'
  static override _description = 'Inventory Location'

  name = fields.Char({ required: true, size: 80 })
  locationId = fields.Many2one({ comodel: 'stock.location' })
  usage = fields.Selection({
    selection: [
      ['internal', 'Internal Location'],
      ['customer', 'Customer Location'],
      ['supplier', 'Vendor Location'],
      ['inventory', 'Inventory Loss'],
      ['production', 'Production'],
      ['transit', 'Transit Location']
    ],
    default: 'internal'
  })
  companyId = fields.Many2one({ comodel: 'vx.org' })
}
