"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown, ChevronRight, LogOut, ShieldCheck, X } from "lucide-react"
import { useState } from "react"
import { navigationItems, utilityItems } from "../navigation/navigation-items"
import { cn } from "@workspace/ui/lib/utils"

function active(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`)
}

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

  return (
    <>
      {open && (
        <button
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-card text-card-foreground transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
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
                Operations Terminal
              </span>
            </div>
          </Link>
          <button
            className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground lg:hidden"
            aria-label="Close navigation"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation List */}
        <nav
          className="flex-1 overflow-y-auto px-3 py-4"
          aria-label="Primary navigation"
        >
          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Workspace
          </p>
          <ul className="space-y-1">
            {navigationItems.map((item) => {
              const isActive = active(pathname, item.href)
              const isOpen = expanded[item.label] ?? isActive
              return (
                <li key={item.href}>
                  <div
                    className={cn(
                      "flex items-center rounded-lg transition-colors",
                      isActive
                        ? "bg-accent text-accent-foreground font-semibold"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className="flex min-w-0 flex-1 items-center gap-3 px-3 py-2 text-xs font-medium"
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </Link>
                    {item.children && (
                      <button
                        aria-label={`${isOpen ? "Collapse" : "Expand"} ${item.label}`}
                        onClick={() =>
                          setExpanded((current) => ({
                            ...current,
                            [item.label]: !isOpen,
                          }))
                        }
                        className="p-2 text-muted-foreground hover:text-foreground"
                      >
                        {isOpen ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>
                    )}
                  </div>
                  {item.children && isOpen && (
                    <ul className="ml-5 border-l border-border pl-3 pt-1 space-y-0.5">
                      {item.children.map((sub) => {
                        const isSubActive = active(pathname, sub.href)
                        return (
                          <li key={sub.href}>
                            <Link
                              href={sub.href}
                              onClick={onClose}
                              className={cn(
                                "flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs transition-colors",
                                isSubActive
                                  ? "bg-accent text-accent-foreground font-semibold"
                                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                              )}
                            >
                              <sub.icon className="h-3.5 w-3.5" />
                              <span>{sub.label}</span>
                            </Link>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </li>
              )
            })}
          </ul>

          <p className="px-3 pb-2 pt-6 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Utilities
          </p>
          <ul className="space-y-1">
            {utilityItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t border-border p-4">
          <div className="mb-3 flex items-center gap-3 rounded-lg border border-border bg-muted/40 p-3">
            <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
            <div>
              <p className="text-xs font-semibold text-foreground">
                All systems operational
              </p>
              <p className="text-[10px] text-muted-foreground">
                Operations Terminal online
              </p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign out</span>
          </button>
        </div>
      </aside>
    </>
  )
}
