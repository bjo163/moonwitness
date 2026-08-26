import { NextRequest, NextResponse } from "next/server"

export const SESSION_COOKIE = "moon_session"

const apiBaseUrl =
  process.env.MOON_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:4000"

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
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  })
}

export function clearSessionCookie(response: NextResponse): void {
  response.cookies.set({
    name: SESSION_COOKIE,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
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
