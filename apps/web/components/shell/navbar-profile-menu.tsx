"use client"

import React from "react"
import Link from "next/link"
import {
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
  commandCenterUrl?: string
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
        className="group flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        Sign in
      </Link>
    )
  }

  return (
    <>
      <button
        type="button"
        aria-expanded={profileDropdownOpen}
        aria-controls="navbar-account-actions"
        onClick={() => setProfileDropdownOpen((prev) => !prev)}
        className="group flex items-center gap-3 transition-colors hover:text-primary"
      >
        <AutoAvatar seed={userProfile?.name || "Anonymous"} size={36} />
        <div className="flex flex-col items-start text-left">
          <span className="text-xs font-semibold text-foreground group-hover:text-primary">
            {userProfile.name?.substring(0, MAX_NAME_DISPLAY_LENGTH) ||
              "User"}
          </span>
          <span className="text-[10px] text-muted-foreground">
            {userProfile.role || "Public"}
          </span>
        </div>
      </button>

      <div
        id="navbar-account-actions"
        hidden={!profileDropdownOpen}
        className="absolute top-full right-0 mt-2 w-56 rounded-md border border-border bg-card p-2"
      >
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
            {commandCenterUrl && (
              <>
                <a
                  href={`${commandCenterUrl}/dashboard`}
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <ShieldCheck className="h-4 w-4" /> Command Center
                </a>
                <a
                  href={`${commandCenterUrl}/terminal`}
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <Terminal className="h-4 w-4" /> Developer terminal
                </a>
              </>
            )}
            <div className="my-1 border-t border-border" />
            <button
              onClick={onLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
      </div>
    </>
  )
}
