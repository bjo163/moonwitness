const AUTH_COOKIE = "moon_token"
const AUTH_STORAGE_KEY = "moon_store"

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null

  const cookieToken = document.cookie
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${AUTH_COOKIE}=`))
    ?.split("=")[1]

  if (cookieToken) return decodeURIComponent(cookieToken)

  try {
    const storedState = localStorage.getItem(AUTH_STORAGE_KEY)
    const token = storedState
      ? JSON.parse(storedState).state?.user?.token
      : null
    return typeof token === "string" && token.length > 0 ? token : null
  } catch {
    return null
  }
}
