import { NextRequest, NextResponse } from "next/server"
import {
  clearSessionCookie,
  isTrustedSameOrigin,
  requestApi,
  SESSION_COOKIE,
} from "@core/api/web-session"

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  if (!isTrustedSameOrigin(request)) {
    return NextResponse.json({ error: "Invalid request origin" }, { status: 403 })
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value
  const upstream = token
    ? await requestApi("/auth/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })
    : null
  const response = NextResponse.json(
    upstream?.ok ? { message: "Logged out successfully" } : { message: "Session cleared" },
    { status: upstream && !upstream.ok ? upstream.status : 200 }
  )
  clearSessionCookie(response)
  return response
}
