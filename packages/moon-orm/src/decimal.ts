/** Exact, fixed-scale decimal values. Public values are strings; arithmetic uses bigint. */
export interface DecimalSpec { precision: number; scale: number }
export type RoundingMode = 'reject' | 'half-up' | 'half-even' | 'toward-zero'

export function validateDecimalSpec(spec: DecimalSpec): void {
  if (!Number.isInteger(spec.precision) || spec.precision < 1 || spec.precision > 38 ||
      !Number.isInteger(spec.scale) || spec.scale < 0 || spec.scale > spec.precision) {
    throw new RangeError('Decimal requires precision 1..38 and scale 0..precision')
  }
}

function assertUnits(units: bigint, spec: DecimalSpec): void {
  validateDecimalSpec(spec)
  if (typeof units !== 'bigint') throw new TypeError('Decimal units must be bigint')
  if ((units < 0n ? -units : units) >= 10n ** BigInt(spec.precision)) {
    throw new RangeError('Decimal precision overflow')
  }
}

export function decimalUnits(value: string, spec: DecimalSpec, rounding: RoundingMode = 'reject'): bigint {
  validateDecimalSpec(spec)
  if (!['reject', 'half-up', 'half-even', 'toward-zero'].includes(rounding)) throw new TypeError('Unsupported decimal rounding mode')
  if (typeof value !== 'string' || value.length > 128 || !/^-?\d+(?:\.\d+)?$/.test(value)) {
    throw new TypeError('Decimal must be a plain decimal string, without exponent or whitespace')
  }
  const negative = value.startsWith('-')
  const [whole, fraction = ''] = (negative ? value.slice(1) : value).split('.')
  const kept = fraction.slice(0, spec.scale).padEnd(spec.scale, '0')
  const discarded = fraction.slice(spec.scale)
  let units = BigInt(whole + kept)
  if (discarded && /[1-9]/.test(discarded)) {
    if (rounding === 'reject') throw new RangeError('Decimal exceeds the allowed scale')
    const first = discarded[0] ?? ''
    const greaterThanHalf = first > '5' || (first === '5' && /[1-9]/.test(discarded.slice(1)))
    const exactlyHalf = first === '5' && !/[1-9]/.test(discarded.slice(1))
    if ((rounding === 'half-up' && (greaterThanHalf || exactlyHalf)) ||
        (rounding === 'half-even' && (greaterThanHalf || (exactlyHalf && units % 2n === 1n)))) units += 1n
  }
  if (negative) units = -units
  assertUnits(units, spec)
  return units
}

export function decimalFromUnits(units: bigint, spec: DecimalSpec): string {
  assertUnits(units, spec)
  const digits = (units < 0n ? -units : units).toString().padStart(spec.scale + 1, '0')
  const magnitude = spec.scale === 0 ? digits : `${digits.slice(0, -spec.scale)}.${digits.slice(-spec.scale)}`
  return `${units < 0n ? '-' : ''}${magnitude}`
}

export function normalizeDecimal(value: string, spec: DecimalSpec, rounding: RoundingMode = 'reject'): string {
  return decimalFromUnits(decimalUnits(value, spec, rounding), spec)
}
export function addDecimal(left: string, right: string, spec: DecimalSpec): string {
  return decimalFromUnits(decimalUnits(left, spec) + decimalUnits(right, spec), spec)
}
export function subtractDecimal(left: string, right: string, spec: DecimalSpec): string {
  return decimalFromUnits(decimalUnits(left, spec) - decimalUnits(right, spec), spec)
}
export function compareDecimal(left: string, right: string, spec: DecimalSpec): -1 | 0 | 1 {
  const difference = decimalUnits(left, spec) - decimalUnits(right, spec)
  return difference < 0n ? -1 : difference > 0n ? 1 : 0
}
