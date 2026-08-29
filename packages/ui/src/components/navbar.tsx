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

const MAX_NAME_DISPLAY_LENGTH = 12
/* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Equalizer waveform heights */
const EQUALIZER_BASE_HEIGHTS = [3, 7, 10, 5, 8, 4, 9, 6]
const EQUALIZER_MOD_FACTOR = 3
const EQUALIZER_MAX_HEIGHT = 12
const EQUALIZER_DELAY_STEP_MS = 150

import { APP_PORTS } from "@workspace/types"

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
          // If the top offset of the viewport is inside this section
          if (rect.top <= SCROLL_OFFSET && rect.bottom >= SCROLL_OFFSET) {
            currentSection = id === "hero" ? "home" : id
            break
          }
        }
      }
      setActiveSection(currentSection)
    }

    window.addEventListener("scroll", handleScroll)
    // Initialize on mount
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
    <header className="bg-background/90 fixed inset-x-0 top-0 z-50 border-b border-cyan-500/30 font-mono text-white shadow-[0_4px_30px_rgba(0,0,0,0.85)] backdrop-blur-md select-none">
      {/* Topmost Subtle Telemetry Line */}
      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60" />

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-8">
        {/* LEFT: ORBIT LOGO & BRANDING (From Image 2 top-left) */}
        <Link
          href="/home"
          className="group flex cursor-pointer items-center gap-3.5"
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-full border border-cyan-400/50 bg-black/60 shadow-[0_0_15px_rgba(0,240,255,0.25)] transition-colors group-hover:border-cyan-300">
            <div
              className="animate-spin-slow absolute h-[115%] w-[115%] rounded-full border border-dashed border-cyan-400/40"
              style={{ animationDuration: "20s" }}
            />
            <Orbit className="h-5 w-5 text-cyan-400 drop-shadow-[0_0_8px_#00F0FF] transition-transform duration-300 group-hover:scale-110" />
          </div>
          <div>
            <div className="text-sm font-black tracking-widest whitespace-nowrap text-white uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.7)] sm:text-base">
              MOONWITNESS OS
            </div>
            <div className="font-sans text-[9px] font-semibold tracking-[0.2em] whitespace-nowrap text-cyan-300 uppercase">
              GLOBAL DIVINE OBSERVATORY
            </div>
          </div>
        </Link>

        {/* CENTER: STUDIO MINIMALIST NAVIGATION (Blueprint 01) */}
        <nav className="hidden items-center gap-7 text-[11px] font-medium tracking-[0.2em] uppercase lg:flex">
          {navLinks.map((link) => (
            <div key={link.href} className="group relative py-1.5">
              <Link
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href, link.label)}
                className={`flex items-center gap-1 transition-colors duration-300 ${
                  (pathname === "/home" &&
                    activeSection === link.label.toLowerCase()) ||
                  (pathname !== "/home" &&
                    (pathname === link.href ||
                      pathname?.startsWith(link.href + "/")))
                    ? "text-cyan-300"
                    : "text-primary hover:text-white"
                }`}
              >
                <span>{link.label}</span>
                {link.subLinks && (
                  <svg
                    className="h-3 w-3 opacity-50 transition-opacity group-hover:opacity-100"
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
                {((pathname === "/home" &&
                  activeSection === link.label.toLowerCase()) ||
                  (pathname !== "/home" && pathname === link.href)) && (
                  <span className="absolute bottom-0 left-0 h-[1px] w-full bg-cyan-400 shadow-[0_0_8px_#00F0FF]" />
                )}
                <span className="absolute bottom-0 left-0 h-[1px] w-0 bg-white opacity-50 transition-all duration-300 group-hover:w-full" />
              </Link>

              {/* Dropdown Menu (Glassmorphism) */}
              {link.subLinks && (
                <div className="invisible absolute top-full left-0 z-50 mt-2 w-56 translate-y-2 opacity-0 transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="bg-background/90 flex flex-col gap-1 rounded-xl border border-cyan-500/20 p-2 shadow-[0_20px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl">
                    {link.subLinks.map((sub: { label: string; href: string; icon?: string }) => (
                      <Link
                        key={sub.label}
                        href={sub.href}
                        className={`block rounded-lg px-4 py-3 text-[10px] font-medium tracking-widest uppercase transition-all ${
                          pathname === sub.href
                            ? "border border-cyan-500/20 bg-cyan-500/10 text-cyan-300"
                            : "border border-transparent text-primary hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* RIGHT: MISSION STATUS & AUDIO WAVEFORM */}
        <div className="flex items-center gap-4">
          <div className="bg-background/80 relative flex items-center gap-4 rounded-full border border-cyan-500/20 px-4 py-1.5 shadow-[0_0_15px_rgba(0,240,255,0.05)] backdrop-blur-md">
            {user ? (
              <>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="group flex items-center gap-3 transition-colors hover:text-cyan-300"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-cyan-400/40 bg-cyan-950/60 font-mono text-[10px] font-bold text-cyan-300 shadow-[0_0_10px_rgba(0,240,255,0.2)]">
                    {user.name ? user.name.substring(0, 2).toUpperCase() : "OP"}
                  </div>
                  <div className="flex flex-col items-start text-left font-mono tracking-widest uppercase">
                    <span className="text-[9px] font-bold text-white group-hover:text-cyan-300">
                      {user.name?.substring(0, MAX_NAME_DISPLAY_LENGTH) || "OPERATOR"}
                    </span>
                    <span className="text-[7px] text-cyan-500">
                      {user.role || "PUBLIC"}
                    </span>
                  </div>
                </button>

                {/* Profile Dropdown */}
                {profileDropdownOpen && (
                  <div className="bg-background/95 absolute top-full right-0 mt-2 w-56 rounded-xl border border-cyan-500/30 p-2 shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-xl">
                    <div className="mb-2 border-b border-white/10 pb-2 pl-2 font-mono text-[9px] text-white/50 uppercase">
                      SYSTEM ACTIONS
                    </div>

                    <div className="flex flex-col gap-1">
                      <Link
                        href="/auth/profile"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-[10px] font-bold text-cyan-400 transition-colors hover:bg-cyan-500/10 hover:text-cyan-300"
                      >
                        <UserIcon className="h-4 w-4" /> PLAYER IDENTITY
                      </Link>

                      <a
                        href={`${commandCenterUrl}/dashboard`}
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-[10px] font-bold text-fuchsia-400 transition-colors hover:bg-fuchsia-500/10 hover:text-fuchsia-300"
                      >
                        <ShieldCheck className="h-4 w-4" /> COMMAND CENTER ↗
                      </a>

                      <a
                        href={`${commandCenterUrl}/terminal`}
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-[10px] font-bold text-emerald-400 transition-colors hover:bg-emerald-500/10 hover:text-emerald-300"
                      >
                        <Terminal className="h-4 w-4" /> DEV TERMINAL ↗
                      </a>

                      <button
                        disabled
                        className="flex cursor-not-allowed items-center justify-between rounded-lg px-3 py-2 text-[10px] font-bold text-primary/40 opacity-70"
                      >
                        <div className="flex items-center gap-3">
                          <Orbit className="h-4 w-4" /> UNIVERSE
                        </div>
                        <span className="rounded-sm border border-primary/20 px-1.5 py-0.5 text-[7px] text-primary/30">
                          COMING SOON
                        </span>
                      </button>

                      <div className="my-1 border-t border-white/10"></div>

                      <button
                        onClick={handleLogout}
                        className="text-danger hover:bg-danger/10 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-[10px] font-bold transition-colors hover:text-red-400"
                      >
                        <LogOut className="h-4 w-4" /> SYSTEM LOGOUT
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <Link
                href="/auth/login"
                className="group flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase transition-colors hover:text-cyan-300"
              >
                <span className="text-primary group-hover:text-cyan-400">
                  MISSION STATUS
                </span>
                <span className="flex items-center gap-1.5 font-bold text-cyan-400 drop-shadow-[0_0_5px_#00F0FF] group-hover:text-white">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400 shadow-[0_0_8px_#00F0FF] group-hover:bg-white" />
                  ONLINE
                </span>
                <span className="ml-2 rounded border border-cyan-500/30 bg-cyan-500/10 px-1.5 py-0.5 text-[8px] text-cyan-400 opacity-50 group-hover:opacity-100">
                  LOGIN &rarr;
                </span>
              </Link>
            )}

            <span className="hidden text-white/10 sm:inline">|</span>

            {/* Delicate Animated Audio Equalizer */}
            <div className="hidden h-3 items-end gap-[2px] px-1 sm:flex">
              {EQUALIZER_BASE_HEIGHTS.map((h, i) => (
                <span
                  key={i}
                  className="inline-block w-[1px] bg-cyan-400 opacity-70"
                  style={{
                    height: `${Math.max(2, (h * ((i % EQUALIZER_MOD_FACTOR) + 1)) % EQUALIZER_MAX_HEIGHT)}px`,
                    animationDelay: `${i * EQUALIZER_DELAY_STEP_MS}ms`,
                    animationDuration: "1.5s",
                    animationIterationCount: "infinite",
                    animationName: "pulse",
                  }}
                />
              ))}
            </div>
          </div>

          <ThemeToggle />

          {/* Mobile menu toggle button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-md border border-cyan-500/40 bg-black/60 p-2 text-cyan-300 transition-colors hover:border-cyan-400 hover:text-white lg:hidden"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>

          <div className="hidden cursor-pointer items-center justify-center rounded-md border border-white/10 p-2 text-white/60 transition-colors hover:text-white xl:flex">
            <Menu className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Mobile Nav Overlay */}
      {mobileMenuOpen && (
        <div className="bg-background animate-in space-y-4 border-t border-cyan-500/30 p-6 shadow-2xl duration-200 fade-in lg:hidden">
          <div className="flex flex-col gap-3 text-xs font-bold tracking-widest uppercase">
            {navLinks.map((link) => (
              <div key={link.label} className="flex flex-col gap-2">
                <Link
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href, link.label)}
                  className="rounded-md border border-cyan-500/30 bg-black/60 p-3 text-center shadow-inner transition-all hover:border-cyan-400 hover:text-cyan-300"
                >
                  {link.label}
                </Link>
                {link.subLinks && (
                  <div className="grid grid-cols-2 gap-2 pl-4">
                    {link.subLinks.map(
                      (sub: { label: string; href: string; icon?: string }) => (
                        <Link
                          key={sub.label}
                          href={sub.href}
                          onClick={(e) => handleNavClick(e, sub.href, sub.label)}
                          className="rounded-md border border-white/10 bg-white/5 p-2 text-center text-[9px] text-primary transition-all hover:text-cyan-300"
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
          <div className="flex items-center justify-center gap-2 border-t border-white/10 pt-3 text-center text-[11px] font-bold text-emerald-400">
            <span className="h-2 w-2 animate-ping rounded-full bg-emerald-400" />
            <span>MOONWITNESS SYSTEM : 100% SYNCHRONIZED</span>
          </div>
        </div>
      )}
    </header>
  )
}
