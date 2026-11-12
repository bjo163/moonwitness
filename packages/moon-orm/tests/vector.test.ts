import { describe, expect, it } from 'vitest'
import { Vertex, fields, setDialect, getDialect, isPg, isSqlite, supportsVectors, mapColumnType, createCtx } from '../src/index.js'

// Test model with vector field
class VectorTestModel extends Vertex {
  static override _name = 'vector_test_model'
  static override _table = 'vector_test_model'
  static override _description = 'Vector Test Model'
  
  id = fields.Integer({ required: true, unique: true })
  name = fields.Char({ size: 100 })
  embedding = fields.Vector({ dim: 1536 })
}

describe('Vector field and pgvector support', () => {
  describe('Dialect detection', () => {
    it('detects postgres dialect from URL', () => {
      setDialect('pg')
      expect(getDialect()).toBe('pg')
      expect(isPg()).toBe(true)
      expect(isSqlite()).toBe(false)
      expect(supportsVectors()).toBe(true)
    })

    it('detects sqlite dialect from URL', () => {
      setDialect('sqlite')
      expect(getDialect()).toBe('sqlite')
      expect(isPg()).toBe(false)
      expect(isSqlite()).toBe(true)
      expect(supportsVectors()).toBe(false)
      setDialect('pg') // reset
    })

    it('rejects vector searches on SQLite instead of returning an empty result', async () => {
      setDialect('sqlite')
      try {
        await expect(
          VectorTestModel.similarityScan(
            VectorTestModel,
            createCtx(1),
            'embedding',
            [1, 0, 0]
          )
        ).rejects.toThrow(
          'Vector similarity search requires PostgreSQL with pgvector'
        )
      } finally {
        setDialect('pg')
      }
    })
  })

  describe('Column type mapping', () => {
    it('maps vector to vector(dim) in PostgreSQL', () => {
      setDialect('pg')
      expect(mapColumnType('vector', { vectorDim: 1536 })).toBe('vector(1536)')
      expect(mapColumnType('vector', { vectorDim: 768 })).toBe('vector(768)')
      expect(mapColumnType('vector')).toBe('vector(1536)') // default
    })

    it('maps vector to text in SQLite (fallback)', () => {
      setDialect('sqlite')
      expect(mapColumnType('vector', { vectorDim: 1536 })).toBe('text')
    })
  })

  describe('Vector field definition', () => {
    it('defines vector field with dimension', () => {
      const fieldDef = fields.Vector({ dim: 1536 })
      expect(fieldDef.type).toBe('vector')
      expect(fieldDef.dim).toBe(1536)
    })

    it('defines vector field with custom dimension', () => {
      const fieldDef = fields.Vector({ dim: 768 })
      expect(fieldDef.dim).toBe(768)
    })

    it('vector field appears in model field definitions', () => {
      const fieldDefs = VectorTestModel.getFieldDefs(VectorTestModel)
      expect(fieldDefs.embedding).toBeDefined()
      expect(fieldDefs.embedding.type).toBe('vector')
      expect(fieldDefs.embedding.dim).toBe(1536)
    })
  })

  // Note: Full integration tests require a running PostgreSQL with pgvector
  // These are structural validation tests
})
