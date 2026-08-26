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

  orderBy(_col: string, _dir?: string): this {
    return this
  }

  limit(_limit: number): this {
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
  dbFn.raw = (sql: string, _bindings?: any[]) => sql
  dbFn.transaction = async (cb: (trx: any) => Promise<any>) => {
    // Snapshot tables for transaction rollback
    const snapshot: Tables = {}
    for (const [k, v] of Object.entries(tables)) {
      snapshot[k] = v.map((row) => ({ ...row }))
    }
    const trxFn: any = (table: string) => new FakeDbQuery(table, tables)
    trxFn.raw = dbFn.raw
    try {
      return await cb(trxFn)
    } catch (err) {
      // Rollback tables to snapshot
      for (const k of Object.keys(tables)) {
        delete tables[k]
      }
      for (const [k, v] of Object.entries(snapshot)) {
        tables[k] = v.map((row) => ({ ...row }))
      }
      throw err
    }
  }
  return dbFn
}

class TagModel extends Vertex {
  static _name = 'demo.tag'
  name = fields.Char({ required: true })
  isSecret = fields.Boolean({ default: false })
}

class PostModel extends Vertex {
  static _name = 'demo.post'
  static override _rec_name = 'title'
  title = fields.Char({ required: true })
  state = fields.Char({ default: 'draft' })
  ownerId = fields.Integer()
  comments = fields.One2many({ comodel: 'demo.comment', relation: 'postId' })
  tags = fields.Many2many({ comodel: 'demo.tag', relation: 'demo_post_demo_tag_rel' })
}

class CommentModel extends Vertex {
  static _name = 'demo.comment'
  content = fields.Char({ required: true })
  postId = fields.Many2one({ comodel: 'demo.post' })
  authorId = fields.Integer()
}

describe('Issue #28: Operation-Specific ORM Authorization', () => {
  let tables: Tables
  const models: Record<string, typeof Vertex> = {
    'demo.post': PostModel,
    'demo.comment': CommentModel,
    'demo.tag': TagModel,
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
        { id: 102, model: 'demo.tag' },
      ],
      mx_grant: [
        // Role 10 has full model permissions on demo.post, demo.comment, demo.tag
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
        {
          model_id: 102,
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
        { rule_id: 6, role_id: 10 },
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
        // Rule 6: Tag read rule -> role 10 can only access non-secret tags
        {
          id: 6,
          model_id: 102,
          name: 'Non-secret tags only',
          domain_force: '[["is_secret", "=", false]]',
          perm_read: true,
          perm_write: true,
          perm_create: true,
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
      demo_tag: [
        { id: 101, name: 'Public Tag', is_secret: false, is_active: true },
        { id: 102, name: 'Confidential Tag', is_secret: true, is_active: true },
      ],
      demo_post_demo_tag_rel: [
        { demo_post_id: 1, demo_tag_id: 101 },
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

  it('pick() fails closed when requested record is blocked by record rules', async () => {
    // Add draft post owned by Bob
    tables.demo_post.push({
      id: 3,
      title: "Bob's Secret Draft",
      state: 'draft',
      owner_id: 99,
      is_active: true,
    })

    const aliceEnv = createCtx(42, {}, getModel)

    // Alice cannot pick Post 3 because state !== 'published'
    await expect(PostModel.pick(PostModel, aliceEnv, 3)).rejects.toThrowError(
      AuthorizationError
    )
  })

  it('label() suppresses names of records denied by record rules', async () => {
    // Add draft post owned by Bob
    tables.demo_post.push({
      id: 4,
      title: "Bob's Confidential Project",
      state: 'draft',
      owner_id: 99,
      is_active: true,
    })

    const aliceEnv = createCtx(42, {}, getModel)

    // Alice queries label for Post 4 (forbidden) and Post 1 (allowed)
    const labels = await PostModel.label(PostModel, aliceEnv, [1, 4])
    expect(labels.length).toBe(1)
    expect(labels[0]).toEqual([1, "Alice's Post"])
    // Post 4 was not leaked!
  })

  it('many2one hydration suppresses labels when comodel record is inaccessible', async () => {
    // Add Many2one field to CommentModel
    tables.demo_comment.push({
      id: 50,
      content: 'Comment pointing to secret post',
      post_id: 5, // Secret post
      author_id: 42,
      is_active: true,
    })
    tables.demo_post.push({
      id: 5,
      title: 'Top Secret Post',
      state: 'draft',
      owner_id: 99,
      is_active: true,
    })

    const aliceEnv = createCtx(42, {}, getModel)

    const comments = await CommentModel.fetch(CommentModel, aliceEnv, [['id', '=', 50]])
    expect(comments.length).toBe(1)
    // post_id should be false (redacted/suppressed) because Alice cannot read Post 5
    expect(comments[0].post_id).toBe(false)
  })

  it('spawn() fails and rolls back when new record violates permCreate record rule', async () => {
    // Add create rule on PostModel: can only create posts with state == 'draft'
    tables.mx_rule.push({
      id: 5,
      model_id: 100,
      name: 'Can only create draft posts',
      domain_force: '[["state", "=", "draft"]]',
      perm_read: false,
      perm_write: false,
      perm_create: true,
      perm_unlink: false,
    })
    tables.mx_rule_vx_role_rel.push({ rule_id: 5, role_id: 10 })

    const aliceEnv = createCtx(42, {}, getModel)

    // Alice attempts to spawn directly as 'published' (violates permCreate rule)
    await expect(
      PostModel.spawn(PostModel, aliceEnv, {
        title: 'Direct Publish Post',
        state: 'published',
        ownerId: 42,
      })
    ).rejects.toThrowError(AuthorizationError)

    // Verify record was deleted/rolled back
    expect(tables.demo_post.find((p) => p.title === 'Direct Publish Post')).toBeUndefined()
  })

  it('similarityScan() enforces record rules and excludes inaccessible high-similarity vectors', async () => {
    // Add vector-bearing posts
    tables.demo_post.push(
      { id: 10, title: 'Allowed Post', state: 'published', owner_id: 42, is_active: true },
      { id: 11, title: 'Secret Post', state: 'draft', owner_id: 99, is_active: true }
    )

    const aliceEnv = createCtx(42, {}, getModel)

    // Alice performs similarityScan
    const results = await PostModel.similarityScan(PostModel, aliceEnv, 'title', [0.1, 0.2])
    const resultIds = results.map((r: any) => r.id)

    expect(resultIds).toContain(10)
    expect(resultIds).not.toContain(11) // Secret Post 11 is excluded by record rules!
  })

  it('M2M cmd 3: denies unlinking forbidden relation target', async () => {
    const aliceEnv = createCtx(42, {}, getModel)

    // Alice attempts to unlink Tag 102 (confidential tag which Alice cannot read)
    await expect(
      PostModel.morph(PostModel, aliceEnv, 1, {
        tags: [[3, 102, 0]],
      })
    ).rejects.toThrowError(AuthorizationError)
  })

  it('M2M cmd 4: denies linking forbidden relation target', async () => {
    const aliceEnv = createCtx(42, {}, getModel)

    // Alice attempts to link Tag 102 (confidential tag)
    await expect(
      PostModel.morph(PostModel, aliceEnv, 1, {
        tags: [[4, 102, 0]],
      })
    ).rejects.toThrowError(AuthorizationError)

    // Verify Tag 102 was not linked to Post 1
    const links = tables.demo_post_demo_tag_rel.filter((r) => r.demo_post_id === 1)
    expect(links.some((r) => r.demo_tag_id === 102)).toBe(false)
  })

  it('M2M cmd 5: denies clearing relation when an existing link is forbidden', async () => {
    // Secret tag 102 is linked to Post 1
    tables.demo_post_demo_tag_rel.push({ demo_post_id: 1, demo_tag_id: 102 })

    const aliceEnv = createCtx(42, {}, getModel)

    // Alice attempts to clear all tags on Post 1
    await expect(
      PostModel.morph(PostModel, aliceEnv, 1, {
        tags: [[5, 0, 0]],
      })
    ).rejects.toThrowError(AuthorizationError)

    // Verify existing link to 101 was not removed (atomic failure)
    const links = tables.demo_post_demo_tag_rel.filter((r) => r.demo_post_id === 1)
    expect(links.some((r) => r.demo_tag_id === 101)).toBe(true)
  })

  it('M2M cmd 6: mixed authorized and forbidden replace fails atomically with zero partial mutation', async () => {
    const aliceEnv = createCtx(42, {}, getModel)

    // Alice attempts to replace tags with [101 (public), 102 (secret)]
    await expect(
      PostModel.morph(PostModel, aliceEnv, 1, {
        tags: [[6, 0, [101, 102]]],
      })
    ).rejects.toThrowError(AuthorizationError)

    // Assert that demo_post_demo_tag_rel remained untouched with only initial link 101
    const links = tables.demo_post_demo_tag_rel.filter((r) => r.demo_post_id === 1)
    expect(links.length).toBe(1)
    expect(links[0].demo_tag_id).toBe(101)
  })

  it('denied create with relational side effects rolls back completely with zero parent and child rows', async () => {
    // Rule: can only create posts with state == 'draft'
    tables.mx_rule.push({
      id: 7,
      model_id: 100,
      name: 'Can only create draft posts',
      domain_force: '[["state", "=", "draft"]]',
      perm_read: false,
      perm_write: false,
      perm_create: true,
      perm_unlink: false,
    })
    tables.mx_rule_vx_role_rel.push({ rule_id: 7, role_id: 10 })

    const aliceEnv = createCtx(42, {}, getModel)

    const initialCommentCount = tables.demo_comment.length
    const initialPostCount = tables.demo_post.length

    // Alice attempts to spawn Post with state 'published' AND a child comment in O2M cmd 0
    await expect(
      PostModel.spawn(PostModel, aliceEnv, {
        title: 'Forbidden Direct Publish',
        state: 'published',
        ownerId: 42,
        comments: [[0, 0, { content: 'Child comment during forbidden spawn', authorId: 42 }]],
      })
    ).rejects.toThrowError(AuthorizationError)

    // Complete atomicity / rollback assertion:
    // Zero parent post created
    expect(tables.demo_post.length).toBe(initialPostCount)
    expect(tables.demo_post.find((p) => p.title === 'Forbidden Direct Publish')).toBeUndefined()
    // Zero child comment created
    expect(tables.demo_comment.length).toBe(initialCommentCount)
    expect(tables.demo_comment.find((c) => c.content === 'Child comment during forbidden spawn')).toBeUndefined()
  })
})
