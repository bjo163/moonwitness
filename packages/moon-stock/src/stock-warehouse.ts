import { Vertex, fields } from '@moon/orm'

export default class StockWarehouse extends Vertex {
  static override _name = 'stock.warehouse'
  static override _description = 'Warehouse'

  name = fields.Char({ required: true, size: 80 })
  code = fields.Char({ required: true, size: 10, index: true })
  companyId = fields.Many2one({ comodel: 'vx.org' })
  lotStockId = fields.Many2one({ comodel: 'stock.location' })
}
