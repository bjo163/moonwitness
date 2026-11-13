"use client"

import Link from "next/link"
import { Database, Menu, Search } from "lucide-react"
import { usePathname } from "next/navigation"
import { useState } from "react"
import type { RefObject } from "react"
import { apiPost } from "@moon/client"
import { Button, NotificationBell, ThemeToggle } from "@workspace/ui"

const titles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/users": "Users",
  "/hadiths": "Hadith Archive",
  "/scriptures": "Scripture Database",
  "/terminal": "Developer Console",
  "/profile": "Profile",
  "/cab": "CAB Governance",
}

export function CommandCenterTopbar({
  onMenu,
  sidebarOpen,
  menuButtonRef,
}: {
  onMenu: () => void
  sidebarOpen: boolean
  menuButtonRef: RefObject<HTMLButtonElement | null>
}) {
  const pathname = usePathname()
  const [seeding, setSeeding] = useState(false)
  const title =
    titles[pathname] ??
    (pathname.split("/").filter(Boolean).pop()?.replaceAll("-", " ") ?? "Dashboard")
  const isProfileActive = pathname === "/profile"

  function openSearch() {
    window.dispatchEvent(new Event("moonwitness:command-palette:open"))
  }

  async function seedDemoData() {
    if (!window.confirm("Initialize demo data across the command center?")) return
    setSeeding(true)
    try {
      await apiPost("/api/system/demo-seed", {})
    } finally {
      setSeeding(false)
    }
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background px-4 sm:px-6">
      {/* Left Title & Mobile Menu */}
      <div className="flex min-w-0 items-center gap-3">
        <button
          ref={menuButtonRef}
          type="button"
          onClick={onMenu}
          aria-label={sidebarOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={sidebarOpen}
          aria-controls="command-center-navigation"
          className="flex h-11 w-11 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
        >
          <Menu aria-hidden="true" className="h-5 w-5" />
        </button>
        <div>
          <p className="text-xs font-medium text-muted-foreground">
            Operations
          </p>
          <h1 className="truncate text-base font-bold capitalize text-foreground sm:text-lg">
            {title}
          </h1>
        </div>
      </div>

      {/* Right Action Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search Shortcut */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={openSearch}
          className="hidden items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground shadow-sm hover:bg-accent hover:text-accent-foreground md:flex"
          aria-label="Search"
        >
          <Search className="h-3.5 w-3.5" />
          <span>Search</span>
          <span className="rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground font-mono">
            ⌘K
          </span>
        </Button>

        {/* Demo Seed */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={seedDemoData}
          disabled={seeding}
          className="hidden items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground disabled:opacity-50 sm:flex"
        >
          <Database className="h-3.5 w-3.5 text-primary" />
          <span>{seeding ? "Seeding..." : "Seed Demo"}</span>
        </Button>

        <NotificationBell />

        {/* Theme Toggle */}
        <ThemeToggle />

        <div className="hidden h-6 w-px bg-border sm:block" />

        {/* User Profile Badge */}
        <Link
          href="/profile"
          aria-label="Open profile"
          className={[
            "flex h-8 w-8 items-center justify-center rounded-full border font-mono text-xs font-bold shadow-sm transition-colors",
            isProfileActive
              ? "border-primary bg-primary text-primary-foreground"
              : "border-primary/30 bg-primary/10 text-primary hover:bg-primary/20",
          ].join(" ")}
        >
          US
        </Link>
      </div>
    </header>
  )
}
