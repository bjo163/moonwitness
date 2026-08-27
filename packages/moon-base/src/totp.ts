import { createHmac, randomBytes } from 'node:crypto'

const BASE32_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'

/**
 * Generate a cryptographically random Base32 secret for TOTP (160-bit key)
 */
export function generateTotpSecret(length = 32): string {
  const bytes = randomBytes(length)
  let secret = ''
  for (let i = 0; i < bytes.length; i++) {
    secret += BASE32_CHARS[bytes[i]! % 32]
  }
  return secret
}

/**
 * Decode Base32 string into a Buffer
 */
function base32Decode(base32: string): Buffer {
  const clean = base32.toUpperCase().replace(/=+$/, '')
  let bits = 0
  let value = 0
  const output: number[] = []

  for (let i = 0; i < clean.length; i++) {
    const idx = BASE32_CHARS.indexOf(clean[i]!)
    if (idx === -1) continue
    value = (value << 5) | idx
    bits += 5

    if (bits >= 8) {
      output.push((value >>> (bits - 8)) & 255)
      bits -= 8
    }
  }

  return Buffer.from(output)
}

/**
 * Generate RFC 6238 TOTP Code
 */
export function generateTotp(secret: string, timeStep = 30, digits = 6, timestamp = Date.now()): string {
  const epoch = Math.floor(timestamp / 1000)
  const counter = Math.floor(epoch / timeStep)

  const buf = Buffer.alloc(8)
  buf.writeBigUInt64BE(BigInt(counter), 0)

  const key = base32Decode(secret)
  const hmac = createHmac('sha1', key).update(buf).digest()

  const offset = hmac[hmac.length - 1]! & 0xf
  const code =
    ((hmac[offset]! & 0x7f) << 24) |
    ((hmac[offset + 1]! & 0xff) << 16) |
    ((hmac[offset + 2]! & 0xff) << 8) |
    (hmac[offset + 3]! & 0xff)

  const otp = (code % 10 ** digits).toString().padStart(digits, '0')
  return otp
}

/**
 * Verify a TOTP code within a given time window (e.g. ±1 step = ±30s)
 */
export function verifyTotp(token: string, secret: string, window = 1, timeStep = 30): boolean {
  if (!token || !secret || token.length !== 6) return false
  const now = Date.now()

  for (let step = -window; step <= window; step++) {
    const ts = now + step * timeStep * 1000
    const expected = generateTotp(secret, timeStep, 6, ts)
    if (token === expected) return true
  }

  return false
}

/**
 * Construct standard otpauth:// URI for Authenticator apps (Google Authenticator, Authy, Apple Passwords)
 */
export function generateTotpUri(account: string, issuer = 'MoonWitness OS', secret: string): string {
  return `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(account)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=6&period=30`
}
