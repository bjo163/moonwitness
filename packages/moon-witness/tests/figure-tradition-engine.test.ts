import { describe, expect, it } from 'vitest'
import {
  createFigureAnalysisModule,
  createTraditionTransmissionModule,
  validateFigureAnalysisInput,
  validateTraditionAnalysisInput
} from '../src/engines/figure-tradition.js'

describe('Figure and Tradition engine contracts (#59)', () => {
  it('requires one canonical Figure target', () => {
    expect(validateFigureAnalysisInput({ figureId: 1 }).ok).toBe(true)
    expect(validateFigureAnalysisInput({ entityId: 2 }).ok).toBe(true)
    expect(validateFigureAnalysisInput({}).ok).toBe(false)
    expect(validateFigureAnalysisInput({ figureId: 1, entityId: 2 }).ok).toBe(false)
  })

  it('requires one Tradition target without assuming it is Hadith', () => {
    expect(validateTraditionAnalysisInput({ unitId: 1 }).ok).toBe(true)
    expect(validateTraditionAnalysisInput({ reference: 'rabbinic:berakhot:1' }).ok).toBe(true)
    expect(validateTraditionAnalysisInput({ figureId: 0 }).ok).toBe(false)
    expect(validateTraditionAnalysisInput({ unitId: 1, reference: 'duplicate' }).ok).toBe(false)
  })

  it('registers deterministic versioned modules', () => {
    expect(createFigureAnalysisModule()).toMatchObject({ code: 'figure.analysis', version: '1.0.0', deterministic: true })
    expect(createTraditionTransmissionModule()).toMatchObject({ code: 'tradition.transmission', version: '1.0.0', deterministic: true })
  })
})
