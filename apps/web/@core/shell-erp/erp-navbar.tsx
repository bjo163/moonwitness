"use client"

import React, { useEffect, useState } from "react"
import { Search, Bell, LogOut, Settings, User } from "lucide-react"
import { Button } from "@core/ui/button"
import { usePathname } from "next/navigation"
import { AutoAvatar } from "@workspace/auto-avatar"
import { useMoonStore } from "@core/store/moon-store"
import { NotificationBell, GlobalSearchModal } from "@core/widgets"

type UserProfile = {
  name?: string
  email?: string
  title?: string
  role?: string
  avatarUrl?: string
}

export function ErpNavbar() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const pathname = usePathname()
  const { user } = useMoonStore()

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || (user.email ? user.email.split("@")[0] : "User"),
        email: user.email || "",
        role: "user",
        avatarUrl: "",
      })
    } else {
      setProfile(null)
    }
  }, [user])

  // Auto-generate title from pathname
  const pageTitle =
    pathname?.split("/").pop()?.replace(/-/g, " ") || "Dashboard"

  return (
    <header className="bg-space/90 sticky top-0 z-40 flex h-20 w-full items-center justify-between border-b border-cyan-500/20 px-6 shadow-sm backdrop-blur-md">
      {/* Page Title */}
      <div className="flex items-center gap-4">
        <h2 className="font-sans text-lg font-bold tracking-wider text-white uppercase">
          {pageTitle}
        </h2>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-6">
        {/* Search */}
        <div className="hidden sm:block">
          <GlobalSearchModal />
        </div>

        {/* Notifications */}
        <NotificationBell />

        {/* User Profile */}
        <div className="flex items-center gap-3 border-l border-cyan-500/30 pl-6">
          <div className="hidden flex-col items-end sm:flex">
            <span className="font-sans text-sm font-bold text-white">
              {profile?.name || "Rezza Fahlevi"}
            </span>
            <span className="font-mono text-[10px] text-cyan-400">
              {profile?.title || "Explorer of Truth"}
            </span>
          </div>
          <AutoAvatar seed={profile?.name || "Rezza Fahlevi"} size={40} />
        </div>

        <Button
          variant="secondary"
          accentColor="system"
          className="hidden md:flex"
          onClick={() => (window.location.href = "/home")}
        >
          PUBLIC
        </Button>
      </div>
    </header>
  )
}
