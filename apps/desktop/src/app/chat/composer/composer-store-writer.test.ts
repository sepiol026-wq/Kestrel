// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { createComposerStoreWriter } from './composer-store-writer'

describe('composer store writer — keystrokes reach the assistant-ui store without a write per character', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('writes an edge flip at once and coalesces the rest of a burst into one trailing write', () => {
    const write = vi.fn()
    const writer = createComposerStoreWriter(write, 100)

    writer.typing('h') // empty -> non-empty flips the send-button edge
    writer.typing('he')
    writer.typing('hel')
    writer.typing('hell')

    expect(write.mock.calls).toEqual([['h']])

    vi.advanceTimersByTime(100)

    expect(write.mock.calls).toEqual([['h'], ['hell']])
    expect(writer.pending()).toBe(false)
  })

  it('never lets a pending keystroke land after a later immediate write (send clears the draft)', () => {
    const write = vi.fn()
    const writer = createComposerStoreWriter(write, 100)

    writer.typing('h')
    writer.typing('hello')
    writer.now('')
    vi.advanceTimersByTime(500)

    expect(write.mock.calls).toEqual([['h'], ['']])
  })
})
