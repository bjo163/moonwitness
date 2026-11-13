/**
 * Canonical color resolver for UI and domain visualizations.
 * UI code should pass semantic names; visualizations may pass a registered
 * domain token. Raw CSS colors are intentionally not accepted here.
 */
const COLOR_TOKENS = {
  primary: "var(--primary)",
  foreground: "var(--foreground)",
  muted: "var(--muted-foreground)",
  success: "var(--success)",
  warning: "var(--warning)",
  destructive: "var(--destructive)",
  info: "var(--info)",
  border: "var(--border)",
  "tajweed.madda": "var(--tajweed-madda)",
  "tajweed.qalaqah": "var(--tajweed-qalaqah)",
  "tajweed.idgham": "var(--tajweed-idgham)",
  "tajweed.ghunnah": "var(--tajweed-ghunnah)",
  "tajweed.ikhafa": "var(--tajweed-ikhafa)",
  "tajweed.iqlab": "var(--tajweed-iqlab)",
  "tajweed.silent": "var(--tajweed-silent)",
} as const

export type SemanticColorToken = keyof typeof COLOR_TOKENS

export function resolveSemanticColor(token: SemanticColorToken): string {
  return COLOR_TOKENS[token]
}

/** Resolves legacy/domain palette values at the UI boundary. Prefer semantic tokens for new code. */
const LEGACY_COLOR_MAP: Record<string, SemanticColorToken> = {
  "#00F0FF": "info",
  "#10B981": "success",
  "#F59E0B": "warning",
  "#F43F5E": "destructive",
  "#3B82F6": "primary",
  "#A855F7": "info",
  "#D946EF": "info",
  "#F97316": "warning",
}

export function resolveVisualizationColor(value: string): string {
  const token = LEGACY_COLOR_MAP[value.toUpperCase()]
  return token ? resolveSemanticColor(token) : value
}

export function isSemanticColorToken(value: string): value is SemanticColorToken {
  return value in COLOR_TOKENS
}

export const SEMANTIC_COLOR_TOKENS = Object.freeze({ ...COLOR_TOKENS })
