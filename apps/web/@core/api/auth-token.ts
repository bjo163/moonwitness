export function getAuthToken(): string | null {
  // Browser credentials are held only in the HttpOnly moon_session cookie.
  // It is intentionally inaccessible to JavaScript and forwarded by the BFF.
  return null
}
