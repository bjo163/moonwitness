import { NextRequest, NextResponse } from "next/server"
import {
  getApiUrl,
  isTrustedSameOrigin,
  SESSION_COOKIE,
} from "@core/api/web-session"

export const dynamic = "force-dynamic"

const unsafeMethods = new Set(["POST", "PUT", "PATCH", "DELETE"])
type ProxyContext = { params: Promise<{ path: string[] }> }

async function proxy(request: NextRequest, context: ProxyContext) {
  if (unsafeMethods.has(request.method) && !isTrustedSameOrigin(request)) {
    return NextResponse.json({ error: "Invalid request origin" }, { status: 403 })
  }

  const { path } = await context.params
  const upstreamUrl = getApiUrl(`/${path.join("/")}`)
  upstreamUrl.search = request.nextUrl.search

  const headers = new Headers()
  const contentType = request.headers.get("content-type")
  const accept = request.headers.get("accept")
  const token = request.cookies.get(SESSION_COOKIE)?.value
  if (contentType) headers.set("content-type", contentType)
  if (accept) headers.set("accept", accept)
  if (token) headers.set("authorization", `Bearer ${token}`)

  const method = request.method
  const body = method === "GET" || method === "HEAD" ? undefined : await request.arrayBuffer()
  let upstream: Response
  try {
    upstream = await fetch(upstreamUrl, {
      method,
      headers,
      body,
      cache: "no-store",
      redirect: "error",
    })
  } catch {
    return NextResponse.json(
      { error: "Moon API is unavailable", code: "UPSTREAM_UNAVAILABLE" },
      { status: 502 }
    )
  }

  const responseHeaders = new Headers()
  for (const header of ["content-type", "cache-control"]) {
    const value = upstream.headers.get(header)
    if (value) responseHeaders.set(header, value)
  }
  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers: responseHeaders,
  })
}

export const GET = proxy
export const POST = proxy
export const PUT = proxy
export const PATCH = proxy
export const DELETE = proxy
