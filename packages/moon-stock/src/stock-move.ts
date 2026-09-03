import { Vertex, fields, type Ctx } from '@moon/orm'
import { guardStockMoveMutation } from './stock-write-guards.js'

export default class StockMove extends Vertex {
  static override beforeSave(_model: typeof Vertex, env: Ctx, values: Record<string, unknown>, id?: number) {
    return guardStockMoveMutation(env, values, id)
  }
  static override beforeDelete(_model: typeof Vertex, env: Ctx, id: number) {
    return guardStockMoveMutation(env, {}, id)
  }
  static override _name = 'stock.move'
  static override _description = 'Stock Move'

  name = fields.Char({ required: true, size: 120 })
  pickingId = fields.Many2one({ comodel: 'stock.picking', index: true })
  productId = fields.Many2one({ comodel: 'product.product', required: true })
  productUomQty = fields.Decimal({ precision: 38, scale: 12, required: true, default: '0' })
  companyId = fields.Many2one({ comodel: 'vx.org', required: true, index: true })
  locationId = fields.Many2one({ comodel: 'stock.location', required: true })
  locationDestId = fields.Many2one({ comodel: 'stock.location', required: true })
  reservedAt = fields.DateTime()
  reservedBy = fields.Many2one({ comodel: 'vx.user' })
  completedAt = fields.DateTime()
  completedBy = fields.Many2one({ comodel: 'vx.user' })
  cancelledAt = fields.DateTime()
  cancelledBy = fields.Many2one({ comodel: 'vx.user' })
  state = fields.Selection({
    selection: [
      ['draft', 'Draft'],
      ['waiting', 'Waiting Another Move'],
      ['confirmed', 'Waiting Availability'],
      ['assigned', 'Available'],
      ['done', 'Done'],
      ['cancel', 'Cancelled']
    ],
    default: 'draft'
  })
}
