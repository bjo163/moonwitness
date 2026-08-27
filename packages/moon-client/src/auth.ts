"use client"

import { useState, useEffect, useCallback } from "react"
import type {
  UserProfile,
  UserRole,
  OperatorClearance,
} from "@workspace/types"
import { apiGet, apiPost, AUTH_INVALIDATED_EVENT } from "./api-client"

export interface AuthSessionState {
  isAuthenticated: boolean
  user: UserProfile | null
  /** Kept for API compatibility; browser code never receives the bearer. */
  token: null
  clearance: OperatorClearance | null
}

const AUTH_CHANGE_EVENT = "mw_auth_session_change"

function anonymousSession(): AuthSessionState {
  return {
    isAuthenticated: false,
    user: null,
    token: null,
    clearance: null,
  }
}

function clearanceFor(user: UserProfile): OperatorClearance {
  const level = user.clearanceLevel || (user.role === "superadmin" || user.role === "admin" ? 3 : user.role === "moderator" ? 2 : 1)
  return {
    operatorId: user.email || "MW-OPERATOR",
    callsign: user.name || "OPERATOR",
    level,
    tier: level === 3 ? "OMEGA" : level === 2 ? "BETA" : "ALPHA",
    allowedModules: ["portal", "observatory", "command-center", "scriptures", "hadiths"],
    canApproveRfc: level >= 2,
    canDeployHotfix: level === 3,
  }
}

function sessionFromUser(user: UserProfile | null | undefined): AuthSessionState {
  if (!user) return anonymousSession()
  return {
    isAuthenticated: true,
    user,
    token: null,
    clearance: clearanceFor(user),
  }
}

/**
 * Browser storage is intentionally not an authentication source. The initial
 * state is anonymous until the same-origin BFF verifies the HttpOnly cookie.
 */
export function getStoredSession(): AuthSessionState {
  return anonymousSession()
}

/** @deprecated Browser bearer persistence is forbidden. Use refreshSession(). */
export function setStoredSession(_user: UserProfile, _token?: string): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT))
  }
}

export function clearStoredSession(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT))
  }
}

export async function refreshSession(): Promise<AuthSessionState> {
  try {
    const response = await apiGet<{ user?: UserProfile | null }>("/api/auth/session")
    return sessionFromUser(response?.user)
  } catch {
    return anonymousSession()
  }
}

export async function loginSession(credentials: {
  username?: string
  email?: string
  password?: string
  role?: UserRole
}): Promise<AuthSessionState> {
  const response = await apiPost<{ user?: UserProfile }>("/api/auth/session/login", credentials)
  const session = sessionFromUser(response?.user)
  if (!session.isAuthenticated) {
    throw new Error("Authentication failed")
  }
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT))
  }
  return session
}

export async function logoutSession(): Promise<void> {
  try {
    await apiPost("/api/auth/session/logout")
  } finally {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event(AUTH_INVALIDATED_EVENT))
      window.dispatchEvent(new Event(AUTH_CHANGE_EVENT))
    }
  }
}

/** Universal React hook backed by the server-owned HttpOnly session. */
export function useAuthSession() {
  const [session, setSession] = useState<AuthSessionState>(anonymousSession)

  const syncSession = useCallback(async () => {
    setSession(await refreshSession())
  }, [])

  useEffect(() => {
    void syncSession()

    const onAuthChange = () => { void syncSession() }
    const onInvalidated = () => setSession(anonymousSession())
    window.addEventListener(AUTH_CHANGE_EVENT, onAuthChange)
    window.addEventListener(AUTH_INVALIDATED_EVENT, onInvalidated)

    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, onAuthChange)
      window.removeEventListener(AUTH_INVALIDATED_EVENT, onInvalidated)
    }
  }, [syncSession])

  return {
    ...session,
    login: loginSession,
    logout: logoutSession,
    refresh: syncSession,
    hasClearance: (requiredLevel: 1 | 2 | 3) => {
      const level = session.clearance?.level || 0
      return level >= requiredLevel
    },
  }
}
