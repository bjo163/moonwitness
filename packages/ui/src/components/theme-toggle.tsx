"use client"

import * as React from "react"
import { Moon, Sun, Laptop } from "lucide-react"
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

  const cycleTheme = () => {
    if (theme === "system") {
      setTheme("light")
    } else if (theme === "light") {
      setTheme("dark")
    } else {
      setTheme("system")
    }
  }

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size={size}
        className={cn("rounded-lg border-border bg-card text-muted-foreground", className)}
        aria-label="Toggle theme"
        disabled
      >
        <span className="size-4" />
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      size={size}
      onClick={cycleTheme}
      className={cn(
        "relative rounded-lg border-border bg-card text-foreground transition-all hover:bg-accent hover:text-accent-foreground",
        className
      )}
      aria-label={`Theme: ${theme}. Click to switch theme (Light / Dark / System)`}
      title={`Theme: ${theme || "system"} (Click to switch)`}
      {...props}
    >
      {theme === "system" ? (
        <Laptop className="size-4 text-muted-foreground" />
      ) : resolvedTheme === "dark" ? (
        <Moon className="size-4 text-primary" />
      ) : (
        <Sun className="size-4 text-warning" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

export const ModeToggle = ThemeToggle
