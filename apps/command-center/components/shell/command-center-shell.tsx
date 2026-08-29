"use client"

import React, { Suspense } from "react"
import { usePathname, useRouter } from "next/navigation"
import { CommandPalette, ErrorBoundary } from "@workspace/ui"
import { useAuthSession } from "@moon/client"
import { CommandCenterSidebar } from "../sidebar"
import { CommandCenterTopbar } from "../topbar"

export function CommandCenterShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { isAuthenticated, logout } = useAuthSession()
  const [sidebarOpen, setSidebarOpen] = React.useState(false)

  const isAuthRoute = pathname === "/login" || pathname === "/auth/login"

  // Redirect unauthenticated users to /login
  React.useEffect(() => {
    if (!isAuthenticated && !isAuthRoute) {
      router.push("/login")
    }
  }, [isAuthenticated, isAuthRoute, router])

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  // If on login route, render full-screen without sidebar/topbar
  if (isAuthRoute) {
    return <main className="min-h-screen w-full bg-background text-foreground">{children}</main>
  }

  // If not authenticated yet on protected route, show access verification loader
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background font-sans text-foreground">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="text-xs font-medium text-muted-foreground">
            Verifying access…
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Suspense fallback={null}>
        <CommandCenterSidebar onLogout={handleLogout} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </Suspense>
      <div className="flex min-h-screen flex-col lg:pl-72">
        <Suspense fallback={null}>
          <CommandCenterTopbar onMenu={() => setSidebarOpen(true)} />
        </Suspense>
        <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">
          <ErrorBoundary moduleId="COMMAND_CENTER">
            {children}
          </ErrorBoundary>
        </main>
      </div>
      <CommandPalette />
    </div>
  )
}
