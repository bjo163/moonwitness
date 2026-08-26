import { NextRequest, NextResponse } from "next/server"
import {
  isTrustedSameOrigin,
  requestApi,
  setSessionCookie,
} from "@core/api/web-session"

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  if (!isTrustedSameOrigin(request)) {
    return NextResponse.json({ error: "Invalid request origin" }, { status: 403 })
  }

  const body = await request.text()
  const upstream = await requestApi("/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  })
  const payload = await upstream.json()

  if (!upstream.ok) {
    return NextResponse.json(payload, { status: upstream.status })
  }

  const response = NextResponse.json({ user: payload.user }, { status: upstream.status })
  setSessionCookie(response, payload.token)
  return response
}
