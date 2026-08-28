import { describe, it, expect, vi } from 'vitest'
import { setupOrm, getDb, teardownOrm, closeDb } from '../src/index.js'

describe('Database Connection Lifecycle & Teardown (#20)', () => {
  it('initializes DB, retrieves instance, and cleanly tears down pool', async () => {
    const fakeDestroy = vi.fn().mockResolvedValue(undefined)
    const fakeKnex: any = {
      select: vi.fn(),
      on: vi.fn(),
      destroy: fakeDestroy,
    }

    setupOrm(fakeKnex)
    expect(getDb()).toBe(fakeKnex)

    await teardownOrm()
    expect(fakeDestroy).toHaveBeenCalledTimes(1)

    // After teardown, getDb throws because ORM is uninitialized
    expect(() => getDb()).toThrow('ORM has not been initialized')
  })

  it('allows safe re-initialization after closeDb', async () => {
    const fakeDestroy1 = vi.fn().mockResolvedValue(undefined)
    const fakeKnex1: any = { select: vi.fn(), on: vi.fn(), destroy: fakeDestroy1 }

    setupOrm(fakeKnex1)
    expect(getDb()).toBe(fakeKnex1)
    await closeDb()
    expect(fakeDestroy1).toHaveBeenCalledTimes(1)

    const fakeDestroy2 = vi.fn().mockResolvedValue(undefined)
    const fakeKnex2: any = { select: vi.fn(), on: vi.fn(), destroy: fakeDestroy2 }

    setupOrm(fakeKnex2)
    expect(getDb()).toBe(fakeKnex2)
    await closeDb()
    expect(fakeDestroy2).toHaveBeenCalledTimes(1)
  })
})
