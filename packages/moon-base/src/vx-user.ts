import { Vertex } from '@moon/orm'
import { fields } from '@moon/orm'

export default class VxUser extends Vertex {
  static _name = 'vx.user'
  static _description = 'App User'
  static _softDelete = true
  static _inherits = { 'vx.node': 'partnerId' }

  partnerId = fields.Many2one({ comodel: 'vx.node', required: true })
  password = fields.Char({ required: true })
  companyId = fields.Many2one({ comodel: 'vx.org' })
  nickname = fields.Char({ size: 50 })
  githubUrl = fields.Char({ size: 100 })
  groupsId = fields.Many2many({ comodel: 'vx.role' })
  otpCode = fields.Char({ size: 10 })
  otpExpires = fields.DateTime()

  static async beforeSave(modelClass: any, env: any, vals: Record<string, any>, id?: number) {
    if (vals.password) {
      // Basic check if it's already a bcrypt hash ($2a$, $2b$, $2y$)
      if (!vals.password.startsWith('$2') || vals.password.length !== 60) {
        const bcrypt = await import('bcryptjs')
        vals.password = await bcrypt.hash(vals.password, 10)
      }
    }
  }
}
