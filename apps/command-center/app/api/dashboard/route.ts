import { NextRequest, NextResponse } from "next/server"
import { getApiUrl, SESSION_COOKIE } from "@/lib/auth-session"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const headers = new Headers({ accept: "application/json" })
  const token = request.cookies.get(SESSION_COOKIE)?.value
  if (token) headers.set("authorization", `Bearer ${token}`)

  const upstream = await fetch(getApiUrl("/api/command-center/dashboard"), {
    headers,
    cache: "no-store",
  })
  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers: { "content-type": upstream.headers.get("content-type") || "application/json" },
  })
}
