import { describe, expect, it } from 'vitest'
import { MemoryStore } from '../src/index.js'
describe('@moon/cache', () => {
  it('stores, expires, remembers, and clears values', async () => {
    const store = new MemoryStore()
    store.set('key', { value: 1 })
    expect(store.get<{ value: number }>('key')).toEqual({ value: 1 })
    await expect(store.remember('key', 10, async () => ({ value: 2 }))).resolves.toEqual({ value: 1 })
    store.clear()
    expect(store.get('key')).toBeNull()
  })
})
