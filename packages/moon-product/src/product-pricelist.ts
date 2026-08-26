import { Vertex, fields } from '@moon/orm'

export default class ProductPricelist extends Vertex {
  static override _name = 'product.pricelist'
  static override _description = 'Pricelist'

  name = fields.Char({ required: true, size: 80 })
  currencyId = fields.Many2one({ comodel: 'vx.coin', required: true })
  discountPolicy = fields.Selection({
    selection: [
      ['with_discount', 'Discount included in the price'],
      ['without_discount', 'Show public price & discount to the customer']
    ],
    default: 'with_discount'
  })
}
