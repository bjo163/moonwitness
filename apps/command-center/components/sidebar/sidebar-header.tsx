"use client"

import Link from "next/link"
import { ShieldCheck, X } from "lucide-react"
import { useRef } from "react"
import { cn } from "@workspace/ui"

interface CommandCenterSidebarHeaderProps {
  isDesktop: boolean
  onClose: () => void
  closeButtonRef: React.RefObject<HTMLButtonElement | null>
}

export function CommandCenterSidebarHeader({
  isDesktop,
  onClose,
  closeButtonRef,
}: CommandCenterSidebarHeaderProps) {
  return (
    <div className="flex h-16 items-center justify-between border-b border-border px-5">
      <Link
        href="/dashboard"
        className="flex items-center gap-3"
        onClick={onClose}
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
          <ShieldCheck className="h-5 w-5" />
        </span>
        <div>
          <span className="block text-sm font-bold tracking-tight text-foreground">
            MoonWitness
          </span>
          <span className="block text-[11px] text-muted-foreground">
            Operations & Admin
          </span>
        </div>
      </Link>
      <button
        ref={closeButtonRef}
        type="button"
        className={cn("rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground", isDesktop ? "hidden" : "block")}
        aria-label="Close navigation"
        onClick={onClose}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
