export interface FieldDef {
  type: string
  required?: boolean
  size?: number
  unique?: boolean
  default?: unknown
  comodel?: string
  selection?: [string, string][]
  autoNowAdd?: boolean
  autoNow?: boolean
}

const FIELD_TYPES = new Set([
  'char',
  'text',
  'integer',
  'float',
  'boolean',
  'date',
  'datetime',
  'selection',
  'many2one',
  'one2many',
  'many2many'
])

export function isFieldDef(value: unknown): value is FieldDef {
  return (
    value !== null &&
    typeof value === 'object' &&
    typeof (value as FieldDef).type === 'string' &&
    FIELD_TYPES.has((value as FieldDef).type)
  )
}

function makeField(
  type: string,
  opts: Record<string, unknown>
): FieldDef {
  return { type, ...opts }
}

export const fields = {
  Char: (opts: {
    required?: boolean
    size?: number
    unique?: boolean
    default?: string
  } = {}): FieldDef => makeField('char', opts),
  Text: (opts: {
    required?: boolean
    default?: string
  } = {}): FieldDef => makeField('text', opts),
  Integer: (opts: {
    required?: boolean
    default?: number
  } = {}): FieldDef => makeField('integer', opts),
  Float: (opts: {
    required?: boolean
    default?: number
  } = {}): FieldDef => makeField('float', opts),
  Boolean: (opts: {
    required?: boolean
    default?: boolean
  } = {}): FieldDef => makeField('boolean', opts),
  Date: (opts: {
    required?: boolean
    default?: string
  } = {}): FieldDef => makeField('date', opts),
  DateTime: (opts: {
    required?: boolean
    autoNowAdd?: boolean
    autoNow?: boolean
    default?: string
  } = {}): FieldDef => makeField('datetime', opts),
  Selection: (opts: {
    selection: [string, string][]
    required?: boolean
    default?: string
  }): FieldDef => makeField('selection', opts),
  Many2one: (opts: {
    comodel: string
    required?: boolean
    default?: number
  }): FieldDef => makeField('many2one', opts),
  One2many: (opts: { comodel: string; inverse: string }): FieldDef =>
    makeField('one2many', opts),
  Many2many: (opts: {
    comodel: string
    relation?: string
  }): FieldDef => makeField('many2many', opts)
}