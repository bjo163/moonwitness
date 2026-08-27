"use client"

import React, { Suspense } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Sidebar, Topbar, CommandPalette, CosmicAudioToggle, ErrorBoundary } from "@workspace/ui"
import { useAuthSession } from "@moon/client"

export function CommandCenterShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { isAuthenticated, logout } = useAuthSession()

  const isAuthRoute = pathname === "/login" || pathname === "/auth/login"

  // Redirect unauthenticated operators to /login
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
    return <main className="min-h-screen w-full">{children}</main>
  }

  // If not authenticated yet on protected route, show clearance gate loader
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[#030508] font-mono text-cyan-400">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyber-purple border-t-transparent" />
          <span className="text-[10px] tracking-widest text-primary/70 uppercase">
            VERIFYING OPERATOR CLEARANCE...
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <Suspense fallback={null}>
        <Sidebar onLogout={handleLogout} />
      </Suspense>
      <div className="flex flex-1 flex-col pl-64">
        <Suspense fallback={null}>
          <Topbar />
        </Suspense>
        <main className="flex-1 overflow-x-hidden p-6 lg:p-8">
          <ErrorBoundary moduleId="COMMAND_CENTER">
            {children}
          </ErrorBoundary>
        </main>
      </div>
      <CommandPalette />
      <div className="fixed bottom-4 right-4 z-40 hidden sm:block">
        <CosmicAudioToggle />
      </div>
    </div>
  )
}
