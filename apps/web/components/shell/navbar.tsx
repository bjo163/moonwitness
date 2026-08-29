"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Menu, Moon, X } from "lucide-react"
import { useAuthSession } from "@moon/client"
import type { NavLinkConfig } from "@workspace/types"
import { GlobalSearchModal, NotificationBell } from "@workspace/ui"
import { APP_PORTS, NAVIGATION_MESH } from "@workspace/types"
import { NavbarProfileMenu, type UserProfileData } from "./navbar-profile-menu"

export function Navbar({
  navLinks = NAVIGATION_MESH.portal,
}: {
  navLinks?: readonly NavLinkConfig[] | NavLinkConfig[]
}) {
  const pathname = usePathname()
  const router = useRouter()
  const commandCenterUrl =
    process.env.NEXT_PUBLIC_COMMAND_CENTER_URL ||
    `http://localhost:${APP_PORTS.COMMAND_CENTER}`
  const { user, logout } = useAuthSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null)

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

  if (pathname?.startsWith("/command-center") || pathname?.startsWith("/auth"))
    return null

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
  }

  const isActive = (link: NavLinkConfig) =>
    pathname === link.href || pathname?.startsWith(`${link.href}/`)

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-8">
        <Link href="/home" className="group flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card text-primary transition-colors group-hover:bg-accent">
            <Moon className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-sm font-semibold text-foreground sm:text-base">
              MOONWITNESS OS
            </span>
            <span className="block text-[10px] text-muted-foreground">
              GLOBAL DIVINE OBSERVATORY
            </span>
          </span>
        </Link>
        <nav
          className="hidden items-center gap-1 text-sm font-medium lg:flex"
          aria-label="Primary navigation"
        >
          {navLinks.map((link) => (
            <div key={link.href} className="group relative">
              <Link
                href={link.href}
                onClick={(event) =>
                  handleNavClick(event, link.href, link.label)
                }
                className={`flex items-center rounded-md px-3 py-2 transition-colors ${isActive(link) ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"}`}
              >
                {link.label}
              </Link>
              {link.subLinks && (
                <div className="invisible absolute top-full left-0 mt-1 w-56 translate-y-1 rounded-lg border border-border bg-card p-2 opacity-0 shadow-md transition-[opacity,visibility,transform] group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  {link.subLinks.map((sub) => (
                    <Link
                      key={sub.label}
                      href={sub.href}
                      className={`block rounded-md px-3 py-2 text-sm transition-colors ${pathname === sub.href ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"}`}
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <GlobalSearchModal />
          </div>
          <NotificationBell />
          <div className="flex items-center rounded-md border border-border bg-card px-2 py-1.5">
            <NavbarProfileMenu
              userProfile={userProfile}
              profileDropdownOpen={profileDropdownOpen}
              setProfileDropdownOpen={setProfileDropdownOpen}
              commandCenterUrl={commandCenterUrl}
              onLogout={handleLogout}
            />
          </div>
          <button
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="rounded-md border border-border bg-card p-2 text-foreground transition-colors hover:bg-accent lg:hidden"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
      {mobileMenuOpen && (
        <div className="space-y-2 border-t border-border bg-card p-4 shadow-md lg:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={(event) => handleNavClick(event, link.href, link.label)}
              className={`block rounded-md border border-border px-3 py-2 text-sm transition-colors ${isActive(link) ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"}`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
