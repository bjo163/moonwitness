import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Routes that require authentication
const protectedRoutes = ["/erp", "/console"]

// Routes that require guest (e.g. login)
const guestRoutes = ["/login", "/register"]

export function proxy(request: NextRequest) {
  const token = request.cookies.get("moon_session")?.value
  const pathname = request.nextUrl.pathname

  // Check if it's a protected route
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )
  const isGuest = guestRoutes.some((route) => pathname.startsWith(route))

  if (isProtected && !token) {
    // Redirect to login if trying to access protected route without token
    const url = new URL("/login", request.url)
    url.searchParams.set("callbackUrl", encodeURI(pathname))
    return NextResponse.redirect(url)
  }

  if (isGuest && token) {
    // Redirect to ERP/dashboard if trying to access login while already logged in
    return NextResponse.redirect(new URL("/erp/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.svg|.*\\.webp).*)",
  ],
}
