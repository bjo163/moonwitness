import { describe, it, expect } from 'vitest'
import {
  AccountAccount,
  AccountJournal,
  AccountMove,
  AccountMoveLine
} from '../src/index.ts'
import accountAddon from '../src/index.js'

describe('@moon/account Addon (#22)', () => {
  it('exports addon manifest with base dependency', () => {
    expect(accountAddon.name).toBe('account')
    expect(accountAddon.depends).toContain('base')
    expect(accountAddon.models.length).toBe(4)
  })

  it('defines chart of accounts and journal models', () => {
    expect(AccountAccount._name).toBe('account.account')
    expect(AccountJournal._name).toBe('account.journal')
    expect(AccountMove._name).toBe('account.move')
    expect(AccountMoveLine._name).toBe('account.move.line')
  })
})
