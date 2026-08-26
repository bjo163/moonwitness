import { Vertex, fields } from '@moon/orm'

export default class StockMove extends Vertex {
  static override _name = 'stock.move'
  static override _description = 'Stock Move'

  name = fields.Char({ required: true, size: 120 })
  pickingId = fields.Many2one({ comodel: 'stock.picking', index: true })
  productId = fields.Many2one({ comodel: 'product.product', required: true })
  productUomQty = fields.Float({ required: true, default: 0.0 })
  locationId = fields.Many2one({ comodel: 'stock.location', required: true })
  locationDestId = fields.Many2one({ comodel: 'stock.location', required: true })
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
