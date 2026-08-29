"use client"
import { useAuthSession } from "@moon/client"
import { LogOut, UserRound } from "lucide-react"
import { AccountNavigation } from "../../../components/profile/account-navigation"

export function ProfileView() {
  const { user, logout } = useAuthSession()

  const handleLogout = () => {
    if (confirm("Are you sure you want to log out?")) {
      logout()
      window.location.href = "/"
    }
  }

  return (
    <div
      className="theme-grid-bg min-h-screen px-4 py-8 font-mono text-foreground sm:px-6"
    >
      <div className="mx-auto max-w-5xl space-y-6 px-4 sm:px-6">
        <header><p className="text-xs tracking-widest text-cyber-cyan/70 uppercase">Operator account</p><h1 className="mt-2 font-orbitron text-3xl uppercase">Identity matrix</h1><p className="mt-2 text-sm text-muted-foreground">User profile and clearance levels.</p></header>
        <AccountNavigation active="Profile" />

        {user ? (
          <div className="panel-glass clip-card flex flex-col items-center justify-center gap-4 p-8 text-cyber-cyan">
            <div aria-hidden="true" className="clip-rune flex h-24 w-24 items-center justify-center border border-cyber-cyan/50 bg-cyber-cyan/10"><UserRound className="h-10 w-10" /></div>
            <h2 className="mt-2 text-2xl font-bold text-foreground">{user.name || "Operator"}</h2>
            <p className="text-cyber-cyan">{user.email}</p>

            <button
              onClick={handleLogout}
              className="clip-btn mt-6 flex items-center gap-2 border border-cyber-pink/50 bg-cyber-pink/10 px-6 py-2 text-cyber-pink transition-colors hover:bg-cyber-pink/20 focus:outline-none focus:ring-2 focus:ring-cyber-pink"
            >
              <LogOut className="h-4 w-4" /> LOGOUT SYSTEM
            </button>
          </div>
        ) : (
          <div className="panel-glass clip-card p-8 text-center"><p className="text-lg text-foreground">Profile not found</p><p className="mt-2 text-sm text-muted-foreground">No active session detected. Please login to access clearance levels.</p></div>
        )}
      </div>
    </div>
  )
}
