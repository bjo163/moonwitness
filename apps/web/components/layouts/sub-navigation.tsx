"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import React from "react"
import {
  Radio,
  Globe,
  Moon,
  Eclipse,
  Compass,
  BookOpen,
  Sparkles,
  Clock,
  Activity,
  Settings,
  HelpCircle,
} from "lucide-react"

const ICON_MAP: Record<string, React.ElementType> = {
  Radio,
  Globe,
  Moon,
  Eclipse,
  Compass,
  BookOpen,
  Sparkles,
  Clock,
  Activity,
  Settings,
  HelpCircle,
}

export type SubNavLink = {
  label: string
  href: string
  icon: string | React.ElementType
}

type SubNavigationProps = {
  links: SubNavLink[]
}

export function SubNavigation({ links }: SubNavigationProps) {
  const pathname = usePathname()

  return (
    <div className="bg-card/80 sticky top-16 z-40 w-full border-b border-white/5 backdrop-blur-md">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <nav className="scrollbar-hide flex snap-x snap-mandatory items-center gap-2 overflow-x-auto py-3">
          {links.map((link) => {
            const isActive =
              pathname === link.href || pathname.startsWith(link.href + "/")
            const Icon =
              typeof link.icon === "string"
                ? (ICON_MAP[link.icon] ?? HelpCircle)
                : link.icon

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`group flex shrink-0 snap-start items-center gap-2.5 rounded px-4 py-2 transition-all duration-300 ${
                  isActive
                    ? "border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 shadow-sm"
                    : "border border-transparent text-primary hover:bg-white/5 hover:text-primary"
                } `}
              >
                <div className="relative">
                  {isActive && (
                    <span className="absolute inset-0 animate-ping rounded-full bg-cyan-400 opacity-40" />
                  )}
                  <Icon
                    className={`relative z-10 h-3.5 w-3.5 ${isActive ? "text-cyan-400" : "text-primary transition-colors group-hover:text-cyan-400"}`}
                  />
                </div>
                <span className="font-mono text-[10px] font-bold tracking-[0.2em] uppercase">
                  {link.label}
                </span>
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
