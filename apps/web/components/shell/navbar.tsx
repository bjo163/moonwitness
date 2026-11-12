"use client"

import React, { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { ChevronDown, Menu, Moon, X } from "lucide-react"
import { useAuthSession } from "@moon/client"
import type { NavLinkConfig } from "@workspace/types"
import { Button, GlobalSearchModal, NotificationBell } from "@workspace/ui"
import { NAVIGATION_MESH } from "@workspace/types"
import { commandCenterUrl } from "../../lib/app-urls"
import { NavbarProfileMenu, type UserProfileData } from "./navbar-profile-menu"

function getSubmenuId(scope: string, href: string): string {
  return `${scope}-submenu-${href.replace(/[^a-zA-Z0-9_-]/g, "-")}`
}

export function WebNavbar({
  navLinks = NAVIGATION_MESH.portal,
}: {
  navLinks?: readonly NavLinkConfig[] | NavLinkConfig[]
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuthSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null)
  const [activeDesktopSubmenu, setActiveDesktopSubmenu] = useState<string | null>(
    null
  )
  const [activeMobileSubmenu, setActiveMobileSubmenu] = useState<string | null>(
    null
  )
  const mobileMenuTriggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    setUserProfile(
      user
        ? {
            name: user.name || user.email?.split("@")[0] || "User",
            email: user.email || "",
            role: "user",
            avatarUrl: "",
          }
        : null
    )
  }, [user])

  if (pathname?.startsWith("/command-center") || pathname?.startsWith("/auth")) {
    return null
  }

  const handleLogout = () => {
    logout()
    setUserProfile(null)
    setProfileDropdownOpen(false)
    router.push("/auth/login")
  }

  const handleNavClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    label: string
  ) => {
    if ((pathname === "/" || pathname === "/home") && !href.startsWith("/")) {
      event.preventDefault()
      document
        .getElementById(
          label.toLowerCase() === "home" ? "hero" : label.toLowerCase()
        )
        ?.scrollIntoView({ behavior: "smooth" })
    }

    setMobileMenuOpen(false)
    setActiveMobileSubmenu(null)
    setActiveDesktopSubmenu(null)
  }

  const isActive = (link: NavLinkConfig) =>
    pathname === link.href ||
    (link.href !== "/" && pathname?.startsWith(`${link.href}/`))

  const handleDesktopEscape = (
    event: React.KeyboardEvent<HTMLUListElement>,
    href: string
  ) => {
    if (event.key !== "Escape") return
    event.preventDefault()
    setActiveDesktopSubmenu(null)
    document.getElementById(`${getSubmenuId("desktop", href)}-trigger`)?.focus()
  }

  const handleMobileEscape = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Escape") return
    event.preventDefault()
    setMobileMenuOpen(false)
    setActiveMobileSubmenu(null)
    mobileMenuTriggerRef.current?.focus()
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-8">
        <Link href="/home" className="group flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card text-primary transition-colors group-hover:bg-accent">
            <Moon aria-hidden="true" className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-sm font-semibold text-foreground sm:text-base">
              MoonWitness
            </span>
            <span className="block text-[10px] text-muted-foreground">
              Public knowledge platform
            </span>
          </span>
        </Link>

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
                    onClick={(event) =>
                      handleNavClick(event, link.href, link.label)
                    }
                    aria-current={isActive(link) ? "page" : undefined}
                    className={`flex min-h-11 items-center rounded-md px-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${isActive(link) ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"}`}
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
                        setActiveDesktopSubmenu((current) =>
                          current === link.href ? null : link.href
                        )
                      }
                      className="flex min-h-11 min-w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      <ChevronDown
                        aria-hidden="true"
                        className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                      />
                    </button>
                  )}
                </div>
                {link.subLinks && link.subLinks.length > 0 && (
                  <ul
                    id={submenuId}
                    hidden={!isExpanded}
                    aria-label={`${link.label} pages`}
                    onKeyDown={(event) =>
                      handleDesktopEscape(event, link.href)
                    }
                    className="absolute top-full left-0 z-10 mt-1 w-56 rounded-md border border-border bg-card p-2"
                  >
                    {link.subLinks.map((subLink) => (
                      <li key={subLink.href}>
                        <Link
                          href={subLink.href}
                          onClick={(event) =>
                            handleNavClick(
                              event,
                              subLink.href,
                              subLink.label
                            )
                          }
                          aria-current={
                            pathname === subLink.href ? "page" : undefined
                          }
                          className={`flex min-h-11 items-center rounded-md px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${pathname === subLink.href ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"}`}
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

        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <GlobalSearchModal />
          </div>
          <NotificationBell />
          <div className="relative flex items-center rounded-md border border-border bg-card px-2 py-1.5">
            <NavbarProfileMenu
              userProfile={userProfile}
              profileDropdownOpen={profileDropdownOpen}
              setProfileDropdownOpen={setProfileDropdownOpen}
              commandCenterUrl={commandCenterUrl}
              onLogout={handleLogout}
            />
          </div>
          <Button
            ref={mobileMenuTriggerRef}
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setMobileMenuOpen((isOpen) => !isOpen)}
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
        </div>
      </div>

      <nav
        id="mobile-navigation"
        hidden={!mobileMenuOpen}
        className="space-y-2 border-t border-border bg-card p-4 lg:hidden"
        aria-label="Mobile primary navigation"
        onKeyDown={handleMobileEscape}
      >
        {navLinks.map((link) => {
          const submenuId = getSubmenuId("mobile", link.href)
          const isExpanded = activeMobileSubmenu === link.href

          return (
            <div key={link.href}>
              <div className="flex items-center gap-2">
                <Link
                  href={link.href}
                  onClick={(event) =>
                    handleNavClick(event, link.href, link.label)
                  }
                  aria-current={isActive(link) ? "page" : undefined}
                  className={`flex min-h-11 min-w-0 flex-1 items-center rounded-md border border-border px-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${isActive(link) ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"}`}
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
                      setActiveMobileSubmenu((current) =>
                        current === link.href ? null : link.href
                      )
                    }
                    className="flex min-h-11 min-w-11 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <ChevronDown
                      aria-hidden="true"
                      className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
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
                        onClick={(event) =>
                          handleNavClick(
                            event,
                            subLink.href,
                            subLink.label
                          )
                        }
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
    </header>
  )
}
