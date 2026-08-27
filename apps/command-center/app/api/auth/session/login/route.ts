import { NextRequest, NextResponse } from "next/server"
import {
  requestApi,
  setSessionCookie,
} from "@/lib/auth-session"

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    const bodyStr = await request.text()
    const upstream = await requestApi("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: bodyStr,
    })

    const payload = await upstream.json()

    if (!upstream.ok) {
      return NextResponse.json(
        { error: payload.error || "Invalid credentials" },
        { status: upstream.status }
      )
    }

    const response = NextResponse.json({
      success: true,
      user: payload.user,
      token: payload.token,
    })

    if (payload.token) {
      setSessionCookie(response, payload.token)
    }

    return response
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to reach authentication server" },
      { status: 500 }
    )
  }
}
