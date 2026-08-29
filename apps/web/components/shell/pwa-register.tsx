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
        <div className="fixed right-4 bottom-16 z-50 flex animate-bounce items-center gap-2 rounded-2xl bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 shadow-xl">
          <span>📡 Mode Offline Aktif</span>
          <span className="text-[10px] opacity-80">
            (Membaca Data Ter-Cache)
          </span>
        </div>
      )}

      {showInstallBanner && !isOffline && (
        <div className="bg-card/90 fixed bottom-16 left-1/2 z-50 flex -translate-x-1/2 items-center gap-4 rounded-xl border border-border p-4 shadow-sm backdrop-blur-md">
          <div className="flex flex-col">
            <span className="font-sans text-sm font-bold tracking-wider text-white uppercase">
              Install MoonWitness OS
            </span>
            <span className="font-mono text-[10px] text-primary">
              Access offline via dedicated app
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowInstallBanner(false)}
              className="rounded border border-white/20 bg-black/40 px-3 py-1 font-mono text-[10px] text-slate-300 hover:text-white"
            >
              DISMISS
            </button>
            <button
              onClick={handleInstallClick}
              className="rounded bg-primary px-3 py-1 font-mono text-[10px] font-bold text-black shadow-sm hover:bg-primary"
            >
              INSTALL
            </button>
          </div>
        </div>
      )}
    </>
  )
}
