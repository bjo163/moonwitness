"use client"

import Link from "next/link"
import { Bell, Database, Menu, Search, X } from "lucide-react"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { apiPost } from "@moon/client"
import { ThemeToggle } from "@workspace/ui"

const titles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/users": "Users",
  "/hadiths": "Hadith Archive",
  "/scriptures": "Scripture Database",
  "/terminal": "Developer Console",
  "/profile": "Profile",
  "/cab": "CAB Governance",
}

export function CommandCenterTopbar({ onMenu }: { onMenu: () => void }) {
  const pathname = usePathname()
  const [notificationsOpen, setNotificationsOpen] = useState(false)
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
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur-md sm:px-6">
      {/* Left Title & Mobile Menu */}
      <div className="flex min-w-0 items-center gap-3">
        <button
          onClick={onMenu}
          aria-label="Open navigation"
          className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
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
        <button
          onClick={openSearch}
          className="hidden items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground shadow-sm hover:bg-accent hover:text-accent-foreground md:flex"
          aria-label="Search"
        >
          <Search className="h-3.5 w-3.5" />
          <span>Search</span>
          <span className="rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground font-mono">
            ⌘K
          </span>
        </button>

        {/* Demo Seed */}
        <button
          onClick={seedDemoData}
          disabled={seeding}
          className="hidden items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground disabled:opacity-50 sm:flex"
        >
          <Database className="h-3.5 w-3.5 text-primary" />
          <span>{seeding ? "Seeding..." : "Seed Demo"}</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen((value) => !value)}
            aria-label="Notifications"
            className="relative rounded-lg border border-border bg-card p-2 text-muted-foreground shadow-sm hover:bg-accent hover:text-accent-foreground"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary animate-pulse" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 top-12 w-80 rounded-xl border border-border bg-popover p-4 shadow-xl z-50 text-popover-foreground">
              <div className="mb-3 flex items-center justify-between border-b border-border pb-2">
                <p className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Notifications
                </p>
                <button
                  onClick={() => setNotificationsOpen(false)}
                  aria-label="Close notifications"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Background workers and services are operating normally.
              </p>
            </div>
          )}
        </div>

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
