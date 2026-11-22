// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { describe, expect, it } from 'vitest'

import { formatMessageTimestamp, formatTimelineRange, formatTimelineTimestamp } from './timestamp'

const labels = {
  today: (time: string) => `Today at ${time}`,
  yesterday: (time: string) => `Yesterday at ${time}`
}

describe('formatMessageTimestamp', () => {
  it('returns an empty string for missing values', () => {
    expect(formatMessageTimestamp(undefined, labels)).toBe('')
    expect(formatMessageTimestamp('not-a-date', labels)).toBe('')
  })

  it('uses the today label for timestamps earlier today', () => {
    const now = new Date()
    const earlierToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 30)
    expect(formatMessageTimestamp(earlierToday, labels)).toMatch(/^Today at /)
  })

  it('uses the yesterday label for timestamps the prior day', () => {
    const now = new Date()
    const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8, 0)
    yesterday.setDate(yesterday.getDate() - 1)
    expect(formatMessageTimestamp(yesterday, labels)).toMatch(/^Yesterday at /)
  })

  it('falls back to an absolute format for older timestamps', () => {
    const old = new Date(2020, 0, 15, 9, 30)
    const out = formatMessageTimestamp(old, labels)
    expect(out).not.toMatch(/^Today at /)
    expect(out).not.toMatch(/^Yesterday at /)
    expect(out.length).toBeGreaterThan(0)
  })
})

describe('precise timeline timestamps', () => {
  it('includes seconds and milliseconds for an event', () => {
    const local = new Date(2026, 4, 1, 13, 2, 3, 456)
    const formatted = formatTimelineTimestamp(local.getTime() / 1000)

    const expected = new Intl.DateTimeFormat(undefined, {
      fractionalSecondDigits: 3,
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit'
    }).format(local)

    expect(formatted).toBe(expected)
  })

  it('returns an empty string for invalid timeline values', () => {
    expect(formatTimelineTimestamp(undefined)).toBe('')
    expect(formatTimelineTimestamp(Number.NaN)).toBe('')
    expect(formatTimelineRange(undefined, 10)).toBe('')
  })
})
