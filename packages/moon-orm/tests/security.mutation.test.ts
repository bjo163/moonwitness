import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  getDb: vi.fn(),
}))

vi.mock('../src/config.js', () => ({
  getDb: mocks.getDb,
}))

import { createCtx } from '../src/env.js'
import { Vertex, Recordset } from '../src/base.js'
import { fields } from '../src/fields.js'
import { AuthorizationError } from '../src/security.js'

type Row = Record<string, any>
type Tables = Record<string, Row[]>

class FakeDbQuery {
  private tableName: string
  private tables: Tables
  private filters: Array<(row: Row) => boolean> = []
  private selects?: string[]

  constructor(tableName: string, tables: Tables) {
    this.tableName = tableName
    this.tables = tables
    if (!this.tables[tableName]) {
      this.tables[tableName] = []
    }
  }

  where(columnOrFn: string | Record<string, any> | ((qb: any) => void), opOrVal?: any, val?: any): this {
    if (typeof columnOrFn === 'function') {
      const nestedQb = new FakeDbQuery(this.tableName, this.tables)
      columnOrFn(nestedQb)
      this.filters.push((row) => nestedQb.filters.every((f) => f(row)))
      return this
    }

    if (typeof columnOrFn === 'object' && columnOrFn !== null) {
      this.filters.push((row) =>
        Object.entries(columnOrFn).every(([key, expected]) => row[key] === expected)
      )
      return this
    }

    const column = String(columnOrFn).replace(`${this.tableName}.`, '')
    if (val !== undefined) {
      const op = String(opOrVal).toLowerCase()
      if (op === '=' || op === '==') {
        this.filters.push((row) => row[column] === val)
      } else if (op === '!=' || op === '<>') {
        this.filters.push((row) => row[column] !== val)
      } else if (op === '>') {
        this.filters.push((row) => row[column] > val)
      } else if (op === '<') {
        this.filters.push((row) => row[column] < val)
      } else if (op === '>=') {
        this.filters.push((row) => row[column] >= val)
      } else if (op === '<=') {
        this.filters.push((row) => row[column] <= val)
      } else if (op === 'like' || op === 'ilike') {
        const pattern = String(val).replace(/%/g, '.*')
        const regex = new RegExp(`^${pattern}$`, op === 'ilike' ? 'i' : undefined)
        this.filters.push((row) => regex.test(String(row[column] ?? '')))
      }
    } else {
      this.filters.push((row) => row[column] === opOrVal)
    }

    return this
  }

  andWhere(fn: (qb: any) => void): this {
    return this.where(fn)
  }

  orWhere(fn: (qb: any) => void): this {
    const nestedQb = new FakeDbQuery(this.tableName, this.tables)
    fn(nestedQb)
    const prevFilters = [...this.filters]
    this.filters = [
      (row) =>
        (prevFilters.length === 0 || prevFilters.every((f) => f(row))) ||
        nestedQb.filters.every((f) => f(row)),
    ]
    return this
  }

  whereNot(columnOrFn: string | ((qb: any) => void), val?: any): this {
    if (typeof columnOrFn === 'function') {
      const nestedQb = new FakeDbQuery(this.tableName, this.tables)
      columnOrFn(nestedQb)
      this.filters.push((row) => !nestedQb.filters.every((f) => f(row)))
      return this
    }
    const column = String(columnOrFn).replace(`${this.tableName}.`, '')
    this.filters.push((row) => row[column] !== val)
    return this
  }

  whereIn(columnOrFn: string, values: any[]): this {
    const column = String(columnOrFn).replace(`${this.tableName}.`, '')
    this.filters.push((row) => values.includes(row[column]))
    return this
  }

  whereNotIn(columnOrFn: string, values: any[]): this {
    const column = String(columnOrFn).replace(`${this.tableName}.`, '')
    this.filters.push((row) => !values.includes(row[column]))
    return this
  }

  join(otherTable: string, _col1: string, _op: string, _col2: string): this {
    return this
  }

  select(...columns: string[]): this {
    this.selects = columns.map((c) => c.replace(`${this.tableName}.`, ''))
    return this
  }

  async first(): Promise<Row | undefined> {
    const results = this.executeFilter()
    return results[0]
  }

  private executeFilter(): Row[] {
    let rows = [...(this.tables[this.tableName] ?? [])]
    for (const filter of this.filters) {
      rows = rows.filter(filter)
    }
    if (this.selects && this.selects.length > 0 && !this.selects.includes('*')) {
      return rows.map((r) => {
        const selected: Row = {}
        for (const col of this.selects!) {
          selected[col] = r[col]
        }
        return selected
      })
    }
    return rows
  }

  async update(vals: Record<string, any>): Promise<number> {
    const rows = this.executeFilter()
    for (const r of rows) {
      Object.assign(r, vals)
    }
    return rows.length
  }

  async delete(): Promise<number> {
    const rowsToDelete = new Set(this.executeFilter())
    const tableRows = this.tables[this.tableName] ?? []
    this.tables[this.tableName] = tableRows.filter((r) => !rowsToDelete.has(r))
    return rowsToDelete.size
  }

  insert(vals: any): { returning: (cols: string) => Promise<Row[]> } {
    const rowsToInsert = Array.isArray(vals) ? vals : [vals]
    const tableRows = this.tables[this.tableName] ?? []
    const createdRows: Row[] = []

    for (const v of rowsToInsert) {
      const newRow = {
        id: v.id ?? tableRows.length + 1,
        ...v,
      }
      tableRows.push(newRow)
      createdRows.push(newRow)
    }
    this.tables[this.tableName] = tableRows

    return {
      returning: async () => createdRows,
    }
  }

  then(resolve: (rows: Row[]) => void): void {
    resolve(this.executeFilter())
  }
}

function makeDb(tables: Tables) {
  const dbFn: any = (table: string) => new FakeDbQuery(table, tables)
  dbFn.raw = (sql: string, bindings?: any[]) => sql
  return dbFn
}

class PostModel extends Vertex {
  static _name = 'demo.post'
  title = fields.Char({ required: true })
  state = fields.Char({ default: 'draft' })
  ownerId = fields.Integer()
  comments = fields.One2many({ comodel: 'demo.comment', relation: 'postId' })
}

class CommentModel extends Vertex {
  static _name = 'demo.comment'
  content = fields.Char({ required: true })
  postId = fields.Integer()
  authorId = fields.Integer()
}

describe('Issue #28: Operation-Specific ORM Authorization', () => {
  let tables: Tables
  const models: Record<string, typeof Vertex> = {
    'demo.post': PostModel,
    'demo.comment': CommentModel,
  }

  const getModel = (name: string) => models[name]

  beforeEach(() => {
    tables = {
      vx_user: [
        { id: 1, name: 'Root Admin' },
        { id: 42, name: 'Alice Author' },
        { id: 99, name: 'Bob Intruder' },
      ],
      vx_user_vx_role_rel: [
        { vx_user_id: 42, vx_role_id: 10 },
        { vx_user_id: 99, vx_role_id: 10 },
      ],
      mx_model: [
        { id: 100, model: 'demo.post' },
        { id: 101, model: 'demo.comment' },
      ],
      mx_grant: [
        // Role 10 has full model permissions on demo.post and demo.comment
        {
          model_id: 100,
          group_id: 10,
          perm_read: true,
          perm_write: true,
          perm_create: true,
          perm_unlink: true,
        },
        {
          model_id: 101,
          group_id: 10,
          perm_read: true,
          perm_write: true,
          perm_create: true,
          perm_unlink: true,
        },
      ],
      mx_rule_vx_role_rel: [
        { rule_id: 1, role_id: 10 },
        { rule_id: 2, role_id: 10 },
        { rule_id: 3, role_id: 10 },
      ],
      mx_rule: [
        // Rule 1: Read rule -> anyone in Role 10 can read all published posts
        {
          id: 1,
          model_id: 100,
          name: 'Published posts are readable',
          domain_force: '[["state", "=", "published"]]',
          perm_read: true,
          perm_write: false,
          perm_create: false,
          perm_unlink: false,
        },
        // Rule 2: Write rule -> only the owner can write to the post
        {
          id: 2,
          model_id: 100,
          name: 'Only owner can edit post',
          domain_force: '[["owner_id", "=", "$user.id"]]',
          perm_read: false,
          perm_write: true,
          perm_create: false,
          perm_unlink: false,
        },
        // Rule 3: Unlink rule -> only the owner can delete the post
        {
          id: 3,
          model_id: 100,
          name: 'Only owner can delete post',
          domain_force: '[["owner_id", "=", "$user.id"]]',
          perm_read: false,
          perm_write: false,
          perm_create: false,
          perm_unlink: true,
        },
      ],
      demo_post: [
        { id: 1, title: "Alice's Post", state: 'published', owner_id: 42, is_active: true },
        { id: 2, title: "Bob's Post", state: 'published', owner_id: 99, is_active: true },
      ],
      demo_comment: [
        { id: 10, content: 'Comment on Alice post', post_id: 1, author_id: 42, is_active: true },
        { id: 20, content: 'Comment on Bob post', post_id: 2, author_id: 99, is_active: true },
      ],
    }

    mocks.getDb.mockReset()
    mocks.getDb.mockReturnValue(makeDb(tables))
  })

  it('allows morph when user satisfies permWrite record rule', async () => {
    const aliceEnv = createCtx(42, {}, getModel)

    const result = await PostModel.morph(PostModel, aliceEnv, 1, { title: 'Updated Alice Title' })
    expect(result).toBe(true)

    const updated = tables.demo_post.find((p) => p.id === 1)
    expect(updated?.title).toBe('Updated Alice Title')
  })

  it('denies morph when user can read but fails permWrite record rule', async () => {
    const aliceEnv = createCtx(42, {}, getModel)

    // Alice can read Bob's post (id: 2) because state == 'published'
    const readable = await PostModel.fetch(PostModel, aliceEnv, [['id', '=', 2]])
    expect(readable.length).toBe(1)
    expect(readable[0].id).toBe(2)

    // But Alice CANNOT morph Bob's post (permWrite requires owner_id == 42)
    await expect(
      PostModel.morph(PostModel, aliceEnv, 2, { title: 'Malicious Edit' })
    ).rejects.toThrowError(AuthorizationError)

    // Verify Bob's post was untouched
    const bobPost = tables.demo_post.find((p) => p.id === 2)
    expect(bobPost?.title).toBe("Bob's Post")
  })

  it('denies purge when user can read but fails permUnlink record rule', async () => {
    const aliceEnv = createCtx(42, {}, getModel)

    // Alice cannot delete Bob's post
    await expect(PostModel.purge(PostModel, aliceEnv, 2)).rejects.toThrowError(AuthorizationError)

    // Verify Bob's post was not deleted
    const bobPost = tables.demo_post.find((p) => p.id === 2)
    expect(bobPost).toBeDefined()
  })

  it('allows purge when user satisfies permUnlink record rule', async () => {
    const aliceEnv = createCtx(42, {}, getModel)

    const result = await PostModel.purge(PostModel, aliceEnv, 1)
    expect(result).toBe(true)

    const alicePost = tables.demo_post.find((p) => p.id === 1)
    expect(alicePost).toBeUndefined()
  })

  it('fails bulk morph atomically if any record fails permWrite', async () => {
    const aliceEnv = createCtx(42, {}, getModel)

    // Bulk update attempting to modify both Post 1 (owned) and Post 2 (not owned)
    await expect(
      PostModel.morph(PostModel, aliceEnv, [1, 2], { title: 'Bulk Update' })
    ).rejects.toThrowError(AuthorizationError)

    // Assert that Post 1 was NOT modified (atomic failure)
    const post1 = tables.demo_post.find((p) => p.id === 1)
    expect(post1?.title).toBe("Alice's Post")

    const post2 = tables.demo_post.find((p) => p.id === 2)
    expect(post2?.title).toBe("Bob's Post")
  })

  it('fails Recordset morph atomically when a record fails permWrite', async () => {
    const aliceEnv = createCtx(42, {}, getModel)

    // Recordset with Alice and Bob posts
    const recordset = new Recordset(PostModel, aliceEnv, [
      { id: 1, title: "Alice's Post", state: 'published', ownerId: 42 } as any,
      { id: 2, title: "Bob's Post", state: 'published', ownerId: 99 } as any,
    ])

    await expect(recordset.morph({ title: 'Recordset Title' })).rejects.toThrowError(
      AuthorizationError
    )

    // Neither post was mutated
    expect(tables.demo_post.find((p) => p.id === 1)?.title).toBe("Alice's Post")
    expect(tables.demo_post.find((p) => p.id === 2)?.title).toBe("Bob's Post")
  })

  it('allows superuser (uid === 1) to bypass record rules on morph and purge', async () => {
    const rootEnv = createCtx(1, {}, getModel)

    // Root can update Bob's post
    await expect(
      PostModel.morph(PostModel, rootEnv, 2, { title: 'Admin Override' })
    ).resolves.toBe(true)
    expect(tables.demo_post.find((p) => p.id === 2)?.title).toBe('Admin Override')

    // Root can delete Bob's post
    await expect(PostModel.purge(PostModel, rootEnv, 2)).resolves.toBe(true)
    expect(tables.demo_post.find((p) => p.id === 2)).toBeUndefined()
  })

  it('enforces Comodel permWrite during O2M relational clearing (cmd 5 & cmd 6)', async () => {
    // Add write rule on CommentModel: only author can edit comments
    tables.mx_rule.push({
      id: 4,
      model_id: 101,
      name: 'Only author can edit comment',
      domain_force: '[["author_id", "=", "$user.id"]]',
      perm_read: false,
      perm_write: true,
      perm_create: false,
      perm_unlink: false,
    })
    tables.mx_rule_vx_role_rel.push({ rule_id: 4, role_id: 10 })

    const aliceEnv = createCtx(42, {}, getModel)

    // Alice owns Post 1. Let's add Bob's comment to Post 1
    tables.demo_comment.push({
      id: 30,
      content: "Bob's comment on Alice's post",
      post_id: 1,
      author_id: 99, // Bob is author
      is_active: true,
    })

    // Alice attempts to clear Post 1 comments (O2M cmd 5)
    // This unlinks comment 10 (Alice owns) and comment 30 (Bob owns)
    // Comment 30 should fail permWrite because Alice is not author_id 99!
    await expect(
      PostModel.morph(PostModel, aliceEnv, 1, {
        comments: [[5, 0, 0]],
      })
    ).rejects.toThrowError(AuthorizationError)
  })
})
