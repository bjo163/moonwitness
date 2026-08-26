import { Vertex, fields, Ctx } from '@moon/orm'

export default class IrConfigParameter extends Vertex {
  static override _name = 'ir.config_parameter'
  static override _description = 'System Configuration Parameter'

  key = fields.Char({ required: true, size: 120, unique: true, index: true })
  value = fields.Text({ required: true })

  static async getParam(env: Ctx, key: string, defaultValue: string | null = null): Promise<string | null> {
    const records = await this.fetch(this as any, env, [['key', '=', key]])
    if (records.length === 0) return defaultValue
    return String(records[0].value ?? defaultValue)
  }

  static async setParam(env: Ctx, key: string, value: string): Promise<void> {
    await this.transaction(env, async (txEnv) => {
      const records = await this.fetch(this as any, txEnv, [['key', '=', key]])
      if (records.length > 0) {
        await this.morph(this as any, txEnv, records[0].id, { value })
      } else {
        await this.spawn(this as any, txEnv, { key, value })
      }
    })
  }
}
