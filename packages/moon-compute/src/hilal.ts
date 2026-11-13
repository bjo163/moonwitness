/**
 * ◈ @moon/compute — Hilal (Crescent Moon) Visibility Evaluation Engine
 *
 * Implements authoritative observational criteria:
 * 1. MABIMS New Criteria (2021/2022): Altitude >= 3.0°, Elongation >= 6.4°
 * 2. Mohammad Odeh Criteria (2006): Empirical topocentric polynomial model
 *
 * Isomorphic: runs in Node.js, Bun, Edge, and browser runtimes.
 */

export interface MabimsCriterion {
  status: "PASS" | "FAIL"
  description: string
  passed: boolean
}

export interface OdehCriterion {
  category: "A" | "B" | "C" | "D"
  description: string
  v_value: number
}

export interface HilalVisibilityEvaluation {
  altitude_deg: number
  altitude_degrees?: number
  elongation_deg: number
  elongation_degrees?: number
  crescent_width_arcmin?: number | null
  mabims_criterion: MabimsCriterion
  mabims_visible?: boolean
  mabims_status?: string
  odeh_criterion: OdehCriterion
  odeh_classification?: "A" | "B" | "C" | "D"
  odeh_v_value?: number
  odeh_description?: string
  overall_verdict: string
}

/**
 * Evaluates whether the young crescent moon is optically or naked-eye visible
 * following sunset for Islamic lunar calendar month commencement (Rukyah Hilal).
 */
export function evaluateHilalVisibility(
  altitudeDegrees: number,
  elongationDegrees: number,
  crescentWidthArcmin: number = 0.5
): HilalVisibilityEvaluation {
  const alt = parseFloat(altitudeDegrees.toFixed(2))
  const elong = parseFloat(elongationDegrees.toFixed(2))
  const width = crescentWidthArcmin ? parseFloat(crescentWidthArcmin.toFixed(2)) : 0.5

  // 1. MABIMS Criteria (Altitude >= 3.0°, Elongation >= 6.4°)
  const altPass = alt >= 3.0
  const elongPass = elong >= 6.4
  const mabimsPassed = altPass && elongPass

  let mabimsDescription = ""
  if (mabimsPassed) {
    mabimsDescription = "CRITERIA_MET (Hilal Likely Visible under MABIMS standard)"
  } else {
    const reasons: string[] = []
    if (!altPass) reasons.push(`Altitude ${alt}° < 3.0°`)
    if (!elongPass) reasons.push(`Elongation ${elong}° < 6.4°`)
    mabimsDescription = `CRITERIA_UNMET (${reasons.join(", ")})`
  }

  const mabimsCriterion: MabimsCriterion = {
    status: mabimsPassed ? "PASS" : "FAIL",
    description: mabimsDescription,
    passed: mabimsPassed,
  }

  // 2. Mohammad Odeh (2006) Criterion
  // V = ARCV - (-0.1018*ARCL^3 + 0.7319*ARCL^2 - 6.3226*ARCL + 7.1651)
  const arcvArcmin = alt * 60.0
  const arcl = elong
  const poly =
    -0.1018 * Math.pow(arcl, 3) +
    0.7319 * Math.pow(arcl, 2) -
    6.3226 * arcl +
    7.1651
  const vValue = parseFloat((arcvArcmin - poly).toFixed(2))

  let odehCategory: "A" | "B" | "C" | "D"
  let odehDescription = ""

  if (vValue >= 5.65) {
    odehCategory = "A"
    odehDescription = "Crescent easily visible to naked eye"
  } else if (vValue >= 2.0) {
    odehCategory = "B"
    odehDescription = "Crescent visible to naked eye under clear skies; easily with optical aid"
  } else if (vValue >= -0.16) {
    odehCategory = "C"
    odehDescription = "Crescent visible only with telescope or optical aid"
  } else {
    odehCategory = "D"
    odehDescription = "Crescent not visible even with optical aid (Below Danjon limit)"
  }

  const odehCriterion: OdehCriterion = {
    category: odehCategory,
    description: odehDescription,
    v_value: vValue,
  }

  const overallVerdict = mabimsPassed
    ? `VISIBILITY_CONFIRMED: MABIMS Met (${odehCategory} - ${odehDescription})`
    : `VISIBILITY_UNLIKELY: MABIMS Unmet (${odehCategory} - ${odehDescription})`

  return {
    altitude_deg: alt,
    altitude_degrees: alt,
    elongation_deg: elong,
    elongation_degrees: elong,
    crescent_width_arcmin: width,
    mabims_criterion: mabimsCriterion,
    mabims_visible: mabimsPassed,
    mabims_status: mabimsDescription,
    odeh_criterion: odehCriterion,
    odeh_classification: odehCategory,
    odeh_v_value: vValue,
    odeh_description: odehDescription,
    overall_verdict: overallVerdict,
  }
}
