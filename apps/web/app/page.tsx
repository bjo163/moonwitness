"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function RootRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    const profileStr = localStorage.getItem("mw_user_profile")
    if (profileStr) {
      try {
        const profile = JSON.parse(profileStr)
        if (profile.role === "admin") {
          router.replace("/erp/dashboard")
        } else {
          router.replace("/home")
        }
      } catch {
        router.replace("/auth/login")
      }
    } else {
      router.replace("/auth/login")
    }
  }, [router])

  return (
    <div className="bg-space flex min-h-screen items-center justify-center font-mono text-cyan-500">
      <div className="animate-pulse tracking-widest uppercase">
        AUTHENTICATING CREDENTIALS...
      </div>
    </div>
  )
}
