import { randomBytes } from "node:crypto"
import type { OdooSession } from "./client.js"

type Entry = OdooSession & { expiresAt: number }
const sessions = new Map<string, Entry>()
const TTL_MS = 8 * 60 * 60 * 1000

export function storeOdooSession(session: OdooSession): string {
  const key = randomBytes(32).toString("base64url")
  sessions.set(key, { ...session, expiresAt: Date.now() + TTL_MS })
  return key
}

export function getOdooSession(key: string): OdooSession | null {
  const entry = sessions.get(key)
  if (!entry || entry.expiresAt <= Date.now()) { if (entry) sessions.delete(key); return null }
  return entry
}

export function invalidateOdooSession(key: string): void { sessions.delete(key) }
