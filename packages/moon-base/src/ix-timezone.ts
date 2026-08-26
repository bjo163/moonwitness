import { Vertex, fields } from '@moon/orm'

export default class IxTimezone extends Vertex {
  static override _name = 'ix.timezone'
  static override _description = 'IANA Timezones'

  name = fields.Char({ required: true, size: 80, unique: true, index: true })
  tzName = fields.Char({ size: 20 })
  utcOffset = fields.Char({ required: true, size: 10 })
  countryCode = fields.Char({ size: 2, index: true })
}
