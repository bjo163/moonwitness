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
        <header>
          <p className="text-xs tracking-widest text-primary/70 uppercase">Account Details</p>
          <h1 className="mt-2 font-sans text-3xl font-bold uppercase">User Profile</h1>
          <p className="mt-2 text-sm text-muted-foreground">User profile and security permissions.</p>
        </header>
        <AccountNavigation active="Profile" />

        {user ? (
          <div className="rounded-xl border border-border bg-card flex flex-col items-center justify-center gap-4 p-8 text-primary shadow-sm">
            <div aria-hidden="true" className="rounded-full flex h-24 w-24 items-center justify-center border border-primary/40 bg-primary/10">
              <UserRound className="h-10 w-10 text-primary" />
            </div>
            <h2 className="mt-2 text-2xl font-bold text-foreground">{user.name || "User"}</h2>
            <p className="text-primary font-mono text-sm">{user.email}</p>

            <button
              onClick={handleLogout}
              className="rounded-md mt-6 flex items-center gap-2 border border-destructive/40 bg-destructive/10 px-6 py-2 text-xs font-bold font-mono tracking-wider text-destructive transition-colors hover:bg-destructive/20 focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <LogOut className="h-4 w-4" /> Sign Out
            </button>
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card p-8 text-center shadow-sm">
            <p className="text-lg font-semibold text-foreground">Profile not found</p>
            <p className="mt-2 text-sm text-muted-foreground">No active session detected. Please sign in to access your profile.</p>
          </div>
        )}
      </div>
    </div>
  )
}
