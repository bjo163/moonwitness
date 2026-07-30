"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useMoonStore } from "@core/store/moon-store"

export default function RootRedirectPage() {
  const router = useRouter()
  const { user } = useMoonStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    
    if (user) {
      if (user.partner_id) { // User has a partner profile (simulating role checks for now)
        router.replace("/home")
      } else {
        router.replace("/home")
      }
    } else {
      router.replace("/auth/login")
    }
  }, [router, user, mounted])

  return (
    <div className="bg-space flex min-h-screen items-center justify-center font-mono text-cyan-500">
      <div className="animate-pulse tracking-widest uppercase">
        AUTHENTICATING CREDENTIALS...
      </div>
    </div>
  )
}
