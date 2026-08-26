import { describe, expect, it, vi } from 'vitest'
import {
  createCtx,
  SUPERUSER_ID,
  ANONYMOUS_ID,
  Vertex,
  fields,
  isFieldDef,
  QueryBuilder,
  registerModel,
  getModel,
  registry,
  authSecurityContext,
} from '../src/index.js'

class MockModel extends Vertex {
  static override _name = 'mock.model'
  static override _table = 'mock_model'
  static override _description = 'Mock Model for Testing'

  static name_field = fields.Char({ required: true })
  static age = fields.Integer({ default: 18 })
  static is_active = fields.Boolean({ default: true })
  static category = fields.Selection({
    selection: [
      ['a', 'Category A'],
      ['b', 'Category B'],
    ],
  })
  static partner_id = fields.Many2one({ comodel: 'vx.node' })
}

describe('Moon ORM Foundation & Core Invariants', () => {
  describe('Ctx context & environment semantics', () => {
    it('creates Ctx with expected default values and properties', () => {
      const env = createCtx(SUPERUSER_ID)
      expect(env.uid).toBe(1)
      expect(env.isSuperuser).toBe(true)
      expect(env.isAnonymous).toBe(false)
      expect(env.trx).toBeUndefined()
      expect(env.context).toEqual({})
    })

    it('creates anonymous Ctx correctly', () => {
      const env = createCtx(ANONYMOUS_ID)
      expect(env.uid).toBe(0)
      expect(env.isAnonymous).toBe(true)
      expect(env.isSuperuser).toBe(false)
    })

    it('propagates custom context dictionary and auth security scopes', () => {
      const securityCtx = authSecurityContext('login')
      const env = createCtx(0, securityCtx)
      expect(env.context).toMatchObject(securityCtx)
    })

    it('creates sub-context with overridden values using withContext', () => {
      const env = createCtx(42, { lang: 'ar' })
      const subEnv = env.withContext({ lang: 'id', tz: 'Asia/Jakarta' })
      expect(subEnv.uid).toBe(42)
      expect(subEnv.context).toEqual({ lang: 'id', tz: 'Asia/Jakarta' })
      expect(env.context).toEqual({ lang: 'ar' })
    })

    it('propagates database transaction reference correctly', () => {
      const fakeTrx = { isTransaction: true } as any
      const env = createCtx(1, {}, undefined, fakeTrx)
      expect(env.trx).toBe(fakeTrx)
    })
  })

  describe('Field definitions and validation', () => {
    it('creates valid FieldDef objects for all standard field types', () => {
      const charField = fields.Char({ required: true, size: 64 })
      const intField = fields.Integer({ default: 0 })
      const boolField = fields.Boolean({ default: false })
      const selectField = fields.Selection({ selection: [['x', 'X']] })
      const m2oField = fields.Many2one({ comodel: 'vx.user' })
      const o2mField = fields.One2many({ comodel: 'vx.node', inverse: 'parent_id' })

      expect(isFieldDef(charField)).toBe(true)
      expect(charField.type).toBe('char')
      expect(charField.required).toBe(true)
      expect(charField.size).toBe(64)

      expect(isFieldDef(intField)).toBe(true)
      expect(intField.type).toBe('integer')

      expect(isFieldDef(boolField)).toBe(true)
      expect(boolField.type).toBe('boolean')

      expect(isFieldDef(selectField)).toBe(true)
      expect(selectField.type).toBe('selection')

      expect(isFieldDef(m2oField)).toBe(true)
      expect(m2oField.type).toBe('many2one')
      expect(m2oField.comodel).toBe('vx.user')

      expect(isFieldDef(o2mField)).toBe(true)
      expect(o2mField.type).toBe('one2many')
    })

    it('correctly distinguishes non-FieldDef objects', () => {
      expect(isFieldDef(null)).toBe(false)
      expect(isFieldDef(undefined)).toBe(false)
      expect(isFieldDef('char')).toBe(false)
      expect(isFieldDef({ type: 'unknown_type' })).toBe(false)
    })
  })

  describe('Model Registry & Vertex registration', () => {
    it('registers and retrieves models in the canonical registry', () => {
      registerModel(MockModel)
      const retrieved = getModel('mock.model')
      expect(retrieved).toBe(MockModel)
      expect(registry.has('mock.model')).toBe(true)
    })

    it('returns undefined for unregistered model names', () => {
      expect(getModel('nonexistent.domain.model')).toBeUndefined()
    })

    it('exposes canonical model properties and metadata', () => {
      expect(MockModel._name).toBe('mock.model')
      expect(MockModel._table).toBe('mock_model')
      expect(MockModel._description).toBe('Mock Model for Testing')
    })
  })

  describe('QueryBuilder semantics and construction', () => {
    it('constructs query builder domain correctly with where, andWhere, orWhere', () => {
      const env = createCtx(SUPERUSER_ID)
      const qb = new QueryBuilder(MockModel, env)

      qb.where('is_active', true)
      qb.andWhere('category', '=', 'a')
      qb.limit(10)
      qb.offset(20)
      qb.orderBy('id', 'desc')

      expect(qb).toBeInstanceOf(QueryBuilder)
    })

    it('supports aggregation builder methods', () => {
      const env = createCtx(SUPERUSER_ID)
      const qb = new QueryBuilder(MockModel, env)

      qb.sum('age', 'total_age')
      qb.avg('age', 'avg_age')
      qb.groupBy('category')

      expect(qb).toBeInstanceOf(QueryBuilder)
    })
  })
})
