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

export function isSemanticColorToken(value: string): value is SemanticColorToken {
  return value in COLOR_TOKENS
}

export const SEMANTIC_COLOR_TOKENS = Object.freeze({ ...COLOR_TOKENS })
