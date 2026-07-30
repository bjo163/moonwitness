"use client"

import { useEffect, useState } from "react"

export function PwaRegister() {
  const [isOffline, setIsOffline] = useState(false)

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

      const handleOnline = () => setIsOffline(false)
      const handleOffline = () => setIsOffline(true)

      window.addEventListener("online", handleOnline)
      window.addEventListener("offline", handleOffline)

      if (!navigator.onLine) setTimeout(() => setIsOffline(true), 0)

      return () => {
        window.removeEventListener("online", handleOnline)
        window.removeEventListener("offline", handleOffline)
      }
    }
  }, [])

  if (!isOffline) return null

  return (
    <div className="fixed right-4 bottom-4 z-50 flex animate-bounce items-center gap-2 rounded-2xl bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 shadow-xl">
      <span>📡 Mode Offline Aktif</span>
      <span className="text-[10px] opacity-80">(Membaca Data Ter-Cache)</span>
    </div>
  )
}
