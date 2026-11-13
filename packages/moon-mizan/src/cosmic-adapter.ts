export type CosmicAnalyticalResult = { modelOnly: true; divineVerdict: false; rgbl: { r: number; g: number; b: number; l: number }; magnitude: number; actionGates: number[]; impactVector: number[]; scaleInputs: number[]; quranicStatus: 'UNASSESSED'|'PROVISIONAL'|'ESTABLISHED'|'INSUFFICIENT_EVIDENCE'; sourceRevision: string; modelVersion: string }
export const CosmicAnalyticalResultSchema = { safeParse(input: unknown) { try { return { success: true as const, data: validate(input) } } catch (error) { return { success: false as const, error } } } }
function validate(input: unknown): CosmicAnalyticalResult { const x = input as any; if (!x || x.modelOnly !== true || x.divineVerdict !== false || !x.rgbl || !['UNASSESSED','PROVISIONAL','ESTABLISHED','INSUFFICIENT_EVIDENCE'].includes(x.quranicStatus) || ![x.actionGates,x.impactVector,x.scaleInputs].every((a) => Array.isArray(a)) || x.actionGates.length !== 9 || x.impactVector.length !== 13 || x.scaleInputs.length !== 15 || !x.sourceRevision || !x.modelVersion) throw new Error('Invalid Cosmic analytical result'); return x as CosmicAnalyticalResult }
export function adaptCosmicResult(input: unknown): CosmicAnalyticalResult {
  const parsed = CosmicAnalyticalResultSchema.safeParse(input)
  if (!parsed.success) throw new Error('Invalid Cosmic analytical result')
  return parsed.data
}
