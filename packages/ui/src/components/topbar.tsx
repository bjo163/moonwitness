"use client"

import React from "react"
import { Search, Bell, User } from "lucide-react"
import { usePathname } from "next/navigation"
import { Button } from "./button"

export type UserProfile = {
  name?: string
  email?: string
  title?: string
  role?: string
  avatarUrl?: string
}

export function Topbar({
  profile = { name: "Operator", role: "admin" },
  title,
  rightActions,
  onPublicClick,
}: {
  profile?: UserProfile
  title?: string
  rightActions?: React.ReactNode
  onPublicClick?: () => void
}) {
  const pathname = usePathname()

  // Auto-generate title from pathname if not provided
  const pageTitle =
    title ||
    pathname?.split("/").pop()?.replace(/-/g, " ") ||
    "Dashboard"

  return (
    <header className="sticky top-0 z-40 flex h-20 w-full items-center justify-between border-b border-cyan-500/20 bg-black/80 px-6 shadow-sm backdrop-blur-md">
      {/* Page Title */}
      <div className="flex items-center gap-4">
        <h2 className="font-sans text-lg font-bold tracking-wider text-white uppercase">
          {pageTitle}
        </h2>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-6">
        {rightActions}

        {/* User Profile */}
        <div className="flex items-center gap-3 border-l border-cyan-500/30 pl-6">
          <div className="hidden flex-col items-end sm:flex">
            <span className="font-sans text-sm font-bold text-white">
              {profile?.name || "Operator"}
            </span>
            <span className="font-mono text-[10px] text-cyan-400">
              {profile?.title || profile?.role || "Administrator"}
            </span>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-cyan-400/40 bg-cyan-950/40 font-mono text-xs font-bold text-cyan-300">
            {profile?.name ? profile.name.substring(0, 2).toUpperCase() : "OP"}
          </div>
        </div>

        {onPublicClick && (
          <Button
            variant="secondary"
            className="hidden md:flex"
            onClick={onPublicClick}
          >
            PUBLIC ↗
          </Button>
        )}
      </div>
    </header>
  )
}
