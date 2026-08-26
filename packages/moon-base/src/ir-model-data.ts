import { Vertex, fields, Ctx } from '@moon/orm'

export default class IrModelData extends Vertex {
  static override _name = 'ir.model.data'
  static override _description = 'External Identifier'

  name = fields.Char({ required: true, size: 120, index: true })
  module = fields.Char({ required: true, size: 80, index: true })
  model = fields.Char({ required: true, size: 120, index: true })
  resId = fields.Integer({ required: true, index: true })
  noupdate = fields.Boolean({ default: false })

  /**
   * Resolve an external XML ID (e.g. 'base.group_admin') to database ID
   */
  static async xmlidToResId(
    env: Ctx,
    xmlid: string
  ): Promise<{ model: string; resId: number } | null> {
    const parts = xmlid.split('.')
    const module = parts.length > 1 ? parts[0] : 'base'
    const name = parts.length > 1 ? parts.slice(1).join('.') : parts[0]

    const records = await this.fetch(this as any, env, [
      ['module', '=', module],
      ['name', '=', name]
    ])

    if (records.length === 0) return null
    return { model: records[0].model, resId: records[0].res_id || records[0].resId }
  }

  /**
   * Create or update external XML ID record idempotently
   */
  static async setXmlid(
    env: Ctx,
    xmlid: string,
    model: string,
    resId: number,
    noupdate: boolean = false
  ): Promise<void> {
    const parts = xmlid.split('.')
    const module = parts.length > 1 ? parts[0] : 'base'
    const name = parts.length > 1 ? parts.slice(1).join('.') : parts[0]

    const existing = await this.fetch(this as any, env, [
      ['module', '=', module],
      ['name', '=', name]
    ])

    if (existing.length > 0) {
      if (!existing[0].noupdate) {
        await this.morph(this as any, env, existing[0].id, { model, resId, noupdate })
      }
    } else {
      await this.spawn(this as any, env, { module, name, model, resId, noupdate })
    }
  }
}
