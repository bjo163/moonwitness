import { Vertex, fields } from '@moon/orm'

export default class ProductTemplate extends Vertex {
  static override _name = 'product.template'
  static override _description = 'Product Template'

  name = fields.Char({ required: true, size: 120 })
  type = fields.Selection({
    selection: [
      ['consu', 'Consumable'],
      ['service', 'Service'],
      ['product', 'Storable Product']
    ],
    default: 'consu'
  })
  categoryId = fields.Many2one({ comodel: 'product.category' })
  listPrice = fields.Float({ default: 0.0 })
  standardPrice = fields.Float({ default: 0.0 })
  barcode = fields.Char({ size: 64 })
  defaultCode = fields.Char({ size: 64 })
}
