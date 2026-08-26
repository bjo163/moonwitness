import { Vertex, fields } from '@moon/orm'

export default class VxUser extends Vertex {
  static override _name = 'vx.user'
  static override _description = 'App User'
  static override _softDelete = true
  static override _inherits = { 'vx.node': 'partnerId' }

  partnerId = fields.Many2one({ comodel: 'vx.node', required: true })
  login = fields.Char({ size: 120, unique: true, index: true })
  password = fields.Char({ required: true })
  companyId = fields.Many2one({ comodel: 'vx.org' })
  companyIds = fields.Many2many({ comodel: 'vx.org', relation: 'vx_user_vx_org_rel' })
  nickname = fields.Char({ size: 50 })
  githubUrl = fields.Char({ size: 100 })
  groupsId = fields.Many2many({ comodel: 'vx.role', relation: 'vx_user_vx_role_rel' })
  otpCode = fields.Char({ size: 10 })
  otpExpires = fields.DateTime()

  static async beforeSave(modelClass: any, env: any, vals: Record<string, any>, id?: number) {
    if (vals.login && typeof vals.login === 'string') {
      vals.login = vals.login.trim().toLowerCase()
    }

    if (vals.password) {
      if (!vals.password.startsWith('$2') || vals.password.length !== 60) {
        const bcrypt = await import('bcryptjs')
        vals.password = await bcrypt.hash(vals.password, 10)
      }
    }

    // Current-company invariant: if companyId is given, ensure it exists in companyIds
    if (vals.companyId && vals.companyIds && Array.isArray(vals.companyIds)) {
      const allowedCompanyIds = vals.companyIds.map((c: any) => (Array.isArray(c) ? c[0] : c))
      if (allowedCompanyIds.length > 0 && !allowedCompanyIds.includes(vals.companyId)) {
        throw new Error(`Validation Error: User current company (${vals.companyId}) must belong to user's allowed companies`)
      }
    }
  }
}
