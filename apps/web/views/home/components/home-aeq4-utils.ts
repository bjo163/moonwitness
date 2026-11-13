export function pad(n: number, len = 2) {
  return String(n).padStart(len, "0")
}

export function getLunarIcon(phase: number): string {
  if (phase < 0.06) return "🌑"
  if (phase < 0.25) return "🌒"
  if (phase < 0.3) return "🌓"
  if (phase < 0.48) return "🌔"
  if (phase < 0.55) return "🌕"
  if (phase < 0.73) return "🌖"
  if (phase < 0.78) return "🌗"
  return "🌘"
}
