import { Vertex, fields } from '@moon/orm'

export default class CrmStage extends Vertex {
  static override _name = 'crm.stage'
  static override _description = 'CRM Lead Stage'

  name = fields.Char({ required: true, size: 80 })
  sequence = fields.Integer({ default: 1 })
  isWon = fields.Boolean({ default: false })
  fold = fields.Boolean({ default: false })
}
