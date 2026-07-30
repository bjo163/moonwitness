export interface FieldDef<T extends string = string> {
  type: T
  required?: boolean
  size?: number
  unique?: boolean
  default?: unknown
  comodel?: string
  selection?: [string, string][]
  autoNowAdd?: boolean
  autoNow?: boolean
  relation?: string
  compute?: (record: any) => any
  store?: boolean
  depends?: string[]
  translate?: boolean
  index?: boolean
  tracking?: boolean
  dim?: number
  min?: number
  max?: number
  pattern?: RegExp
  validate?: (val: any) => string | boolean
  inverse?: string
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
  'many2many',
  'vector'
])

export function isFieldDef(value: unknown): value is FieldDef {
  return (
    value !== null &&
    typeof value === 'object' &&
    typeof (value as FieldDef).type === 'string' &&
    FIELD_TYPES.has((value as FieldDef).type)
  )
}

function makeField<T extends string>(
  type: T,
  opts: Record<string, unknown>
): FieldDef<T> {
  return { type, ...opts } as FieldDef<T>
}

export const fields = {
  Char: (opts: {
    required?: boolean
    size?: number
    unique?: boolean
    default?: string
    compute?: (record: any) => string
    store?: boolean
    depends?: string[]
    translate?: boolean
    index?: boolean
    min?: number
    max?: number
    pattern?: RegExp
    validate?: (val: any) => string | boolean
  } = {}): FieldDef<'char'> => makeField('char', opts),
  
  Text: (opts: {
    required?: boolean
    default?: string
    compute?: (record: any) => string
    store?: boolean
    depends?: string[]
    translate?: boolean
    index?: boolean
    min?: number
    max?: number
    pattern?: RegExp
    validate?: (val: any) => string | boolean
  } = {}): FieldDef<'text'> => makeField('text', opts),
  
  Integer: (opts: {
    required?: boolean
    default?: number
    compute?: (record: any) => number
    store?: boolean
    depends?: string[]
    index?: boolean
    min?: number
    max?: number
    validate?: (val: any) => string | boolean
  } = {}): FieldDef<'integer'> => makeField('integer', opts),
  
  Float: (opts: {
    required?: boolean
    default?: number
    compute?: (record: any) => number
    store?: boolean
    depends?: string[]
    index?: boolean
    min?: number
    max?: number
    validate?: (val: any) => string | boolean
  } = {}): FieldDef<'float'> => makeField('float', opts),
  
  Boolean: (opts: {
    required?: boolean
    default?: boolean
    compute?: (record: any) => boolean
    store?: boolean
    depends?: string[]
    index?: boolean
  } = {}): FieldDef<'boolean'> => makeField('boolean', opts),
  
  Date: (opts: {
    required?: boolean
    default?: string
    index?: boolean
  } = {}): FieldDef<'date'> => makeField('date', opts),
  
  DateTime: (opts: {
    required?: boolean
    autoNowAdd?: boolean
    autoNow?: boolean
    default?: string
    index?: boolean
  } = {}): FieldDef<'datetime'> => makeField('datetime', opts),
  
  Selection: (opts: {
    selection: [string, string][]
    required?: boolean
    default?: string
    index?: boolean
  }): FieldDef<'selection'> => makeField('selection', opts),
  
  Many2one: (opts: {
    comodel: string
    required?: boolean
    default?: number
    index?: boolean
  }): FieldDef<'many2one'> => makeField('many2one', opts),
  
  One2many: (opts: { comodel: string; inverse: string }): FieldDef<'one2many'> =>
    makeField('one2many', opts),
    
  Many2many: (opts: {
    comodel: string
    relation?: string
  }): FieldDef<'many2many'> => makeField('many2many', opts),

  Vector: (opts: {
    dim: number
    required?: boolean
  }): FieldDef<'vector'> => makeField('vector', opts)
}

// ==========================================
// TYPESCRIPT INFERENCE ENGINE
// ==========================================

export type InferFieldType<F> = F extends FieldDef<'char' | 'text' | 'date' | 'datetime' | 'selection'>
  ? string
  : F extends FieldDef<'integer' | 'float'>
  ? number
  : F extends FieldDef<'boolean'>
  ? boolean
  : F extends FieldDef<'many2one'>
  ? number | [number, string] | false
  : F extends FieldDef<'one2many' | 'many2many'>
  ? number[]
  : F extends FieldDef<'vector'>
  ? number[]
  : unknown;

export type InferRecord<M extends Record<string, FieldDef<any>>> = {
  id: number;
} & {
  [K in keyof M]: InferFieldType<M[K]>
};