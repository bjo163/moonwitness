import { Vertex, fields } from '@moon/orm'

export default class ProductProduct extends Vertex {
  static override _name = 'product.product'
  static override _description = 'Product Variant'
  static override _inherits = { 'product.template': 'productTmplId' }

  productTmplId = fields.Many2one({ comodel: 'product.template', required: true })
  defaultCode = fields.Char({ size: 64 })
  barcode = fields.Char({ size: 64 })
  weight = fields.Float({ default: 0.0 })
  volume = fields.Float({ default: 0.0 })
}
