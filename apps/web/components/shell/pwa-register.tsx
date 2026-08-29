"use client"

import { useEffect, useState } from "react"
import { useMounted, useKonami } from "@workspace/hooks"
import { flushOfflineQueue } from "@moon/client"

export function PwaRegister() {
  const [isOffline, setIsOffline] = useState(false)
  const [installPromptEvent, setInstallPromptEvent] = useState<any>(null)
  const [showInstallBanner, setShowInstallBanner] = useState(false)
  const mounted = useMounted()

  // Enable Easter egg globally
  useKonami()

  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      if (process.env.NODE_ENV === "development") {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          for (const registration of registrations) {
            registration.unregister()
          }
        })
        return
      }

      navigator.serviceWorker
        .register("/sw.js")
        .then(() => {
          // Registration successful
        })
        .catch(() => {
          // Registration failed
        })

      const handleOnline = () => {
        setIsOffline(false)
        flushOfflineQueue()
      }
      const handleOffline = () => setIsOffline(true)

      const handleBeforeInstallPrompt = (e: any) => {
        e.preventDefault()
        setInstallPromptEvent(e)
        setShowInstallBanner(true)
      }

      window.addEventListener("online", handleOnline)
      window.addEventListener("offline", handleOffline)
      window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

      if (!navigator.onLine) setTimeout(() => setIsOffline(true), 0)

      return () => {
        window.removeEventListener("online", handleOnline)
        window.removeEventListener("offline", handleOffline)
        window.removeEventListener(
          "beforeinstallprompt",
          handleBeforeInstallPrompt
        )
      }
    }
  }, [])

  const handleInstallClick = async () => {
    if (!installPromptEvent) return
    installPromptEvent.prompt()
    const { outcome } = await installPromptEvent.userChoice
    if (outcome === "accepted") {
      setShowInstallBanner(false)
    }
    setInstallPromptEvent(null)
  }

  return (
    <>
      {isOffline && (
        <div className="border-warning/50 text-warning fixed right-4 bottom-16 z-50 flex items-center gap-2 rounded-md border bg-card px-4 py-2 text-sm">
          <span>Offline mode</span>
          <span className="text-xs text-muted-foreground">
            Cached data available
          </span>
        </div>
      )}

      {showInstallBanner && !isOffline && (
        <div className="fixed bottom-16 left-1/2 z-50 flex -translate-x-1/2 items-center gap-4 rounded-lg border border-primary/40 bg-card p-4">
          <div className="flex flex-col">
            <span className="font-sans text-sm font-semibold text-foreground">
              Install MoonWitness OS
            </span>
            <span className="text-xs text-muted-foreground">
              Access cached modules from the dedicated app
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowInstallBanner(false)}
              className="rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              Dismiss
            </button>
            <button
              onClick={handleInstallClick}
              className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Install
            </button>
          </div>
        </div>
      )}
    </>
  )
}
