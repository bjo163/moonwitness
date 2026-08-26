import { useState, useEffect } from "react"
import { useMoonStore } from "@core/store/moon-store"

export type UserProfile = {
  email: string
  name: string
  role: "public" | "admin"
  avatar: string
}

export function useUserProfile() {
  const { user } = useMoonStore()
  const [profile, setProfile] = useState<UserProfile | null>(null)

  useEffect(() => {
    // 1. Check MoonStore first
    if (user) {
      setProfile({
        email: user.email,
        name: user.name || "User",
        role: user.role || "public",
        avatar: user.avatar || "🌙",
      })
      return
    }

    // 2. Fallback to backward-compatible localStorage
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("mw_user_profile")
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          setProfile(parsed)
        } catch (e) {
          console.warn("Failed to parse saved user profile:", e)
        }
      }
    }
  }, [user])

  const saveProfile = (newProfile: UserProfile) => {
    setProfile(newProfile)
    if (typeof window !== "undefined") {
      localStorage.setItem("mw_user_profile", JSON.stringify(newProfile))
      window.dispatchEvent(new Event("storage"))
    }
  }

  return { profile, saveProfile }
}
