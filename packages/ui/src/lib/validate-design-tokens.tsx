/**
 * ◈ MoonWitness — Design Token Validation Utilities
 * 
 * Runtime validation utilities to ensure compliance with enterprise design token standards.
 * 
 * @module @workspace/ui/lib/validate-design-tokens
 */

/** Valid CSS variable pattern */
const CSS_VAR_PATTERN = /^var\(--[\w-]+\)$/;

/**
 * Check if a color string uses proper CSS variable format
 */
export function isValidColorFormat(color: string): boolean {
  return CSS_VAR_PATTERN.test(color);
}

export function validateComponentProps(
  props: Record<string, any>,
  componentName: string
): { valid: boolean; warnings: string[] } {
  const warnings: string[] = [];

  if (props.className && typeof props.className === "string") {
    if (props.className.includes("HUD") || props.className.includes("hud-")) {
      warnings.push(`Legacy prefix detected in ${componentName}.className: ${props.className}`);
    }
  }

  return {
    valid: warnings.length === 0,
    warnings,
  };
}
