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
  const { isAuthenticated, isLoading, logout } = useAuthSession()
  const [sidebarOpen, setSidebarOpen] = React.useState(false)
  const menuButtonRef = React.useRef<HTMLButtonElement>(null)

  React.useEffect(() => {
    if (!sidebarOpen) return

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return
      setSidebarOpen(false)
      menuButtonRef.current?.focus()
    }

    window.addEventListener("keydown", closeOnEscape)
    return () => window.removeEventListener("keydown", closeOnEscape)
  }, [sidebarOpen])

  const isAuthRoute = pathname === "/login" || pathname === "/auth/login"

  // Redirect unauthenticated users to /login
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated && !isAuthRoute) {
      router.push("/login")
    }
  }, [isAuthenticated, isAuthRoute, isLoading, router])

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const closeSidebar = () => {
    setSidebarOpen(false)
    menuButtonRef.current?.focus()
  }

  // If on login route, render full-screen without sidebar/topbar
  if (isAuthRoute) {
    return <main className="min-h-screen w-full bg-background text-foreground">{children}</main>
  }

  // If not authenticated yet on protected route, show access verification loader
  if (isLoading) {
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

  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Suspense fallback={null}>
        <CommandCenterSidebar
          onLogout={handleLogout}
          open={sidebarOpen}
          onClose={closeSidebar}
        />
      </Suspense>
      <div className="flex min-h-screen flex-col lg:pl-72">
        <Suspense fallback={null}>
          <CommandCenterTopbar
            onMenu={() => setSidebarOpen((isOpen) => !isOpen)}
            sidebarOpen={sidebarOpen}
            menuButtonRef={menuButtonRef}
          />
        </Suspense>
        <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">
          <ErrorBoundary moduleId="COMMAND_CENTER">
            {children}
          </ErrorBoundary>
        </main>
      </div>
      <CommandPalette commandCenterUrl="" />
    </div>
  )
}
