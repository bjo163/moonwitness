"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "./button"
import { cn } from "../lib/utils"

export interface ThemeToggleProps extends React.HTMLAttributes<HTMLButtonElement> {
  className?: string
  size?: "default" | "sm" | "xs" | "icon" | "icon-sm"
}

export function ThemeToggle({ className, size = "icon-sm", ...props }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    const nextTheme = (resolvedTheme === "dark" || theme === "dark") ? "light" : "dark"
    setTheme(nextTheme)
  }

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size={size}
        className={cn("rounded-lg border-border/40 bg-card/60 text-muted-foreground", className)}
        aria-label="Toggle theme"
        disabled
      >
        <span className="size-4" />
      </Button>
    )
  }

  const isDark = resolvedTheme === "dark" || theme === "dark"

  return (
    <Button
      variant="outline"
      size={size}
      onClick={toggleTheme}
      className={cn(
        "relative rounded-lg border-border/40 bg-card/60 text-foreground transition-all hover:border-primary/50 hover:bg-accent",
        className
      )}
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      title={`Switch to ${isDark ? "Light" : "Dark"} Mode (Press D)`}
    >
      <Sun className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500" />
      <Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-primary" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

export const ModeToggle = ThemeToggle
