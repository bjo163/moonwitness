import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'

const source = readFileSync(
  new URL('../src/components/data-table.tsx', import.meta.url),
  'utf8'
)

describe('MoonDataTable canonical CRUD contract (#95)', () => {
  it('uses modelName through the same-origin backend BFF', () => {
    expect(source).toContain('/api/backend/api/${encodeURIComponent(modelName)}')
    expect(source).not.toContain('fetch("/api/users")')
  })

  it('never manufactures fallback records when reads fail', () => {
    expect(source).not.toContain('Rezza Fahlevi')
    expect(source).not.toContain('Aisyah Rahma')
    expect(source).not.toContain('Fadly Maulana')
    expect(source).toContain('setData([])')
    expect(source).toContain('role="alert"')
  })

  it('persists create, update, and delete before refreshing server truth', () => {
    expect(source).toContain('method: isEdit ? "PATCH" : "POST"')
    expect(source).toContain('method: "DELETE"')
    expect(source).toContain('await fetchData()')
    expect(source).not.toContain('id: Date.now()')
  })

  it('sends bounded pagination, filters, and search as canonical query semantics', () => {
    expect(source).toContain('limit: String(pageSize)')
    expect(source).toContain('params.set("domain", JSON.stringify(domain))')
    expect(source).toContain('[searchableField, "ilike", `%${searchTerm}%`]')
    expect(source).toContain('Unsupported filter field')
  })
})
