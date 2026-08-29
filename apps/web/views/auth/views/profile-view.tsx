"use client"

import React from "react"
import { useAuthSession } from "@moon/client"
import { ContextBlock, EmptyState } from "@workspace/ui"
import { LogOut } from "lucide-react"

export function ProfileView() {
  const { user, logout } = useAuthSession()

  const handleLogout = () => {
    logout()
    if (typeof window !== "undefined") {
      window.location.href = "/login"
    }
  }

  return (
    <div
      className="min-h-screen bg-background py-8 font-sans text-foreground"
      suppressHydrationWarning
    >
      <div className="mx-auto max-w-5xl space-y-6 px-4 sm:px-6">
        <ContextBlock
          title="User Profile"
          subtitle="Account details, profile settings, and permissions."
          operation="PROFILE"
          status="ONLINE"
        />

        {user ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-border bg-card p-8 text-card-foreground shadow-sm">
            <div className="relative flex items-center justify-center">
              <div className="z-10 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-border bg-muted">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}&backgroundColor=0f172a`}
                  alt="Avatar"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <h2 className="mt-2 text-2xl font-bold text-foreground">{user.name}</h2>
            <p className="text-sm text-muted-foreground">{user.email}</p>

            <button
              onClick={handleLogout}
              className="mt-6 flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-6 py-2 text-xs font-semibold text-destructive transition-colors hover:bg-destructive/20"
            >
              <LogOut className="h-4 w-4" /> Sign Out
            </button>
          </div>
        ) : (
          <EmptyState
            title="Profile Not Found"
            description="No active session detected. Please sign in to access your profile."
          />
        )}
      </div>
    </div>
  )
}
