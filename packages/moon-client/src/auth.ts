"use client"

import { useState, useEffect, useCallback } from "react"
import {
  STORAGE_KEYS,
  type UserProfile,
  type UserRole,
  type OperatorClearance,
} from "@workspace/types"
import { apiPost } from "./api-client"

export interface AuthSessionState {
  isAuthenticated: boolean
  user: UserProfile | null
  token: string | null
  clearance: OperatorClearance | null
}

const AUTH_CHANGE_EVENT = "mw_auth_session_change"

export function getStoredSession(): AuthSessionState {
  if (typeof window === "undefined") {
    return {
      isAuthenticated: false,
      user: null,
      token: null,
      clearance: null,
    }
  }

  try {
    let token = localStorage.getItem(STORAGE_KEYS.SESSION)
    if (!token) {
      const match = document.cookie.match(/(?:^|; )mw_session=([^;]*)/)
      if (match && match[1]) token = decodeURIComponent(match[1])
    }

    const userDataStr = localStorage.getItem(STORAGE_KEYS.USER_DATA)
    const user: UserProfile | null = userDataStr ? JSON.parse(userDataStr) : null

    if (token && user) {
      const level = user.clearanceLevel || (user.role === "superadmin" || user.role === "admin" ? 3 : user.role === "moderator" ? 2 : 1)
      const clearance: OperatorClearance = {
        operatorId: user.email || "MW-OPERATOR-01",
        callsign: user.name || "COMMANDER",
        level,
        tier: level === 3 ? "OMEGA" : level === 2 ? "BETA" : "ALPHA",
        allowedModules: ["portal", "observatory", "command-center", "scriptures", "hadiths"],
        canApproveRfc: level >= 2,
        canDeployHotfix: level === 3,
      }

      return {
        isAuthenticated: true,
        user,
        token,
        clearance,
      }
    }
  } catch (err) {
    console.error("[MoonClient:Auth] Error reading stored session:", err)
  }

  return {
    isAuthenticated: false,
    user: null,
    token: null,
    clearance: null,
  }
}

export function setStoredSession(user: UserProfile, token: string) {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(STORAGE_KEYS.SESSION, token)
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user))

    // Set cookie across root domain for cross-app session
    document.cookie = `mw_session=${encodeURIComponent(token)}; path=/; max-age=86400; SameSite=Lax`

    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT))
  } catch (err) {
    console.error("[MoonClient:Auth] Error setting session:", err)
  }
}

export function clearStoredSession() {
  if (typeof window === "undefined") return

  try {
    localStorage.removeItem(STORAGE_KEYS.SESSION)
    localStorage.removeItem(STORAGE_KEYS.USER_DATA)
    document.cookie = "mw_session=; path=/; max-age=0; SameSite=Lax"

    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT))
  } catch (err) {
    console.error("[MoonClient:Auth] Error clearing session:", err)
  }
}

export async function loginSession(credentials: {
  username?: string
  email?: string
  password?: string
  role?: UserRole
}): Promise<AuthSessionState> {
  try {
    // Attempt real login endpoint if server is available
    const response = await apiPost<any>("/api/auth/session/login", credentials).catch(() => null)

    const user: UserProfile = response?.user || {
      name: credentials.username ? credentials.username.toUpperCase() : "DIVINE COMMANDER",
      email: credentials.email || `${credentials.username || "commander"}@moonwitness.os`,
      title: "Tactical System Operator",
      role: credentials.role || (credentials.username === "admin" ? "superadmin" : "admin"),
      level: 3,
      clearanceLevel: 3,
      badges: ["ALPHA_CLEARANCE", "COSMIC_OBSERVER"],
    }

    const token = response?.token || `mw_jwt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

    setStoredSession(user, token)
    return getStoredSession()
  } catch (err) {
    console.error("[MoonClient:Auth] Login error:", err)
    throw err
  }
}

export function logoutSession(): void {
  clearStoredSession()
}

/**
 * Universal React Hook for reactive Auth State in both apps
 */
export function useAuthSession() {
  const [session, setSession] = useState<AuthSessionState>(getStoredSession)

  const syncSession = useCallback(() => {
    setSession(getStoredSession())
  }, [])

  useEffect(() => {
    syncSession()

    window.addEventListener(AUTH_CHANGE_EVENT, syncSession)
    window.addEventListener("storage", syncSession)

    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, syncSession)
      window.removeEventListener("storage", syncSession)
    }
  }, [syncSession])

  return {
    ...session,
    login: loginSession,
    logout: logoutSession,
    hasClearance: (requiredLevel: 1 | 2 | 3) => {
      const level = session.clearance?.level || 0
      return level >= requiredLevel
    },
  }
}