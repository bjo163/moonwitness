"use client"

import React from "react"
import Link from "next/link"
import { Orbit, LogOut, User as UserIcon, ShieldCheck, Terminal } from "lucide-react"
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
        className="group flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase transition-colors hover:text-cyan-300"
      >
        <span className="text-primary group-hover:text-cyan-400">MISSION STATUS</span>
        <span className="flex items-center gap-1.5 font-bold text-cyan-400 drop-shadow-sm group-hover:text-white">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400 shadow-sm group-hover:bg-white" />
          ONLINE
        </span>
        <span className="ml-2 rounded border border-cyan-500/30 bg-cyan-500/10 px-1.5 py-0.5 text-[8px] text-cyan-400 opacity-50 group-hover:opacity-100">
          LOGIN &rarr;
        </span>
      </Link>
    )
  }

  return (
    <>
      <button
        onClick={() => setProfileDropdownOpen((prev) => !prev)}
        className="group flex items-center gap-3 transition-colors hover:text-cyan-300"
      >
        <AutoAvatar seed={userProfile?.name || "Anonymous"} size={36} />
        <div className="flex flex-col items-start text-left font-mono tracking-widest uppercase">
          <span className="text-[9px] font-bold text-white group-hover:text-cyan-300">
            {userProfile.name?.substring(0, MAX_NAME_DISPLAY_LENGTH) || "PLAYER"}
          </span>
          <span className="text-[7px] text-cyan-500">{userProfile.role || "PUBLIC"}</span>
        </div>
      </button>

      {profileDropdownOpen && (
        <div className="bg-card/95 absolute top-full right-0 mt-2 w-56 rounded-xl border border-cyan-500/30 p-2 shadow-sm backdrop-blur-xl">
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
            <div className="my-1 border-t border-white/10" />
            <button
              onClick={onLogout}
              className="text-danger hover:bg-danger/10 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-[10px] font-bold transition-colors hover:text-red-400"
            >
              <LogOut className="h-4 w-4" /> SYSTEM LOGOUT
            </button>
          </div>
        </div>
      )}
    </>
  )
}
