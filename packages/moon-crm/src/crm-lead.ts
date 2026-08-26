import { Vertex, fields } from '@moon/orm'

export default class CrmLead extends Vertex {
  static override _name = 'crm.lead'
  static override _description = 'Lead / Opportunity'

  name = fields.Char({ required: true, size: 120 })
  partnerId = fields.Many2one({ comodel: 'vx.node' })
  email = fields.Char({ size: 120 })
  phone = fields.Char({ size: 40 })
  userId = fields.Many2one({ comodel: 'vx.user' })
  teamId = fields.Many2one({ comodel: 'crm.team' })
  stageId = fields.Many2one({ comodel: 'crm.stage' })
  expectedRevenue = fields.Float({ default: 0.0 })
  probability = fields.Float({ default: 10.0 })
  type = fields.Selection({
    selection: [
      ['lead', 'Lead'],
      ['opportunity', 'Opportunity']
    ],
    default: 'opportunity'
  })
  companyId = fields.Many2one({ comodel: 'vx.org' })
}
