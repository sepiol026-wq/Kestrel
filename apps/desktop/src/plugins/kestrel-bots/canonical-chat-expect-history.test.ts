// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

/**
 * The roster's history wait must key off rows a transcript read can paint
 * (`live_message_count`), not the denormalized `message_count` total: a chat
 * whose rows are all folded advertises history no reader serves, and waiting
 * for it wedges the open for the whole hydration budget before failing closed.
 */

import { describe, expect, it } from 'vitest'

import { resolveExpectHistory } from './canonical-chat'

describe('resolveExpectHistory', () => {
  it('waits for history only when a transcript read can paint rows', () => {
    expect(resolveExpectHistory({ live_message_count: 2, message_count: 2 })).toBe(true)
    expect(resolveExpectHistory({ live_message_count: 0, message_count: 2 })).toBe(false)
  })

  it('falls back to the denormalized total on older gateways', () => {
    expect(resolveExpectHistory({ message_count: 3 })).toBe(true)
    expect(resolveExpectHistory({ message_count: 0 })).toBe(false)
  })

  it('waits when no count is reported at all', () => {
    expect(resolveExpectHistory(null)).toBe(true)
    expect(resolveExpectHistory(undefined)).toBe(true)
    expect(resolveExpectHistory({})).toBe(true)
  })

  it('ignores non-finite counts the same way the open path always has', () => {
    expect(resolveExpectHistory({ live_message_count: Number.NaN, message_count: 1 })).toBe(true)
    expect(resolveExpectHistory({ message_count: Number.NaN })).toBe(true)
  })
})
