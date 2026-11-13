"use client"

import React, { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Moon } from "lucide-react"
import { useAuthSession } from "@moon/client"
import type { NavLinkConfig } from "@workspace/types"
import { Button, GlobalSearchModal, NotificationBell } from "@workspace/ui"
import { NAVIGATION_MESH } from "@workspace/types"
import { commandCenterUrl } from "../../lib/app-urls"
import { NavbarProfileMenu, type UserProfileData } from "./navbar-profile-menu"
import { DesktopNavigation, MobileNavigation, MobileMenuTrigger } from "./navbar/index"

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
  const [activeDesktopSubmenu, setActiveDesktopSubmenu] = useState<string | null>(null)
  const [activeMobileSubmenu, setActiveMobileSubmenu] = useState<string | null>(null)
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

  const handleNavClick = (href: string, label: string) => {
    if ((pathname === "/" || pathname === "/home") && !href.startsWith("/")) {
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

        <DesktopNavigation
          navLinks={navLinks}
          pathname={pathname}
          activeDesktopSubmenu={activeDesktopSubmenu}
          setActiveDesktopSubmenu={setActiveDesktopSubmenu}
        />

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
          <MobileMenuTrigger
            mobileMenuOpen={mobileMenuOpen}
            onToggle={() => setMobileMenuOpen((isOpen) => !isOpen)}
            triggerRef={mobileMenuTriggerRef}
          />
        </div>
      </div>

      <MobileNavigation
        navLinks={navLinks}
        pathname={pathname}
        activeMobileSubmenu={activeMobileSubmenu}
        setActiveMobileSubmenu={setActiveMobileSubmenu}
        onNavClick={handleNavClick}
        onKeyDown={handleMobileEscape}
      />
    </header>
  )
}
