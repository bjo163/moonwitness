/**
 * ◈ MoonWitness OS — Design Token React Hooks
 * 
 * Type-safe React hooks for accessing design tokens in components.
 * Provides runtime validation and semantic token resolution.
 * 
 * @module @workspace/ui/hooks/use-design-tokens
 */

import { useMemo } from 'react';
import {
  CyberColors,
  CyberColorKey,
  SemanticColors,
  ClipPathClasses,
  GlowClasses,
  CornerClasses,
  SemanticCorners,
  LaserConduitClasses,
  GridClasses,
  getSemanticColor,
  getGlowShadow,
  getChamferPath,
  type GlowDepth,
  type ChamferSize,
} from '../tokens/design-tokens';

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * useCyberColor — Get cyber color by key or semantic name
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export type ColorType = 'cyber' | 'semantic';

export interface UseCyberColorOptions {
  type?: ColorType;
  name: CyberColorKey | keyof typeof SemanticColors;
}

/**
 * Hook to get a cyber color value
 * @example
 * const primaryColor = useCyberColor({ type: 'semantic', name: 'primary' });
 * const cyanColor = useCyberColor({ type: 'cyber', name: 'cyan' });
 */
export function useCyberColor(options: UseCyberColorOptions): string {
  const { type = 'cyber', name } = options;

  return useMemo(() => {
    if (type === 'semantic') {
      return getSemanticColor(name as keyof typeof SemanticColors);
    }
    return CyberColors[name as CyberColorKey];
  }, [type, name]);
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * useClipPath — Get clip-path CSS value for chamfered geometry
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export interface UseClipPathOptions {
  variant: ChamferSize | 'rune';
  className?: boolean;
}

export interface ClipPathResult {
  clipPath?: string;
  className?: string;
}

/**
 * Hook to get clip-path styles or className for chamfered corners
 * @example
 * const cardClip = useClipPath({ variant: 'card' });
 * const btnClipClass = useClipPath({ variant: 'button', className: true });
 */
export function useClipPath(options: UseClipPathOptions): ClipPathResult {
  const { variant, className = false } = options;

  return useMemo(() => {
    if (className) {
      return { className: ClipPathClasses[variant] };
    }
    
    const clipPathMap = {
      card: getChamferPath(16),
      hero: getChamferPath(28),
      button: getChamferPath(10),
      tag: getChamferPath(6),
      rune: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
    };
    
    return { clipPath: clipPathMap[variant] };
  }, [variant, className]);
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * useGlow — Get glow box-shadow styles
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export interface UseGlowOptions {
  color: CyberColorKey;
  depth?: GlowDepth;
  className?: boolean;
}

export interface GlowResult {
  boxShadow?: string;
  className?: string;
}

/**
 * Hook to get glow box-shadow styles or className
 * @example
 * const cyanGlow = useGlow({ color: 'cyan', depth: 'active' });
 * const glowClass = useGlow({ color: 'cyan', className: true });
 */
export function useGlow(options: UseGlowOptions): GlowResult {
  const { color, depth = 'active', className = false } = options;

  return useMemo(() => {
    if (className) {
      const classMap: Record<CyberColorKey, string | undefined> = {
        cyan: GlowClasses.cyan,
        green: GlowClasses.emerald,
        yellow: GlowClasses.amber,
        purple: GlowClasses.purple,
        pink: GlowClasses.pink,
        dark: undefined,
        panel: undefined,
      };
      return { className: classMap[color] };
    }
    
    return { boxShadow: getGlowShadow(color, depth) };
  }, [color, depth, className]);
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * useCornerBrackets — Get military corner bracket className
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export interface UseCornerBracketsOptions {
  variant: 'active' | 'success' | 'warning' | 'premium' | 'critical';
}

/**
 * Hook to get semantic corner bracket className
 * @example
 * const activeCorner = useCornerBrackets({ variant: 'active' }); // returns 'corner-cyan'
 */
export function useCornerBrackets(options: UseCornerBracketsOptions): string {
  const { variant } = options;
  return useMemo(() => SemanticCorners[variant], [variant]);
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * usePanelGlass — Get glassmorphism panel styles
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export interface PanelGlassStyles {
  backgroundColor: string;
  backdropFilter: string;
  border: string;
  boxShadow: string;
}

/**
 * Hook to get glassmorphism panel inline styles
 * @example
 * const glassStyles = usePanelGlass();
 * <div style={glassStyles}>...</div>
 */
export function usePanelGlass(): PanelGlassStyles {
  return useMemo(() => ({
    backgroundColor: 'color-mix(in srgb, var(--cyber-dark) 85%, transparent)',
    backdropFilter: 'blur(16px)',
    border: '1px solid color-mix(in srgb, var(--cyber-cyan) 25%, transparent)',
    boxShadow: '0 0 20px color-mix(in srgb, var(--cyber-cyan) 10%, transparent)',
  }), []);
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * useCosmicGrid — Get cosmic grid background className
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export interface UseCosmicGridOptions {
  variant: 'cosmic' | 'dense';
}

/**
 * Hook to get cosmic grid background className
 * @example
 * const gridClass = useCosmicGrid({ variant: 'cosmic' }); // returns 'bg-cosmic-grid'
 */
export function useCosmicGrid(options: UseCosmicGridOptions): string {
  const { variant } = options;
  return useMemo(() => GridClasses[variant], [variant]);
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * useLaserConduit — Get laser conduit divider className
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export interface UseLaserConduitOptions {
  color: keyof typeof LaserConduitClasses;
}

/**
 * Hook to get laser conduit divider className
 * @example
 * const conduit = useLaserConduit({ color: 'cyan' }); // returns 'laser-conduit-cyan'
 */
export function useLaserConduit(options: UseLaserConduitOptions): string {
  const { color } = options;
  return useMemo(() => LaserConduitClasses[color], [color]);
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * useSemanticTokens — Comprehensive semantic token access
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export type SemanticIntent = 'primary' | 'success' | 'warning' | 'premium' | 'danger';

export interface SemanticTokens {
  color: string;
  glowClass: string;
  cornerClass: string;
  conduitClass: string;
}

/**
 * Comprehensive hook to get all semantic tokens for a given intent
 * @example
 * const primary = useSemanticTokens('primary');
 * // { color: 'var(--cyber-cyan)', glowClass: 'glow-cyan', cornerClass: 'corner-cyan', ... }
 */
export function useSemanticTokens(intent: SemanticIntent): SemanticTokens {
  return useMemo(() => {
    const tokenMap: Record<SemanticIntent, SemanticTokens> = {
      primary: {
        color: CyberColors.cyan,
        glowClass: GlowClasses.cyan,
        cornerClass: CornerClasses.cyan,
        conduitClass: LaserConduitClasses.cyan,
      },
      success: {
        color: CyberColors.green,
        glowClass: GlowClasses.emerald,
        cornerClass: CornerClasses.green,
        conduitClass: LaserConduitClasses.green,
      },
      warning: {
        color: CyberColors.yellow,
        glowClass: GlowClasses.amber,
        cornerClass: CornerClasses.yellow,
        conduitClass: LaserConduitClasses.yellow,
      },
      premium: {
        color: CyberColors.purple,
        glowClass: GlowClasses.purple,
        cornerClass: CornerClasses.purple,
        conduitClass: LaserConduitClasses.purple,
      },
      danger: {
        color: CyberColors.pink,
        glowClass: GlowClasses.pink,
        cornerClass: CornerClasses.pink,
        conduitClass: LaserConduitClasses.cyan, // fallback to cyan
      },
    };

    return tokenMap[intent];
  }, [intent]);
}
