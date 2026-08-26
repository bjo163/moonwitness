import { Vertex, fields } from '@moon/orm'

export default class StockQuant extends Vertex {
  static override _name = 'stock.quant'
  static override _description = 'Quants'

  productId = fields.Many2one({ comodel: 'product.product', required: true, index: true })
  locationId = fields.Many2one({ comodel: 'stock.location', required: true, index: true })
  quantity = fields.Float({ required: true, default: 0.0 })
  reservedQuantity = fields.Float({ default: 0.0 })
  companyId = fields.Many2one({ comodel: 'vx.org' })
}
