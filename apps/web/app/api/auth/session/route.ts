import { NextRequest, NextResponse } from "next/server"
import {
  clearSessionCookie,
  requestApi,
  SESSION_COOKIE,
} from "@/lib/web-session"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value
  if (!token) {
    return NextResponse.json({ user: null }, { status: 401 })
  }

  const upstream = await requestApi("/auth/session", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!upstream.ok) {
    const response = NextResponse.json({ user: null }, { status: upstream.status })
    if (upstream.status === 401 || upstream.status === 403) {
      clearSessionCookie(response)
    }
    return response
  }

  const payload = await upstream.json()
  return NextResponse.json({ user: payload.user ?? payload })
}
