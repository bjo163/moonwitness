/**
 * ◈ MoonWitness OS — Design Token React Hooks
 * 
 * Standard React hooks for accessing design tokens in components.
 * 
 * @module @workspace/ui/hooks/use-design-tokens
 */

import { useMemo } from 'react';
import {
  ThemeColors,
  SemanticColors,
  ClipPathClasses,
  getSemanticColor,
  type ChamferSize,
} from '../tokens/design-tokens';

export type ColorType = 'theme' | 'semantic';

export interface UseThemeColorOptions {
  type?: ColorType;
  name: keyof typeof ThemeColors | keyof typeof SemanticColors;
}

export function useThemeColor(options: UseThemeColorOptions): string {
  const { type = 'semantic', name } = options;

  return useMemo(() => {
    if (type === 'semantic') {
      return getSemanticColor(name as keyof typeof SemanticColors);
    }
    return ThemeColors[name as keyof typeof ThemeColors] || ThemeColors.primary;
  }, [type, name]);
}

export const useCyberColor = useThemeColor;

export interface UseClipPathOptions {
  variant: ChamferSize | 'rune';
  className?: boolean;
}

export interface ClipPathResult {
  clipPath?: string;
  className?: string;
}

export function useClipPath(options: UseClipPathOptions): ClipPathResult {
  const { variant, className = false } = options;

  return useMemo(() => {
    if (className) {
      return { className: ClipPathClasses[variant] || 'rounded-xl' };
    }
    return { className: ClipPathClasses[variant] || 'rounded-xl' };
  }, [variant, className]);
}

export interface PanelGlassStyles {
  backgroundColor: string;
  backdropFilter: string;
  border: string;
  boxShadow: string;
}

export function usePanelGlass(): PanelGlassStyles {
  return useMemo(
    () => ({
      backgroundColor: 'var(--card)',
      backdropFilter: 'blur(16px)',
      border: '1px solid var(--border)',
      boxShadow: '0 4px 20px -1px rgba(0, 0, 0, 0.08)',
    }),
    []
  );
}

export function useCornerAccents(): string {
  return 'rounded-xl border border-border/40';
}
export const useCornerBrackets = useCornerAccents;
export function useLaserConduit(): string {
  return 'h-px w-full bg-border';
}
export function useCosmicGrid(): string {
  return '';
}
