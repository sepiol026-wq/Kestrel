// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

/**
 * The walk is one lap: a tip that has already been on screen — closed by the
 * timer, not only by the ✕ — is never offered again, and once every tip has
 * had its moment the rotation is spent rather than starting the tour over.
 */

import { describe, expect, it } from 'vitest'

import { nextTip } from './rotation'

const ORDER = ['a', 'b', 'c'] as const

describe('nextTip', () => {
  it('steps over tips that have already been shown, retired or not', () => {
    expect(nextTip(ORDER, ORDER, { lastShownId: 'a', retired: [], seen: ['a', 'b'] })).toBe('c')
    // Wrapping past the end lands on an unseen tip, never on one already shown.
    expect(nextTip(ORDER, ORDER, { lastShownId: 'c', retired: [], seen: ['b', 'c'] })).toBe('a')
  })

  it('runs dry once every tip has been shown once', () => {
    expect(nextTip(ORDER, ORDER, { lastShownId: 'c', retired: [], seen: [...ORDER] })).toBeNull()
  })
})
