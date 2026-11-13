"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown, ChevronRight } from "lucide-react"
import { navigationItems, utilityItems } from "../navigation/navigation-items"
import { cn } from "@workspace/ui"

function active(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`)
}

interface NavigationItem {
  label: string
  href: string
  icon: React.ElementType
  children?: { label: string; href: string; icon: React.ElementType }[]
}

interface SidebarNavigationProps {
  pathname: string
  expanded: Record<string, boolean>
  setExpanded: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
  onClose: () => void
}

export function SidebarNavigation({
  pathname,
  expanded,
  setExpanded,
  onClose,
}: SidebarNavigationProps) {
  return (
    <>
      <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        Workspace
      </p>
      <ul className="space-y-1">
        {navigationItems.map((item) => {
          const isActive = active(pathname, item.href)
          const isOpen = expanded[item.label] ?? isActive
          const submenuId = `sidebar-submenu-${item.href.replace(/[^a-zA-Z0-9_-]/g, "-")}`
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
                  aria-current={isActive ? "page" : undefined}
                  className="flex min-w-0 flex-1 items-center gap-3 px-3 py-2 text-xs font-medium"
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </Link>
                {item.children && (
                  <button
                    type="button"
                    aria-label={`${isOpen ? "Collapse" : "Expand"} ${item.label}`}
                    aria-expanded={isOpen}
                    aria-controls={submenuId}
                    onClick={() =>
                      setExpanded((current) => ({
                        ...current,
                        [item.label]: !isOpen,
                      }))
                    }
                    className="flex min-h-11 min-w-11 items-center justify-center rounded-md text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {isOpen ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                )}
              </div>
              {item.children && (
                <ul
                  id={submenuId}
                  hidden={!isOpen}
                  className="ml-5 space-y-0.5 border-l border-border pl-3 pt-1"
                >
                  {item.children.map((sub) => {
                    const isSubActive = active(pathname, sub.href)
                    return (
                      <li key={sub.href}>
                        <Link
                          href={sub.href}
                          onClick={onClose}
                          aria-current={isSubActive ? "page" : undefined}
                          className={cn(
                            "flex min-h-11 items-center gap-2 rounded-lg px-3 text-xs transition-colors",
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
            {(() => {
              const isActive = active(pathname, item.href)
              return (
                <Link
                  href={item.href}
                  onClick={onClose}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "flex min-h-11 items-center gap-3 rounded-lg px-3 text-xs font-medium transition-colors",
                    isActive
                      ? "bg-accent font-semibold text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })()}
          </li>
        ))}
      </ul>
    </>
  )
}
