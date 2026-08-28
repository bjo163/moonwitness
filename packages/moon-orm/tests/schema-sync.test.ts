import { describe, expect, it } from 'vitest'
import { validateAutomaticAlteration } from '../src/index.ts'

describe('schema synchronization safety', () => {
  it('refuses automatic pgvector dimension changes', () => {
    expect(() => validateAutomaticAlteration('vector(768)', 'wx_entity', 'embedding'))
      .toThrow('Vector dimension change for wx_entity.embedding requires an explicit reviewed migration')
  })

  it('allows reversible scalar type alterations', () => {
    expect(() => validateAutomaticAlteration('varchar(255)', 'wx_entity', 'name')).not.toThrow()
  })
})
