/**
 * ◈ MoonWitness — Design Token React Hooks
 *
 * Standard React hooks for accessing design tokens in components.
 *
 * @module @workspace/ui/hooks/use-design-tokens
 */

import { useMemo } from "react"
import type { ThemeColorVarKey } from "../tokens/design-tokens"

export function useThemeColor(name: ThemeColorVarKey): string {
  return useMemo(() => {
    const cssName = name.replace(
      /[A-Z]/g,
      (letter) => `-${letter.toLowerCase()}`
    )
    return `var(--${cssName})`
  }, [name])
}
