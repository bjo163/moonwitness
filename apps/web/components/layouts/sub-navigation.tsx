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
    <div className="sticky top-16 z-40 w-full border-b border-border bg-card">
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
                className={`group flex shrink-0 snap-start items-center gap-2.5 rounded-md px-4 py-2 transition-colors ${
                  isActive
                    ? "border border-border bg-accent text-accent-foreground shadow-sm"
                    : "border border-transparent text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                } `}
              >
                <div className="relative">
                  <Icon
                    className={`relative z-10 h-3.5 w-3.5 ${isActive ? "text-accent-foreground" : "text-muted-foreground"}`}
                  />
                </div>
                <span className="text-sm font-medium">{link.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
