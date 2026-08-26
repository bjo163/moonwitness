import { Vertex, fields } from '@moon/orm'

export default class ProductCategory extends Vertex {
  static override _name = 'product.category'
  static override _description = 'Product Category'

  name = fields.Char({ required: true, size: 80 })
  parentId = fields.Many2one({ comodel: 'product.category' })
}
