import { NextRequest, NextResponse } from "next/server"
import { APP_PORTS } from "@workspace/types"

export const SESSION_COOKIE = "mw_session"

const apiBaseUrl =
  process.env.MOON_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  `http://127.0.0.1:${APP_PORTS.API_BACKEND}`

export function getApiUrl(path: string): URL {
  return new URL(path, `${apiBaseUrl.replace(/\/$/, "")}/`)
}

export function isTrustedSameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin")
  return Boolean(origin && origin === request.nextUrl.origin)
}

export function setSessionCookie(response: NextResponse, token: string): void {
  response.cookies.set({
    name: SESSION_COOKIE,
    value: token,
    httpOnly: false, // Accessible for client-side cross-tab/cross-app detection
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 86400 * 7,
  })
}

export function clearSessionCookie(response: NextResponse): void {
  response.cookies.set({
    name: SESSION_COOKIE,
    value: "",
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  })
}

export async function requestApi(
  path: string,
  init: RequestInit = {}
): Promise<Response> {
  return fetch(getApiUrl(path), {
    ...init,
    cache: "no-store",
  })
}
