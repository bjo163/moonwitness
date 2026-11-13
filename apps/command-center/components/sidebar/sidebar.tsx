"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { cn } from "@workspace/ui"
import { SidebarOverlay } from "./sidebar-overlay"
import { CommandCenterSidebarHeader } from "./sidebar-header"
import { SidebarNavigation } from "./sidebar-navigation"
import { CommandCenterSidebarFooter } from "./sidebar-footer"

export function CommandCenterSidebar({
  onLogout,
  open,
  onClose,
}: {
  onLogout: () => void
  open: boolean
  onClose: () => void
}) {
  const pathname = usePathname()
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const [isDesktop, setIsDesktop] = useState(false)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)")
    const updateViewport = () => setIsDesktop(mediaQuery.matches)
    updateViewport()
    mediaQuery.addEventListener("change", updateViewport)
    return () => mediaQuery.removeEventListener("change", updateViewport)
  }, [])

  useEffect(() => {
    if (open && !isDesktop) closeButtonRef.current?.focus()
  }, [isDesktop, open])

  return (
    <>
      <SidebarOverlay open={open} onClose={onClose} isDesktop={isDesktop} />
      <aside
        id="command-center-navigation"
        aria-label="Command Center navigation"
        aria-hidden={!open && !isDesktop}
        inert={!open && !isDesktop}
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-card text-card-foreground transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <CommandCenterSidebarHeader isDesktop={isDesktop} onClose={onClose} closeButtonRef={closeButtonRef} />

        <nav
          className="flex-1 overflow-y-auto px-3 py-4"
          aria-label="Primary navigation"
        >
          <SidebarNavigation
            pathname={pathname}
            expanded={expanded}
            setExpanded={setExpanded}
            onClose={onClose}
          />
        </nav>

        <CommandCenterSidebarFooter onLogout={onLogout} />
      </aside>
    </>
  )
}
