"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Orbit,
  Menu,
  X,
  LogOut,
  User as UserIcon,
  ShieldCheck,
  Terminal,
} from "lucide-react"
import {
  NAVIGATION_MESH,
  type NavLinkConfig,
  type UserProfile,
} from "@workspace/types"
import { ThemeToggle } from "./theme-toggle"
import { APP_PORTS } from "@workspace/types"

const MAX_NAME_DISPLAY_LENGTH = 12

export function Navbar({
  navLinks = NAVIGATION_MESH.portal,
  user,
  onLogout,
  commandCenterUrl = `http://localhost:${APP_PORTS.COMMAND_CENTER}`,
}: {
  navLinks?: readonly NavLinkConfig[]
  user?: UserProfile | null
  onLogout?: () => void
  commandCenterUrl?: string
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const pathname = usePathname()
  const [activeSection, setActiveSection] = useState<string>("home")

  const handleLogout = () => {
    if (onLogout) {
      onLogout()
    } else {
      window.location.href = "/auth/login"
    }
    setProfileDropdownOpen(false)
  }

  // ScrollSpy effect for /home page
  useEffect(() => {
    if (pathname !== "/home" && pathname !== "/") return

    const handleScroll = () => {
      const sections = [
        "hero",
        "observatory",
        "knowledge",
        "analytics",
        "mission",
      ]
      let currentSection = "home"

      for (const id of sections) {
        const el = document.getElementById(id)
        if (el) {
          const rect = el.getBoundingClientRect()
          const SCROLL_OFFSET = 250
          if (rect.top <= SCROLL_OFFSET && rect.bottom >= SCROLL_OFFSET) {
            currentSection = id === "hero" ? "home" : id
            break
          }
        }
      }
      setActiveSection(currentSection)
    }

    window.addEventListener("scroll", handleScroll)
    setTimeout(handleScroll, 100)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [pathname])

  // Hide global navbar on dedicated system portals
  if (
    pathname?.startsWith("/command-center") ||
    pathname?.startsWith("/auth")
  ) {
    return null
  }

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    label: string
  ) => {
    if (pathname === "/home") {
      const targetId =
        label.toLowerCase() === "home" ? "hero" : label.toLowerCase()
      const el = document.getElementById(targetId)
      if (el) {
        e.preventDefault()
        el.scrollIntoView({ behavior: "smooth" })
        setMobileMenuOpen(false)
        return
      }
    }
    if (href.startsWith("#") && pathname === "/") {
      e.preventDefault()
      const el = document.querySelector(href)
      if (el) el.scrollIntoView({ behavior: "smooth" })
    }
    setMobileMenuOpen(false)
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/95 font-sans text-foreground shadow-sm backdrop-blur-md select-none">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-8">
        {/* LEFT: BRANDING */}
        <Link
          href="/home"
          className="group flex cursor-pointer items-center gap-3"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-muted/60 shadow-sm transition-colors group-hover:border-primary/50">
            <Orbit className="h-5 w-5 text-primary transition-transform duration-300 group-hover:scale-110" />
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight text-foreground whitespace-nowrap">
              MoonWitness OS
            </div>
            <div className="text-[10px] font-medium text-muted-foreground whitespace-nowrap">
              Unified Knowledge & Celestial Observatory
            </div>
          </div>
        </Link>

        {/* CENTER: NAVIGATION */}
        <nav className="hidden items-center gap-6 text-xs font-medium lg:flex">
          {navLinks.map((link) => {
            const isActive =
              (pathname === "/home" &&
                activeSection === link.label.toLowerCase()) ||
              (pathname !== "/home" &&
                (pathname === link.href ||
                  pathname?.startsWith(link.href + "/")))

            return (
              <div key={link.href} className="group relative py-1.5">
                <Link
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href, link.label)}
                  className={`flex items-center gap-1 transition-colors duration-200 ${
                    isActive
                      ? "text-primary font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span>{link.label}</span>
                  {link.subLinks && (
                    <svg
                      className="h-3 w-3 opacity-60 transition-opacity group-hover:opacity-100"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 h-[2px] w-full bg-primary" />
                  )}
                </Link>

                {/* Dropdown Menu */}
                {link.subLinks && (
                  <div className="invisible absolute top-full left-0 z-50 mt-2 w-56 translate-y-1 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                    <div className="flex flex-col gap-1 rounded-xl border border-border bg-popover p-1.5 shadow-md">
                      {link.subLinks.map((sub: { label: string; href: string }) => (
                        <Link
                          key={sub.label}
                          href={sub.href}
                          className={`block rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                            pathname === sub.href
                              ? "bg-accent text-accent-foreground font-semibold"
                              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                          }`}
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        {/* RIGHT: CONTROLS & PROFILE */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 font-mono text-[10px] font-bold text-primary">
                  {user.name ? user.name.substring(0, 2).toUpperCase() : "U"}
                </div>
                <span className="hidden sm:inline">
                  {user.name?.substring(0, MAX_NAME_DISPLAY_LENGTH) || "Account"}
                </span>
              </button>

              {/* Profile Dropdown */}
              {profileDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-52 rounded-xl border border-border bg-popover p-1.5 shadow-lg">
                  <div className="px-3 py-2 border-b border-border text-[11px] font-semibold text-muted-foreground">
                    Account Menu
                  </div>

                  <div className="flex flex-col gap-0.5 pt-1">
                    <Link
                      href="/auth/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-accent"
                    >
                      <UserIcon className="h-4 w-4 text-muted-foreground" /> Profile
                    </Link>

                    <a
                      href={`${commandCenterUrl}/dashboard`}
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-accent"
                    >
                      <ShieldCheck className="h-4 w-4 text-muted-foreground" /> Command Center ↗
                    </a>

                    <a
                      href={`${commandCenterUrl}/terminal`}
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-accent"
                    >
                      <Terminal className="h-4 w-4 text-muted-foreground" /> Developer Console ↗
                    </a>

                    <div className="my-1 border-t border-border" />

                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-medium text-destructive transition-colors hover:bg-destructive/10"
                    >
                      <LogOut className="h-4 w-4" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="rounded-lg bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
            >
              Sign In
            </Link>
          )}

          <ThemeToggle />

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg border border-border bg-card p-2 text-foreground transition-colors hover:bg-accent lg:hidden"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Nav Overlay */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-background p-4 shadow-xl lg:hidden">
          <div className="flex flex-col gap-1 text-sm font-medium">
            {navLinks.map((link) => (
              <div key={link.label} className="flex flex-col">
                <Link
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href, link.label)}
                  className="rounded-lg p-2.5 text-foreground transition-colors hover:bg-accent"
                >
                  {link.label}
                </Link>
                {link.subLinks && (
                  <div className="flex flex-col gap-1 pl-4 pb-2">
                    {link.subLinks.map(
                      (sub: { label: string; href: string }) => (
                        <Link
                          key={sub.label}
                          href={sub.href}
                          onClick={(e) => handleNavClick(e, sub.href, sub.label)}
                          className="rounded-lg p-2 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                        >
                          {sub.label}
                        </Link>
                      )
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
