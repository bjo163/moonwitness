---
name: jwt-token-version-session-revocation
description: >-
  Use this skill when auditing or implementing JSON Web Token (JWT) issuance, cryptographic signature
  verification, tokenVersion counter invalidation, and instant global/single session revocation.
---

# JWT Token Version & Session Revocation (Subatomic Skill)

Governs stateless authentication and instant revocation without requiring distributed blacklist databases, using an incremental `tokenVersion` counter model.

## Revocation Mechanism

Standard stateless JWTs cannot be revoked until their expiration window ($t_{\text{exp}}$) elapses.
MoonWitness pairs every issued JWT payload with the user's active database `tokenVersion`:

```typescript
interface JWTPayload {
  sub: number            // User ID
  email: string
  roles: string[]
  tokenVersion: number   // Monotonically increasing version counter
  iat: number            // Issued at
  exp: number            // Expiration timestamp
}
```

### Verification Pipeline
On every authenticated request:
1. Fastify middleware cryptographically verifies signature using `ED25519` or `RS256` public key.
2. Fastify middleware inspects cached `tokenVersion` for `sub`:
   ```typescript
   const currentVersion = await userVersionCache.get(payload.sub)
   if (payload.tokenVersion !== currentVersion) {
     throw new UnauthorizedError('SESSION_REVOKED', 'This session has been revoked.')
   }
   ```

### Instant Revocation Actions
- **Single Session Logout**: Invalidate specific session ID cookie/entry.
- **Global Logout / Password Reset**:
  ```sql
  UPDATE res_users SET token_version = token_version + 1 WHERE id = :user_id;
  ```
  Immediately invalidates all existing JWTs across all mobile, browser, and desktop clients in $< 5\text{ms}$.

## Canonical Source Files
- `packages/moon-server/src/utils/auth.ts`
- `packages/moon-server/src/handlers/auth.ts`
- `packages/moon-protocol/src/`

## Verification Command
```bash
pnpm --filter=@moon/server test
```
