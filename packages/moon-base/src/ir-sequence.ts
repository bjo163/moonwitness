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
   * Interpolates date variables in prefix/suffix: %(year)s, %(y)s, %(month)s, %(day)s
   */
  static interpolateTemplate(template: string, now: Date = new Date()): string {
    const year = now.getFullYear().toString()
    const y = year.slice(-2)
    const month = (now.getMonth() + 1).toString().padStart(2, '0')
    const day = now.getDate().toString().padStart(2, '0')

    return template
      .replace(/%\(year\)s/g, year)
      .replace(/%\(y\)s/g, y)
      .replace(/%\(month\)s/g, month)
      .replace(/%\(day\)s/g, day)
  }

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
      const rawPrefix = String(seq.prefix ?? '')
      const rawSuffix = String(seq.suffix ?? '')

      const prefix = this.interpolateTemplate(rawPrefix)
      const suffix = this.interpolateTemplate(rawSuffix)

      const formattedNumber = String(currentNext).padStart(padding, '0')
      const formattedCode = `${prefix}${formattedNumber}${suffix}`

      await this.morph(this as any, txEnv, seq.id, {
        numberNext: currentNext + increment
      })

      return formattedCode
    })
  }
}
