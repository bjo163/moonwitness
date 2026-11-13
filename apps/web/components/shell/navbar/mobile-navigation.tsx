"use client"

import Link from "next/link"
import { ChevronDown } from "lucide-react"
import type { NavLinkConfig } from "@workspace/types"
import { cn } from "@workspace/ui"

function getSubmenuId(scope: string, href: string): string {
  return `${scope}-submenu-${href.replace(/[^a-zA-Z0-9_-]/g, "-")}`
}

interface MobileNavigationProps {
  navLinks: readonly NavLinkConfig[]
  pathname: string | null
  activeMobileSubmenu: string | null
  setActiveMobileSubmenu: React.Dispatch<React.SetStateAction<string | null>>
  onNavClick: (href: string, label: string) => void
  onKeyDown?: (event: React.KeyboardEvent<HTMLDivElement>) => void
}

export function MobileNavigation({
  navLinks,
  pathname,
  activeMobileSubmenu,
  setActiveMobileSubmenu,
  onNavClick,
  onKeyDown,
}: MobileNavigationProps) {
  const isActive = (link: NavLinkConfig) =>
    pathname === link.href || (link.href !== "/" && pathname?.startsWith(`${link.href}/`))

  return (
    <nav
      id="mobile-navigation"
      className="space-y-2 border-t border-border bg-card p-4 lg:hidden"
      aria-label="Mobile primary navigation"
      onKeyDown={onKeyDown}
    >
      {navLinks.map((link) => {
        const submenuId = getSubmenuId("mobile", link.href)
        const isExpanded = activeMobileSubmenu === link.href

        return (
          <div key={link.href}>
            <div className="flex items-center gap-2">
              <Link
                href={link.href}
                onClick={() => onNavClick(link.href, link.label)}
                aria-current={isActive(link) ? "page" : undefined}
                className={cn(
                  "flex min-h-11 min-w-0 flex-1 items-center rounded-md border border-border px-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  isActive(link)
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                {link.label}
              </Link>
              {link.subLinks && link.subLinks.length > 0 && (
                <button
                  id={`${submenuId}-trigger`}
                  type="button"
                  aria-label={`${isExpanded ? "Hide" : "Show"} ${link.label} pages`}
                  aria-expanded={isExpanded}
                  aria-controls={submenuId}
                  onClick={() =>
                    setActiveMobileSubmenu((current: string | null) =>
                      current === link.href ? null : link.href
                    )
                  }
                  className="flex min-h-11 min-w-11 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <ChevronDown
                    aria-hidden="true"
                    className={cn("h-4 w-4 transition-transform", isExpanded && "rotate-180")}
                  />
                </button>
              )}
            </div>
            {link.subLinks && link.subLinks.length > 0 && (
              <ul
                id={submenuId}
                hidden={!isExpanded}
                aria-label={`${link.label} pages`}
                className="ml-4 mt-1 space-y-1 border-l border-border pl-3"
              >
                {link.subLinks.map((subLink) => (
                  <li key={subLink.href}>
                    <Link
                      href={subLink.href}
                      onClick={() => onNavClick(subLink.href, subLink.label)}
                      aria-current={
                        pathname === subLink.href ? "page" : undefined
                      }
                      className="flex min-h-11 items-center rounded-md px-3 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      {subLink.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )
      })}
    </nav>
  )
}
