export type AssessmentMethod = 'general' | 'general_limited' | 'prophetic'

export interface MethodInput {
  generalSufficient: boolean
  balanceSatisfied: boolean
  internalReferenceVerified: boolean
}

export interface MethodDecision {
  method: AssessmentMethod
  phase: 'preview'
  eligibleForProphetic: boolean
  limitation?: string
}

export interface AssessmentInput extends MethodInput {
  primaryFilterPassed: boolean
  secondaryFilterPassed: boolean
  powerRightScore: number
  powerLeftScore: number
  propheticReferenceRelevant: boolean
  propheticReferenceWeight: number
  rating: number
}

export interface AssessmentDecision {
  method: AssessmentMethod
  phase: 'final'
  limitation?: string
  generalWeight: number
  propheticReferenceWeight: number
  totalWeight: number
}

export const PRIMARY_FILTERS = [
  'No Prejudice',
  'No Coercion',
  'No Gender Discrimination',
  'No Degradation'
] as const

export const SECONDARY_FILTERS = [
  'Underage Exclusion',
  'Female-Specific Consideration',
  'Maximum Rating: 4.5/5',
  'No Absolute Perfection'
] as const

export function chooseMethod(input: MethodInput): MethodDecision {
  if (input.generalSufficient) {
    return {
      method: 'general',
      phase: 'preview',
      eligibleForProphetic: false
    }
  }

  if (input.balanceSatisfied && input.internalReferenceVerified) {
    return {
      method: 'prophetic',
      phase: 'preview',
      eligibleForProphetic: true
    }
  }

  return {
    method: 'general_limited',
    phase: 'preview',
    eligibleForProphetic: false,
    limitation: input.balanceSatisfied
      ? 'Internal reference is not verified.'
      : 'A material balance condition is not established.'
  }
}

function assertScore(name: string, value: number, maximum: number) {
  if (!Number.isFinite(value) || value < 0 || value > maximum) {
    throw new Error(`${name} must be between 0 and ${maximum}.`)
  }
}

export function validateAssessment(input: AssessmentInput): AssessmentDecision {
  if (!input.primaryFilterPassed) {
    throw new Error('Primary Filter must pass before an assessment can be finalized.')
  }

  if (!input.secondaryFilterPassed) {
    throw new Error('Secondary Filter must pass before an assessment can be finalized.')
  }

  assertScore('Power Right score', input.powerRightScore, 10)
  assertScore('Power Left score', input.powerLeftScore, 7)
  assertScore('Prophetic reference weight', input.propheticReferenceWeight, 4)
  assertScore('Rating', input.rating, 4.5)

  const generalWeight = input.powerRightScore + input.powerLeftScore
  const referenceCanContribute =
    input.balanceSatisfied &&
    input.internalReferenceVerified &&
    input.propheticReferenceRelevant

  if (input.generalSufficient && input.propheticReferenceWeight > 0) {
    throw new Error('Prophetic weight cannot be added when the General Method is sufficient.')
  }

  if (input.propheticReferenceWeight > 0 && !referenceCanContribute) {
    throw new Error('Prophetic weight requires a material balance condition and a verified, relevant reference.')
  }

  if (input.generalSufficient) {
    return {
      method: 'general',
      phase: 'final',
      generalWeight,
      propheticReferenceWeight: 0,
      totalWeight: generalWeight
    }
  }

  if (input.propheticReferenceWeight > 0) {
    return {
      method: 'prophetic',
      phase: 'final',
      generalWeight,
      propheticReferenceWeight: input.propheticReferenceWeight,
      totalWeight: generalWeight + input.propheticReferenceWeight
    }
  }

  return {
    method: 'general_limited',
    phase: 'final',
    generalWeight,
    propheticReferenceWeight: 0,
    totalWeight: generalWeight,
    limitation: input.balanceSatisfied
      ? input.internalReferenceVerified
        ? 'A verified reference does not provide sufficient assessment value.'
        : 'Internal reference is not verified.'
      : 'A material balance condition is not established.'
  }
}
