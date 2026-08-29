"use client"

import React, { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useAuthSession } from "@moon/client"
import { ProfileCard } from "./profile/profile-card"
import { MissionStats } from "./profile/mission-stats"
import { MissionSummary } from "./profile/mission-summary"
import { ExpertiseBadges } from "./profile/expertise-badges"
import { CurrentFocus } from "./profile/current-focus"
import { AchievementsList } from "./profile/achievements-list"
import { RecentActivity } from "./profile/recent-activity"
import { MissionBadges } from "./profile/mission-badges"
import { QuickActions } from "./profile/quick-actions"
import { ContextBlock } from "@workspace/ui"

export function ErpProfileView() {
  const searchParams = useSearchParams()
  const targetId = searchParams.get("id")
  const { user } = useAuthSession()

  // Determine if viewing own profile or someone else's
  const isOwnProfile = !targetId || targetId === String((user as any)?.id || "admin")

  // In the future, if !isOwnProfile, we will fetch target user data here.
  // For now, we simulate profile data based on targetId presence.
  const profileData = (isOwnProfile
    ? user
    : {
        name: "Guest Explorer " + targetId,
        email: "guest_" + targetId + "@moonwitness.org",
        role: "Knowledge Explorer",
      }) || {
        name: "Commander Rezza",
        email: "admin@moonwitness.org",
        role: "System Administrator",
      }

  return (
    <div className="mx-auto w-full max-w-[1600px] animate-in px-4 pb-12 duration-700 fade-in sm:px-6 lg:px-8">
      <ContextBlock
        title={isOwnProfile ? "USER PROFILE" : "PROFILE OVERVIEW"}
        subtitle={isOwnProfile ? "Review your account identity, activity progress, and settings." : "Read-only view of a user profile in the operations terminal."}
        operation="PROFILE-MGMT"
        status="ONLINE"
        accentColor="system"
      />

      {/* Optional: Banner if viewing someone else */}
      {!isOwnProfile && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-blue-500/20 bg-blue-500/10 px-4 py-3 font-sans text-sm text-blue-400">
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Viewing {profileData?.name || "Guest"}'s profile in Read-Only mode.
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column (Profile Card & Summary) */}
        <div className="space-y-6 lg:col-span-4 xl:col-span-3">
          <ProfileCard profileData={profileData} isOwnProfile={isOwnProfile} />
          <MissionSummary />
          <div className="rounded-xl border border-border bg-card p-4 backdrop-blur-md">
            <h3 className="mb-4 font-sans text-[10px] font-bold tracking-widest text-primary uppercase">
              System Status
            </h3>
            <div className="relative flex flex-col items-center justify-center p-8">
              <div className="absolute h-32 w-32 animate-[spin_8s_linear_infinite] rounded-full border border-border" />
              <div className="absolute h-24 w-24 animate-[spin_4s_linear_infinite_reverse] rounded-full border-t border-r border-fuchsia-500/50" />
              <div className="absolute h-16 w-16 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite] rounded-full border-b border-l border-border" />
              <div className="z-10 text-center">
                <span className="block font-sans text-xs text-success">
                  All Systems Operational
                </span>
                <span className="font-mono text-[9px] text-muted-foreground">
                  Uptime: 134d 21h 43m
                </span>
              </div>
            </div>
            <button className="mt-4 w-full rounded-md border border-border px-3 py-2 font-sans text-[10px] text-primary transition-colors hover:bg-primary/10">
              View System Health &rarr;
            </button>
          </div>
        </div>

        {/* Right Column (Everything Else) */}
        <div className="space-y-6 lg:col-span-8 xl:col-span-9">
          <MissionStats />

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div className="space-y-6">
              <ExpertiseBadges />
              <CurrentFocus />
            </div>
            <AchievementsList />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
            <div
              className={`col-span-1 ${!isOwnProfile ? "xl:col-span-2" : ""}`}
            >
              <RecentActivity />
            </div>
            <div className="col-span-1">
              <MissionBadges />
            </div>
            {isOwnProfile && (
              <div className="col-span-1">
                <QuickActions />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
