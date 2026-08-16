"use client"
import { Suspense } from "react"
import { ContextBlock } from "@core/ui"
import { EmptyState } from "@core/ui/empty-state"

import { useMoonStore } from "@core/store/moon-store"
import { LogOut } from "lucide-react"

export function ProfileView() {
  const { user, logout } = useMoonStore()

  const handleLogout = () => {
    if (confirm("Are you sure you want to log out?")) {
      logout()
      window.location.href = "/"
    }
  }

  return (
    <div
      className="theme-grid-bg min-h-screen py-8 font-mono text-foreground"
      suppressHydrationWarning
    >
      <div className="mx-auto max-w-5xl space-y-6 px-4 sm:px-6">
        <ContextBlock
          title="IDENTITY MATRIX"
          subtitle="User profile and clearance levels."
          operation="IDENTITY-SCAN"
          status="ONLINE"
          accentColor="knowledge"
        />
        
        {user ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-cyan-500/20 bg-black/40 p-8 text-cyan-500 backdrop-blur-xl gap-4">
            <div className="relative flex items-center justify-center">
              <svg className="absolute -inset-2 h-28 w-28 -rotate-90" viewBox="0 0 100 100">
                {/* Background Ring */}
                <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(0, 240, 255, 0.1)" strokeWidth="4" />
                {/* Progress Ring (75% XP for mockup) */}
                <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="289" strokeDashoffset="72" className="text-cyan-400 drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]" strokeLinecap="round" />
              </svg>
              <div className="w-24 h-24 rounded-full border border-cyan-500/50 bg-cyan-900/20 flex items-center justify-center overflow-hidden z-10">
                 <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}&backgroundColor=0f172a`} alt="Avatar" className="w-full h-full object-cover" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mt-2">{user.name}</h2>
            <p className="text-cyan-400">{user.email}</p>
            
            <button 
              onClick={handleLogout}
              className="mt-6 flex items-center gap-2 rounded border border-red-500/50 bg-red-500/10 px-6 py-2 text-red-400 transition-colors hover:bg-red-500/20"
            >
              <LogOut className="h-4 w-4" /> LOGOUT SYSTEM
            </button>
          </div>
        ) : (
          <EmptyState 
            title="PROFILE NOT FOUND" 
            message="No active session detected. Please login to access clearance levels." 
            variant="warning"
          />
        )}
      </div>
    </div>
  )
}
