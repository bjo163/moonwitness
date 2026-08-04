"use client"
import { Suspense } from "react"
import { ContextBlock } from "@core/ui"

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
            <div className="w-24 h-24 rounded-full border border-cyan-500/50 bg-cyan-900/20 flex items-center justify-center overflow-hidden">
               <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}&backgroundColor=0f172a`} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <h2 className="text-2xl font-bold text-white">{user.name}</h2>
            <p className="text-cyan-400">{user.email}</p>
            
            <button 
              onClick={handleLogout}
              className="mt-6 flex items-center gap-2 rounded border border-red-500/50 bg-red-500/10 px-6 py-2 text-red-400 transition-colors hover:bg-red-500/20"
            >
              <LogOut className="h-4 w-4" /> LOGOUT SYSTEM
            </button>
          </div>
        ) : (
          <div className="flex h-64 items-center justify-center rounded-2xl border border-cyan-500/20 bg-black/40 p-8 text-cyan-500/50 backdrop-blur-xl">
            PROFILE DATA NOT FOUND... PLEASE LOGIN.
          </div>
        )}
      </div>
    </div>
  )
}
