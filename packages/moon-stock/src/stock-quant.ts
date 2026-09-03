import { Vertex, fields } from '@moon/orm'
import { rejectDirectQuantMutation } from './stock-write-guards.js'

export default class StockQuant extends Vertex {
  static override async beforeSave(): Promise<void> { rejectDirectQuantMutation() }
  static override async beforeDelete(): Promise<void> { rejectDirectQuantMutation() }
  static override _name = 'stock.quant'
  static override _description = 'Quants'

  productId = fields.Many2one({ comodel: 'product.product', required: true, index: true })
  locationId = fields.Many2one({ comodel: 'stock.location', required: true, index: true })
  quantity = fields.Decimal({ precision: 38, scale: 12, required: true, default: '0' })
  reservedQuantity = fields.Decimal({ precision: 38, scale: 12, required: true, default: '0' })
  companyId = fields.Many2one({ comodel: 'vx.org', required: true })
}
