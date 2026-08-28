import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  transaction: vi.fn(),
}))

vi.mock('../src/config.js', () => ({
  getDb: () => ({ transaction: mocks.transaction }),
}))

import { createCtx } from '../src/env.js'

describe('Moon ORM transaction context', () => {
  beforeEach(() => {
    mocks.transaction.mockReset()
  })

  it('opens a real database transaction for a normal context', async () => {
    const trx = { commit: vi.fn(), rollback: vi.fn() }
    mocks.transaction.mockImplementation(async (callback: (trx: unknown) => Promise<unknown>) => callback(trx))

    const env = createCtx(42)
    let seenTransaction: unknown

    const result = await env.transaction(async (txEnv) => {
      seenTransaction = txEnv.trx
      return 'ok'
    })

    expect(result).toBe('ok')
    expect(mocks.transaction).toHaveBeenCalledTimes(1)
    expect(seenTransaction).toBe(trx)
    expect(env.trx).toBeUndefined()
  })

  it('reuses an existing transaction for nested work', async () => {
    const trx = { commit: vi.fn(), rollback: vi.fn() }
    mocks.transaction.mockImplementation(async (callback: (trx: unknown) => Promise<unknown>) => callback(trx))

    const env = createCtx(42)

    await env.transaction(async (txEnv) => {
      const outerTransaction = txEnv.trx

      await txEnv.transaction(async (nestedEnv) => {
        expect(nestedEnv).toBe(txEnv)
        expect(nestedEnv.trx).toBe(outerTransaction)
      })
    })

    expect(mocks.transaction).toHaveBeenCalledTimes(1)
  })

  it('does not commit staged work when the transaction callback throws', async () => {
    const committed: string[] = []

    mocks.transaction.mockImplementation(async (callback: (trx: unknown) => Promise<unknown>) => {
      const staged: string[] = []
      const trx = {
        stage(value: string) {
          staged.push(value)
        },
      }

      try {
        const result = await callback(trx)
        committed.push(...staged)
        return result
      } catch (error) {
        throw error
      }
    })

    const env = createCtx(42)

    await expect(
      env.transaction(async (txEnv) => {
        ;(txEnv.trx as unknown as { stage(value: string): void }).stage('partial-write')
        throw new Error('boom')
      })
    ).rejects.toThrow('boom')

    expect(committed).toEqual([])
    expect(mocks.transaction).toHaveBeenCalledTimes(1)
  })
})
