import type { FieldDef } from './fields.js'

type Row = Record<string, any>

function toSnakeCase(value: string): string {
  return value.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
}

function shouldCompute(field: string, requestedFields?: string[]): boolean {
  if (!requestedFields || requestedFields.length === 0) return true
  const snake = toSnakeCase(field)
  return requestedFields.includes(field) || requestedFields.includes(snake)
}

export function applyComputedFields(
  rows: Row[],
  fieldDefs: Record<string, FieldDef>,
  requestedFields?: string[],
  warn: (message: string, error: unknown) => void = (message, error) => console.warn(message, error),
): void {
  const fieldsToCompute = Object.entries(fieldDefs).filter(
    ([field, definition]) => typeof definition.compute === 'function' && shouldCompute(field, requestedFields),
  )

  for (const row of rows) {
    const proxyRow = new Proxy(row, {
      get(target, property) {
        if (typeof property === 'string') {
          if (property in target) return target[property]
          const snake = toSnakeCase(property)
          if (snake in target) return target[snake]
        }
        return target[property as keyof Row]
      },
    })

    for (const [field, definition] of fieldsToCompute) {
      const targetField = toSnakeCase(field)
      try {
        row[targetField] = definition.compute!(proxyRow)
      } catch (error) {
        warn(`Compute field error on ${field}:`, error)
        row[targetField] = null
      }
    }
  }
}
