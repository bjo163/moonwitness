"use client"

import { useAuthSession, setStoredSession } from "../auth"
import type { UserProfile } from "@workspace/types"

export function useUserProfile() {
  const session = useAuthSession()

  const saveProfile = (updated: Partial<UserProfile>) => {
    if (!session.user) return
    const newUser: UserProfile = {
      ...session.user,
      ...updated,
    }
    setStoredSession(newUser, session.token || "")
  }

  return {
    profile: session.user,
    saveProfile,
    clearance: session.clearance,
    isAuthenticated: session.isAuthenticated,
  }
}
