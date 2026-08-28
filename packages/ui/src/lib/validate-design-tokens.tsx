/**
 * ◈ MoonWitness OS — Design Token Validation Utilities
 * 
 * Runtime validation utilities to ensure compliance with design token standards.
 * Use these in development to catch violations early.
 * 
 * @module @workspace/ui/lib/validate-design-tokens
 */

import { CyberColors, type CyberColorKey } from '../tokens/design-tokens';

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * COLOR VALIDATION
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

/** Valid hex color pattern */
const HEX_COLOR_PATTERN = /^#[0-9A-F]{6}$/i;

/** Valid CSS variable pattern */
const CSS_VAR_PATTERN = /^var\(--[\w-]+\)$/;

/**
 * Check if a color value is a valid cyber color token
 */
export function isValidCyberColor(color: string): boolean {
  return Object.values(CyberColors).includes(color as any);
}

/**
 * Check if a color string uses proper token format (hex or CSS var)
 */
export function isValidColorFormat(color: string): boolean {
  return HEX_COLOR_PATTERN.test(color) || CSS_VAR_PATTERN.test(color);
}

/**
 * Validate that a color is using design tokens, not inline hex
 * @throws Error if inline hex is detected
 */
export function assertTokenColor(color: string, context?: string): void {
  if (HEX_COLOR_PATTERN.test(color) && !isValidCyberColor(color)) {
    const message = context 
      ? `Inline hex color detected in ${context}: ${color}. Use design tokens instead.`
      : `Inline hex color detected: ${color}. Use design tokens instead.`;
    
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️ [Design Token Violation]', message);
    }
    throw new Error(message);
  }
}

/**
 * Extract hex colors from a string (useful for scanning)
 */
export function extractHexColors(text: string): string[] {
  const matches = text.match(/#[0-9A-F]{6}/gi);
  return matches ? [...new Set(matches)] : [];
}

/**
 * Validate that extracted colors are all valid cyber tokens
 */
export function validateExtractedColors(text: string): {
  valid: boolean;
  violations: string[];
} {
  const hexColors = extractHexColors(text);
  const violations = hexColors.filter(color => !isValidCyberColor(color));
  
  return {
    valid: violations.length === 0,
    violations,
  };
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * CLASS NAME VALIDATION
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

/** Legacy HUD prefixes that should not be used */
const LEGACY_PREFIXES = ['hud-', 'HUD', 'hudClip', 'hudPanel', 'hudModal'];

/**
 * Check if a className contains legacy HUD prefixes
 */
export function hasLegacyPrefix(className: string): boolean {
  return LEGACY_PREFIXES.some(prefix => 
    className.toLowerCase().includes(prefix.toLowerCase())
  );
}

/**
 * Validate that className doesn't use legacy naming
 * @throws Error if legacy prefix is detected
 */
export function assertNoLegacyPrefix(className: string, context?: string): void {
  if (hasLegacyPrefix(className)) {
    const message = context
      ? `Legacy HUD prefix detected in ${context}: ${className}. Use enterprise naming instead.`
      : `Legacy HUD prefix detected: ${className}. Use enterprise naming instead.`;
    
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️ [Naming Convention Violation]', message);
    }
    throw new Error(message);
  }
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * COMPONENT NAME VALIDATION
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

/** Approved enterprise component names */
const APPROVED_COMPONENT_NAMES = [
  'ResourceTable',
  'Panel',
  'Modal',
  'ContextBlock',
  'Button',
  'BreadcrumbTrail',
  'ErrorBoundary',
  'Card',
  'Dialog',
  'Tabs',
  'Badge',
  'Progress',
  'Tooltip',
  'Input',
  'Label',
  'Table',
];

/**
 * Check if a component name follows enterprise standards
 */
export function isApprovedComponentName(name: string): boolean {
  return APPROVED_COMPONENT_NAMES.includes(name) || !name.startsWith('HUD');
}

/**
 * Validate component naming convention
 * @throws Error if legacy HUD prefix is used
 */
export function assertValidComponentName(name: string): void {
  if (name.startsWith('HUD') || name.startsWith('Hud')) {
    const message = `Legacy component name detected: ${name}. Remove HUD prefix and use enterprise naming.`;
    
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️ [Component Naming Violation]', message);
    }
    throw new Error(message);
  }
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * CHAMFER SIZE VALIDATION
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

/** Canonical chamfer sizes */
const CANONICAL_CHAMFER_SIZES = [6, 10, 16, 28];

/**
 * Check if a chamfer size is canonical
 */
export function isCanonicalChamferSize(size: number): boolean {
  return CANONICAL_CHAMFER_SIZES.includes(size);
}

/**
 * Validate chamfer size
 * @throws Warning if non-canonical size is used
 */
export function assertCanonicalChamfer(size: number, context?: string): void {
  if (!isCanonicalChamferSize(size)) {
    const message = context
      ? `Non-canonical chamfer size in ${context}: ${size}px. Use 6, 10, 16, or 28.`
      : `Non-canonical chamfer size: ${size}px. Use 6, 10, 16, or 28.`;
    
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️ [Chamfer Size Warning]', message);
    }
  }
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * COMPREHENSIVE VALIDATION SUITE
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export interface ValidationResult {
  valid: boolean;
  warnings: string[];
  errors: string[];
}

export interface ValidationOptions {
  checkColors?: boolean;
  checkLegacyNames?: boolean;
  checkComponentNames?: boolean;
  strict?: boolean;
}

/**
 * Comprehensive validation for a component's props
 */
export function validateComponentProps(
  props: Record<string, any>,
  componentName: string,
  options: ValidationOptions = {}
): ValidationResult {
  const {
    checkColors = true,
    checkLegacyNames = true,
    checkComponentNames = true,
    strict = false,
  } = options;

  const warnings: string[] = [];
  const errors: string[] = [];

  // Validate component name
  if (checkComponentNames) {
    try {
      assertValidComponentName(componentName);
    } catch (error) {
      (strict ? errors : warnings).push((error as Error).message);
    }
  }

  // Validate className prop
  if (checkLegacyNames && props.className) {
    try {
      assertNoLegacyPrefix(props.className, `${componentName}.className`);
    } catch (error) {
      (strict ? errors : warnings).push((error as Error).message);
    }
  }

  // Validate style prop colors
  if (checkColors && props.style) {
    const style = props.style;
    const colorProps = ['color', 'backgroundColor', 'borderColor', 'fill', 'stroke'];
    
    for (const prop of colorProps) {
      if (style[prop] && typeof style[prop] === 'string') {
        try {
          assertTokenColor(style[prop], `${componentName}.style.${prop}`);
        } catch (error) {
          (strict ? errors : warnings).push((error as Error).message);
        }
      }
    }
  }

  return {
    valid: errors.length === 0 && (strict ? warnings.length === 0 : true),
    warnings,
    errors,
  };
}

/**
 * Development-only validation wrapper for components
 */
export function withTokenValidation<P extends Record<string, any>>(
  Component: React.ComponentType<P>,
  options?: ValidationOptions
): React.ComponentType<P> {
  if (process.env.NODE_ENV !== 'development') {
    return Component;
  }

  const componentName = Component.displayName || Component.name || 'Component';

  return function ValidatedComponent(props: P) {
    const result = validateComponentProps(props, componentName, options);
    
    if (result.warnings.length > 0) {
      console.warn(`⚠️ [${componentName}] Design Token Warnings:`, result.warnings);
    }
    
    if (result.errors.length > 0) {
      console.error(`❌ [${componentName}] Design Token Errors:`, result.errors);
    }

    return <Component {...props} />;
  };
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * FILE CONTENT VALIDATION (for build-time scanning)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export interface FileValidationResult extends ValidationResult {
  file: string;
  colorViolations: string[];
  legacyNames: string[];
}

/**
 * Validate file content for design token compliance
 */
export function validateFileContent(
  content: string,
  filePath: string
): FileValidationResult {
  const warnings: string[] = [];
  const errors: string[] = [];
  
  // Check for inline hex colors
  const colorValidation = validateExtractedColors(content);
  if (!colorValidation.valid) {
    warnings.push(`Found ${colorValidation.violations.length} inline hex colors`);
  }

  // Check for legacy HUD prefixes
  const legacyMatches = LEGACY_PREFIXES.filter(prefix => 
    content.includes(prefix)
  );

  if (legacyMatches.length > 0) {
    warnings.push(`Found legacy naming: ${legacyMatches.join(', ')}`);
  }

  return {
    file: filePath,
    valid: errors.length === 0,
    warnings,
    errors,
    colorViolations: colorValidation.violations,
    legacyNames: legacyMatches,
  };
}
