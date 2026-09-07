"use client"

import React from "react"
import {
  MapPin,
  Mail,
  Clock,
  Calendar,
  CheckCircle2,
  Camera,
} from "lucide-react"
import { AutoAvatar } from "@workspace/auto-avatar"
import { Button, PropertyRow } from "@workspace/ui"

export function ProfileCard({
  profileData,
  isOwnProfile = true,
}: {
  profileData?: any
  isOwnProfile?: boolean
}) {
  const user = profileData

  const displayName =
    user?.name || (user?.email ? user.email.split("@")[0] : "Explorer of Truth")
  const roleName = user?.partner_id
    ? "Global Administrator"
    : user?.role || "Knowledge Explorer"

  return (
    <div className="relative overflow-hidden rounded-xl border border-primary/30 bg-card/90 p-6 shadow-sm backdrop-blur-md">
      {/* Background Grid & ambient */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0891b211_1px,transparent_1px),linear-gradient(to_bottom,#0891b211_1px,transparent_1px)] bg-[size:1rem_1rem]"></div>
      <div className="absolute top-0 right-0 h-64 w-64 translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[80px]"></div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Avatar Section */}
        <div className="relative mb-6">
          <div className="absolute -inset-4 animate-[spin_10s_linear_infinite] rounded-full border border-primary/20" />
          <div className="absolute -inset-2 animate-[spin_15s_linear_infinite_reverse] rounded-full border border-dashed border-primary/40" />
          <div className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-2 border-primary bg-card">
            <AutoAvatar
              seed={displayName}
              size={112}
              className="h-full w-full object-cover"
            />
          </div>
          {isOwnProfile && (
            <Button type="button" variant="ghost" size="icon" aria-label="Change profile photo" className="absolute right-0 bottom-0 rounded-full border border-primary/50 bg-card p-1.5 text-primary hover:bg-primary/20">
              <Camera className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Name & Title */}
        <div className="mb-6 text-center">
          <h2 className="flex items-center justify-center gap-2 font-sans text-xl font-bold text-foreground">
            {displayName}
            <CheckCircle2 className="h-4 w-4 text-primary" />
          </h2>
          <p className="mt-1 font-mono text-[10px] text-primary">
            {roleName} • Researcher • Observer
          </p>
          <div className="mt-4 border-l-2 border-primary pl-3 text-left">
            <p className="font-sans text-xs text-muted-foreground italic">
              "And say, 'My Lord, increase me in knowledge.'"
            </p>
            <p className="mt-1 font-sans text-[10px] text-primary/70">
              ( Qur'an 20:114 )
            </p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid w-full grid-cols-2 gap-x-2 gap-y-4 border-t border-border pt-4">
          <PropertyRow
            variant="stacked"
            icon={UserIcon}
            label="Username"
            value={displayName.toLowerCase().replace(/\s+/g, ".")}
          />
          <PropertyRow
            variant="stacked"
            icon={Calendar}
            label="Member Since"
            value="26 May 2025"
          />
          <PropertyRow
            variant="stacked"
            icon={Mail}
            label="Email"
            value={user?.email || "N/A"}
          />
          <PropertyRow
            variant="stacked"
            icon={Clock}
            label="Last Active"
            value="Today, 07:13 WIB"
          />
          <PropertyRow
            variant="stacked"
            icon={MapPin}
            label="Location"
            value="Jakarta, Indonesia"
          />
          <PropertyRow
            variant="stacked"
            icon={GlobeIcon}
            label="Timezone"
            value="(UTC+7) Jakarta"
          />
        </div>
      </div>
    </div>
  )
}

function UserIcon(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function GlobeIcon(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      <path d="M2 12h20" />
    </svg>
  )
}
