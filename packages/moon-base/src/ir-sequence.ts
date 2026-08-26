import { Vertex, fields, Ctx } from '@moon/orm'

export default class IrSequence extends Vertex {
  static override _name = 'ir.sequence'
  static override _description = 'Sequence Allocator'

  name = fields.Char({ required: true, size: 120 })
  code = fields.Char({ required: true, size: 80, unique: true, index: true })
  prefix = fields.Char({ size: 40 })
  suffix = fields.Char({ size: 40 })
  padding = fields.Integer({ default: 4 })
  numberNext = fields.Integer({ default: 1 })
  numberIncrement = fields.Integer({ default: 1 })
  companyId = fields.Many2one({ comodel: 'vx.org' })

  /**
   * Allocate the next sequential code safely in an atomic transaction
   */
  static async nextByCode(env: Ctx, code: string): Promise<string> {
    return await this.transaction(env, async (txEnv) => {
      const records = await this.fetch(this as any, txEnv, [['code', '=', code]])
      if (records.length === 0) {
        throw new Error(`Sequence '${code}' not found`)
      }

      const seq = records[0]
      const currentNext = Number(seq.number_next ?? seq.numberNext ?? 1)
      const increment = Number(seq.number_increment ?? seq.numberIncrement ?? 1)
      const padding = Number(seq.padding ?? 4)
      const prefix = String(seq.prefix ?? '')
      const suffix = String(seq.suffix ?? '')

      const formattedNumber = String(currentNext).padStart(padding, '0')
      const formattedCode = `${prefix}${formattedNumber}${suffix}`

      await this.morph(this as any, txEnv, seq.id, {
        numberNext: currentNext + increment
      })

      return formattedCode
    })
  }
}
