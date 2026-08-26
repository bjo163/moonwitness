import { describe, it, expect, beforeEach } from 'vitest'
import { Vertex, fields, createCtx, registerModel, setupOrm, SUPERUSER_ID } from '../src/index.js'

let mockDbTables: Record<string, any[]> = {}

function createMockKnex() {
  const conn: any = (tableName: string) => {
    if (!mockDbTables[tableName]) {
      mockDbTables[tableName] = []
    }
    const table = mockDbTables[tableName]

    const queryObj: any = {
      _where: {} as Record<string, any>,
      where: (clause: any, val?: any) => {
        if (typeof clause === 'object') {
          Object.assign(queryObj._where, clause)
        } else if (typeof clause === 'string' && val !== undefined) {
          queryObj._where[clause] = val
        }
        return queryObj
      },
      whereIn: (col: string, vals: any[]) => {
        queryObj._whereIn = { col, vals }
        return queryObj
      },
      first: async () => {
        return table.find((row) => {
          for (const [k, v] of Object.entries(queryObj._where)) {
            if (row[k] !== v) return false
          }
          return true
        }) || null
      },
      insert: async (data: any | any[]) => {
        const flatItems = Array.isArray(data) ? data.flat() : [data]
        const inserted = []
        for (const item of flatItems) {
          const row = { ...item }
          table.push(row)
          inserted.push(row)
        }
        return inserted
      },
      update: async (data: any) => {
        let count = 0
        for (const row of table) {
          let match = true
          for (const [k, v] of Object.entries(queryObj._where)) {
            if (row[k] !== v) match = false
          }
          if (match) {
            Object.assign(row, data)
            count++
          }
        }
        return count
      },
      delete: async () => {
        const beforeLen = table.length
        mockDbTables[tableName] = table.filter((row) => {
          for (const [k, v] of Object.entries(queryObj._where)) {
            if (row[k] === v) return false
          }
          return true
        })
        return beforeLen - mockDbTables[tableName].length
      }
    }
    return queryObj
  }

  conn.transaction = async (cb: any) => {
    return await cb(conn)
  }
  conn.raw = (sql: string, bindings: any[]) => ({ sql, bindings })
  conn.on = () => conn
  return conn
}

class Tag extends Vertex {
  static override _name = 'test.tag'
  static override _table = 'test_tags'
  static override _public = true
  static override _fields = {
    id: fields.Integer(),
    name: fields.Char({ required: true })
  }
}

class Project extends Vertex {
  static override _name = 'test.project'
  static override _table = 'test_projects'
  static override _public = true
  static override _fields = {
    id: fields.Integer(),
    name: fields.Char({ required: true }),
    tagIds: fields.Many2many({ comodel: 'test.tag' })
  }
}

registerModel(Tag)
registerModel(Project)

describe('ORM Relational Writes (Odoo-Style Command Tuples) (#19)', () => {
  beforeEach(() => {
    mockDbTables = {
      test_tag: [
        { id: 1, name: 'Security' },
        { id: 2, name: 'Core' }
      ],
      test_project: [
        { id: 10, name: 'MoonWitness v0.2' }
      ],
      test_project_test_tag_rel: [
        { test_project_id: 10, test_tag_id: 1 }
      ]
    }
    setupOrm(createMockKnex())
  })

  it('handles command (4, id) - link existing record to relation', async () => {
    const env = createCtx(SUPERUSER_ID, {}, (name) => (name === 'test.tag' ? Tag : Project))

    await Project.processRelationalTuples(Project, env, 10, [
      {
        field: 'tagIds',
        def: { type: 'many2many', comodel: 'test.tag' } as any,
        tuples: [[4, 2]]
      }
    ])

    const rels = mockDbTables['test_project_test_tag_rel']
    expect(rels).toContainEqual({ test_project_id: 10, test_tag_id: 2 })
  })

  it('handles command (3, id) - unlink record without deleting target', async () => {
    const env = createCtx(SUPERUSER_ID, {}, (name) => (name === 'test.tag' ? Tag : Project))

    await Project.processRelationalTuples(Project, env, 10, [
      {
        field: 'tagIds',
        def: { type: 'many2many', comodel: 'test.tag' } as any,
        tuples: [[3, 1]]
      }
    ])

    const rels = mockDbTables['test_project_test_tag_rel']
    expect(rels.find((r) => r.test_tag_id === 1)).toBeUndefined()
    // Tag itself must still exist in DB
    expect(mockDbTables['test_tag'].find((t) => t.id === 1)).toBeDefined()
  })

  it('handles command (5) - unlink all relations', async () => {
    const env = createCtx(SUPERUSER_ID, {}, (name) => (name === 'test.tag' ? Tag : Project))

    await Project.processRelationalTuples(Project, env, 10, [
      {
        field: 'tagIds',
        def: { type: 'many2many', comodel: 'test.tag' } as any,
        tuples: [[5]]
      }
    ])

    const rels = mockDbTables['test_project_test_tag_rel']
    expect(rels.length).toBe(0)
  })

  it('handles command (6, 0, [ids]) - replace existing relations with new set', async () => {
    const env = createCtx(SUPERUSER_ID, {}, (name) => (name === 'test.tag' ? Tag : Project))

    await Project.processRelationalTuples(Project, env, 10, [
      {
        field: 'tagIds',
        def: { type: 'many2many', comodel: 'test.tag' } as any,
        tuples: [[6, 0, [2]]]
      }
    ])

    const rels = mockDbTables['test_project_test_tag_rel']
    expect(rels).toEqual([{ test_project_id: 10, test_tag_id: 2 }])
  })
})
