import { Vertex, fields } from '@moon/orm'

export default class StockPicking extends Vertex {
  static override _name = 'stock.picking'
  static override _description = 'Transfer / Picking'

  name = fields.Char({ required: true, default: '/', size: 80, index: true })
  locationId = fields.Many2one({ comodel: 'stock.location', required: true })
  locationDestId = fields.Many2one({ comodel: 'stock.location', required: true })
  partnerId = fields.Many2one({ comodel: 'vx.node' })
  companyId = fields.Many2one({ comodel: 'vx.org' })
  state = fields.Selection({
    selection: [
      ['draft', 'Draft'],
      ['confirmed', 'Waiting'],
      ['assigned', 'Ready'],
      ['done', 'Done'],
      ['cancel', 'Cancelled']
    ],
    default: 'draft'
  })
  moveIds = fields.One2many({ comodel: 'stock.move', inverse: 'pickingId' })
}
