"use client"

import React from "react"
import Link from "next/link"
import {
  Orbit,
  LogOut,
  User as UserIcon,
  ShieldCheck,
  Terminal,
} from "lucide-react"
import { AutoAvatar } from "@workspace/auto-avatar"

const MAX_NAME_DISPLAY_LENGTH = 12

export type UserProfileData = {
  name?: string
  role?: string
  email?: string
  avatarUrl?: string
}

type NavbarProfileMenuProps = {
  userProfile: UserProfileData | null
  profileDropdownOpen: boolean
  setProfileDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>
  commandCenterUrl: string
  onLogout: () => void
}

export function NavbarProfileMenu({
  userProfile,
  profileDropdownOpen,
  setProfileDropdownOpen,
  commandCenterUrl,
  onLogout,
}: NavbarProfileMenuProps) {
  if (!userProfile) {
    return (
      <Link
        href="/auth/login"
        className="group flex items-center gap-2 text-sm transition-colors hover:text-primary"
      >
        <span className="text-muted-foreground group-hover:text-primary">
          Session status
        </span>
        <span className="text-success flex items-center gap-1.5 font-medium group-hover:text-foreground">
          <span className="bg-success h-1.5 w-1.5 rounded-full" />
          Online
        </span>
        <span className="ml-2 rounded-md border border-primary/30 bg-primary/10 px-1.5 py-0.5 text-xs text-primary transition-opacity group-hover:opacity-100">
          Sign in →
        </span>
      </Link>
    )
  }

  return (
    <>
      <button
        onClick={() => setProfileDropdownOpen((prev) => !prev)}
        className="group flex items-center gap-3 transition-colors hover:text-primary"
      >
        <AutoAvatar seed={userProfile?.name || "Anonymous"} size={36} />
        <div className="flex flex-col items-start text-left">
          <span className="text-xs font-semibold text-foreground group-hover:text-primary">
            {userProfile.name?.substring(0, MAX_NAME_DISPLAY_LENGTH) ||
              "Operator"}
          </span>
          <span className="text-[10px] text-muted-foreground">
            {userProfile.role || "Public"}
          </span>
        </div>
      </button>

      {profileDropdownOpen && (
        <div className="absolute top-full right-0 mt-2 w-56 rounded-lg border border-border bg-card p-2 shadow-md">
          <div className="mb-2 border-b border-border pb-2 pl-2 text-xs font-medium text-muted-foreground">
            Account actions
          </div>
          <div className="flex flex-col gap-1">
            <Link
              href="/auth/profile"
              onClick={() => setProfileDropdownOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-accent hover:text-foreground"
            >
              <UserIcon className="h-4 w-4" /> Profile
            </Link>
            <a
              href={`${commandCenterUrl}/dashboard`}
              onClick={() => setProfileDropdownOpen(false)}
              className="text-info hover:bg-info/10 flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:text-foreground"
            >
              <ShieldCheck className="h-4 w-4" /> Command center ↗
            </a>
            <a
              href={`${commandCenterUrl}/terminal`}
              onClick={() => setProfileDropdownOpen(false)}
              className="text-success hover:bg-success/10 flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:text-foreground"
            >
              <Terminal className="h-4 w-4" /> Developer terminal ↗
            </a>
            <button
              disabled
              className="flex cursor-not-allowed items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground opacity-70"
            >
              <div className="flex items-center gap-3">
                <Orbit className="h-4 w-4" /> Universe
              </div>
              <span className="border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground clip-tag">
                Coming soon
              </span>
            </button>
            <div className="my-1 border-t border-border" />
            <button
              onClick={onLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </div>
      )}
    </>
  )
}
