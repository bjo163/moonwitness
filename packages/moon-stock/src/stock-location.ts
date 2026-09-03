import { Vertex, fields, type Ctx } from '@moon/orm'
import { guardStockLocationMutation } from './stock-write-guards.js'

export default class StockLocation extends Vertex {
  static override beforeSave(_model: typeof Vertex, env: Ctx, values: Record<string, unknown>, id?: number) {
    return guardStockLocationMutation(env, values, id)
  }
  static override beforeDelete(_model: typeof Vertex, env: Ctx, id: number) {
    return guardStockLocationMutation(env, {}, id)
  }
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
