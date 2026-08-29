/**
 * ◈ MoonWitness — Design Token React Hooks
 * 
 * Standard React hooks for accessing design tokens in components.
 * 
 * @module @workspace/ui/hooks/use-design-tokens
 */

import { useMemo } from 'react';
import { ThemeColorVars } from '../tokens/design-tokens';

export function useThemeColor(name: keyof typeof ThemeColorVars): string {
  return useMemo(() => {
    return ThemeColorVars[name] || ThemeColorVars.primary;
  }, [name]);
}
