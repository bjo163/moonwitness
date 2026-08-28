import { describe, it, expect } from 'vitest'
import {
  MailActivityType,
  MailActivity,
  MailMessage,
  MailTrackingValue,
  FxMsgAlias,
  FxTrackAlias
} from '../src/index.ts'
import mailAddon from '../src/index.ts'

describe('@moon/mail Addon (#32)', () => {
  it('exports addon manifest with base dependency', () => {
    expect(mailAddon.name).toBe('mail')
    expect(mailAddon.depends).toContain('base')
    expect(mailAddon.models.length).toBe(6)
  })

  it('defines activity and message models with correct metadata', () => {
    expect(MailActivityType._name).toBe('mail.activity.type')
    expect(MailActivity._name).toBe('mail.activity')
    expect(MailMessage._name).toBe('mail.message')
    expect(MailTrackingValue._name).toBe('mail.tracking.value')
    expect(FxMsgAlias._name).toBe('fx.msg')
    expect(FxTrackAlias._name).toBe('fx.track')
  })
})
