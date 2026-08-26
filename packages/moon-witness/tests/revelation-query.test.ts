import { describe, expect, it } from 'vitest'
import {
  createRevelationQueryModule,
  validateRevelationQueryInput,
  REVELATION_FAMILIES
} from '../src/engines/revelation-query.js'

describe('revelation query engine', () => {
  it('defines canonical revelation families', () => {
    expect(REVELATION_FAMILIES).toEqual(['QURAN', 'TAWRAT', 'ZABUR', 'INJIL'])
  })

  it('validates input parameters correctly', () => {
    // Valid input
    expect(validateRevelationQueryInput({ reference: 'Q:1:1' }).ok).toBe(true)
    expect(validateRevelationQueryInput({ passageId: 10 }).ok).toBe(true)
    expect(validateRevelationQueryInput({ entityId: 5 }).ok).toBe(true)

    // Multiple targets provided
    expect(validateRevelationQueryInput({ reference: 'Q:1:1', passageId: 10 }).ok).toBe(false)
    // No target provided
    expect(validateRevelationQueryInput({}).ok).toBe(false)
    // Invalid family
    expect(validateRevelationQueryInput({ reference: 'Q:1:1', family: 'INVALID' as any }).ok).toBe(false)
  })

  it('creates deterministic revelation query module with valid metadata', () => {
    const module = createRevelationQueryModule()
    expect(module.code).toBe('revelation.query')
    expect(module.version).toBe('1.0.0')
    expect(module.deterministic).toBe(true)
    expect(module.inputSchemaVersion).toBe('REVELATION_QUERY_INPUT_V1')
    expect(module.outputSchemaVersion).toBe('WITNESS_ENGINE_RESULT_V1')
    expect(typeof module.validateInput).toBe('function')
    expect(typeof module.resolveScope).toBe('function')
    expect(typeof module.execute).toBe('function')
    expect(typeof module.explain).toBe('function')
  })
})
