import { Vertex, fields } from '@moon/orm'

export default class VxAuthChallenge extends Vertex {
  static override _name = 'vx.auth.challenge'
  static override _description = 'Authentication Challenge'
  static override _softDelete = false

  userId = fields.Many2one({ comodel: 'vx.user', required: true, index: true })
  purpose = fields.Selection({
    selection: [
      ['password_recovery', 'Password Recovery'],
      ['email_verification', 'Email Verification'],
      ['mfa', 'Multi-Factor Auth'],
    ],
    default: 'password_recovery',
    required: true,
  })
  tokenHash = fields.Char({ size: 128, required: true, index: true })
  expiresAt = fields.DateTime({ required: true })
  attempts = fields.Integer({ default: 0 })
  maxAttempts = fields.Integer({ default: 5 })
  consumedAt = fields.DateTime()
}
