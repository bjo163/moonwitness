"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown } from "lucide-react"
import type { NavLinkConfig } from "@workspace/types"
import { cn } from "@workspace/ui"

function getSubmenuId(scope: string, href: string): string {
  return `${scope}-submenu-${href.replace(/[^a-zA-Z0-9_-]/g, "-")}`
}

interface DesktopNavigationProps {
  navLinks: readonly NavLinkConfig[]
  pathname: string | null
  activeDesktopSubmenu: string | null
  setActiveDesktopSubmenu: React.Dispatch<React.SetStateAction<string | null>>
}

export function DesktopNavigation({
  navLinks,
  pathname,
  activeDesktopSubmenu,
  setActiveDesktopSubmenu,
}: DesktopNavigationProps) {
  const isActive = (link: NavLinkConfig) =>
    pathname === link.href || (link.href !== "/" && pathname?.startsWith(`${link.href}/`))

  const handleDesktopEscape = (
    event: React.KeyboardEvent<HTMLUListElement>,
    href: string
  ) => {
    if (event.key !== "Escape") return
    event.preventDefault()
    setActiveDesktopSubmenu(null)
    document.getElementById(`${getSubmenuId("desktop", href)}-trigger`)?.focus()
  }

  return (
    <nav
      className="hidden items-center gap-1 text-sm font-medium lg:flex"
      aria-label="Primary navigation"
    >
      {navLinks.map((link) => {
        const submenuId = getSubmenuId("desktop", link.href)
        const isExpanded = activeDesktopSubmenu === link.href

        return (
          <div key={link.href} className="relative">
            <div className="flex items-center">
              <Link
                href={link.href}
                aria-current={isActive(link) ? "page" : undefined}
                className={cn(
                  "flex min-h-11 items-center rounded-md px-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
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
                    setActiveDesktopSubmenu((current: string | null) =>
                      current === link.href ? null : link.href
                    )
                  }
                  className="flex min-h-11 min-w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
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
                onKeyDown={(event) => handleDesktopEscape(event, link.href)}
                className="absolute top-full left-0 z-10 mt-1 w-56 rounded-md border border-border bg-card p-2"
              >
                {link.subLinks.map((subLink) => (
                  <li key={subLink.href}>
                    <Link
                      href={subLink.href}
                      aria-current={
                        pathname === subLink.href ? "page" : undefined
                      }
                      className={cn(
                        "flex min-h-11 items-center rounded-md px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                        pathname === subLink.href
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      )}
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
