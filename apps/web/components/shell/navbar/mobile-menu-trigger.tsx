"use client"

import { Menu, X } from "lucide-react"
import { Button } from "@workspace/ui"

interface MobileMenuTriggerProps {
  mobileMenuOpen: boolean
  onToggle: () => void
  triggerRef: React.RefObject<HTMLButtonElement | null>
}

export function MobileMenuTrigger({
  mobileMenuOpen,
  onToggle,
  triggerRef,
}: MobileMenuTriggerProps) {
  return (
    <Button
      ref={triggerRef}
      type="button"
      variant="outline"
      size="icon"
      onClick={onToggle}
      className="size-11 rounded-md border-border bg-card p-2 text-foreground transition-colors hover:bg-accent lg:hidden"
      aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"}
      aria-expanded={mobileMenuOpen}
      aria-controls="mobile-navigation"
    >
      {mobileMenuOpen ? (
        <X aria-hidden="true" className="h-5 w-5" />
      ) : (
        <Menu aria-hidden="true" className="h-5 w-5" />
      )}
    </Button>
  )
}
