/** Type-safe hooks for structural design tokens. */

import { useMemo } from 'react';
import {
  ClipPathClasses,
  getChamferPath,
  GridClasses,
  LaserConduitClasses,
  PanelGlass,
  SemanticCorners,
  type ChamferSize,
} from '../tokens/design-tokens';

export interface UseClipPathOptions {
  variant: ChamferSize | 'rune';
  className?: boolean;
}

export interface ClipPathResult {
  clipPath?: string;
  className?: string;
}

export function useClipPath({ variant, className = false }: UseClipPathOptions): ClipPathResult {
  return useMemo(() => {
    if (className) return { className: ClipPathClasses[variant] };

    const size = variant === 'rune' ? undefined : { card: 16, hero: 28, button: 10, tag: 6 }[variant];
    return {
      clipPath: size === undefined
        ? 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)'
        : getChamferPath(size),
    };
  }, [variant, className]);
}

export interface UseCornerBracketsOptions {
  variant: keyof typeof SemanticCorners;
}

export function useCornerBrackets({ variant }: UseCornerBracketsOptions): string {
  return useMemo(() => SemanticCorners[variant], [variant]);
}

export type PanelGlassStyles = typeof PanelGlass;

export function usePanelGlass(): PanelGlassStyles {
  return useMemo(() => PanelGlass, []);
}

export interface UseCosmicGridOptions {
  variant: keyof typeof GridClasses;
}

export function useCosmicGrid({ variant }: UseCosmicGridOptions): string {
  return useMemo(() => GridClasses[variant], [variant]);
}

export interface UseLaserConduitOptions {
  color: keyof typeof LaserConduitClasses;
}

export function useLaserConduit({ color }: UseLaserConduitOptions): string {
  return useMemo(() => LaserConduitClasses[color], [color]);
}
