export type AssessmentMethod = 'general' | 'general_limited' | 'prophetic'

export interface MethodInput {
  generalSufficient: boolean
  balanceSatisfied: boolean
  internalReferenceVerified: boolean
}

export interface MethodDecision {
  method: AssessmentMethod
  limitation?: string
}

export const PRIMARY_FILTERS = [
  'No Prejudice',
  'No Coercion',
  'No Gender Discrimination',
  'No Degradation'
] as const

export function chooseMethod(input: MethodInput): MethodDecision {
  if (input.generalSufficient) return { method: 'general' }

  if (input.balanceSatisfied && input.internalReferenceVerified) {
    return { method: 'prophetic' }
  }

  return {
    method: 'general_limited',
    limitation: input.balanceSatisfied
      ? 'Internal reference is not verified.'
      : 'A material balance condition is not established.'
  }
}
