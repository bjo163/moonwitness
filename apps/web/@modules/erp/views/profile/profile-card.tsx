"use client"

import React from "react"
import { useMoonStore } from "@core/store/moon-store"
import { MapPin, Mail, Clock, Calendar, CheckCircle2, Camera } from "lucide-react"
import { AutoAvatar } from "@workspace/auto-avatar"

export function ProfileCard({ profileData, isOwnProfile = true }: { profileData?: any, isOwnProfile?: boolean }) {
  const user = profileData
  
  const displayName = user?.name || (user?.email ? user.email.split('@')[0] : "Explorer of Truth")
  const roleName = user?.partner_id ? "Global Administrator" : (user?.role || "Knowledge Explorer")

  return (
    <div className="relative overflow-hidden rounded-xl border border-cyan-500/30 bg-black/40 p-6 backdrop-blur-md">
      {/* Background Grid & Glow */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0891b211_1px,transparent_1px),linear-gradient(to_bottom,#0891b211_1px,transparent_1px)] bg-[size:1rem_1rem]"></div>
      <div className="absolute top-0 right-0 h-64 w-64 -translate-y-1/2 translate-x-1/2 rounded-full bg-cyan-500/10 blur-[80px]"></div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Avatar Section */}
        <div className="relative mb-6">
          <div className="absolute -inset-4 rounded-full border border-cyan-500/20 animate-[spin_10s_linear_infinite]" />
          <div className="absolute -inset-2 rounded-full border border-dashed border-cyan-400/40 animate-[spin_15s_linear_infinite_reverse]" />
          <div className="relative h-28 w-28 rounded-full border-2 border-cyan-400 overflow-hidden bg-black flex items-center justify-center">
            <AutoAvatar name={displayName} size={112} className="h-full w-full object-cover" />
          </div>
          {isOwnProfile && (
            <button className="absolute bottom-0 right-0 rounded-full border border-cyan-500/50 bg-black p-1.5 text-cyan-400 hover:bg-cyan-500/20">
              <Camera className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Name & Title */}
        <div className="text-center mb-6">
          <h2 className="flex items-center justify-center gap-2 font-sans text-xl font-bold text-white">
            {displayName}
            <CheckCircle2 className="h-4 w-4 text-cyan-400" />
          </h2>
          <p className="mt-1 font-mono text-[10px] text-cyan-400">
            {roleName} • Researcher • Observer
          </p>
          <div className="mt-4 border-l-2 border-cyan-500 pl-3 text-left">
            <p className="font-sans text-xs italic text-slate-300">
              "And say, 'My Lord, increase me in knowledge.'"
            </p>
            <p className="mt-1 font-sans text-[10px] text-cyan-500/70">
              ( Qur'an 20:114 )
            </p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="w-full grid grid-cols-2 gap-y-4 gap-x-2 border-t border-cyan-500/20 pt-4">
          <div className="flex flex-col">
            <span className="flex items-center gap-1.5 font-sans text-[9px] font-semibold text-cyan-500/70 uppercase">
              <UserIcon className="h-3 w-3" /> Username
            </span>
            <span className="mt-1 font-mono text-xs text-slate-200 pl-4.5 truncate">
              {displayName.toLowerCase().replace(/\s+/g, '.')}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="flex items-center gap-1.5 font-sans text-[9px] font-semibold text-cyan-500/70 uppercase">
              <Calendar className="h-3 w-3" /> Member Since
            </span>
            <span className="mt-1 font-mono text-xs text-slate-200 pl-4.5">
              26 May 2025
            </span>
          </div>

          <div className="flex flex-col">
            <span className="flex items-center gap-1.5 font-sans text-[9px] font-semibold text-cyan-500/70 uppercase">
              <Mail className="h-3 w-3" /> Email
            </span>
            <span className="mt-1 font-mono text-[10px] text-slate-200 pl-4.5 truncate" title={user?.email || "N/A"}>
              {user?.email || "N/A"}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="flex items-center gap-1.5 font-sans text-[9px] font-semibold text-cyan-500/70 uppercase">
              <Clock className="h-3 w-3" /> Last Active
            </span>
            <span className="mt-1 font-mono text-xs text-slate-200 pl-4.5">
              Today, 07:13 WIB
            </span>
          </div>

          <div className="flex flex-col">
            <span className="flex items-center gap-1.5 font-sans text-[9px] font-semibold text-cyan-500/70 uppercase">
              <MapPin className="h-3 w-3" /> Location
            </span>
            <span className="mt-1 font-mono text-xs text-slate-200 pl-4.5">
              Jakarta, Indonesia
            </span>
          </div>
          
          <div className="flex flex-col">
            <span className="flex items-center gap-1.5 font-sans text-[9px] font-semibold text-cyan-500/70 uppercase">
              <GlobeIcon className="h-3 w-3" /> Timezone
            </span>
            <span className="mt-1 font-mono text-xs text-slate-200 pl-4.5">
              (UTC+7) Jakarta
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function UserIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function GlobeIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      <path d="M2 12h20" />
    </svg>
  )
}
