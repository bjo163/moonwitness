const mutationWindows = new Map<string, { started: number; count: number }>()
const MUTATION_LIMIT = 120
const MUTATION_WINDOW_MS = 60_000

export function isMutationRateLimited(remoteAddress: string | undefined, method: string | undefined, now = Date.now()): boolean {
  if (method === 'GET') return false

  const key = `${remoteAddress || 'unknown'}:${method || 'unknown'}`
  const current = mutationWindows.get(key)
  if (!current || now - current.started >= MUTATION_WINDOW_MS) {
    mutationWindows.set(key, { started: now, count: 1 })
    return false
  }

  current.count += 1
  return current.count > MUTATION_LIMIT
}

export function resetMutationRateLimitForTests(): void {
  mutationWindows.clear()
}
