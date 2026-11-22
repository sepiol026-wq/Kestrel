// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { describe, expect, it } from 'vitest'

import { resolveShowEarlierAction } from './transcript-window'

describe('resolveShowEarlierAction', () => {
  it('spends the already-materialized DOM page first', () => {
    expect(resolveShowEarlierAction(3, true)).toBe('dom')
    expect(resolveShowEarlierAction(3, false)).toBe('dom')
  })

  it('expands the store window once the DOM page is exhausted', () => {
    expect(resolveShowEarlierAction(0, true)).toBe('window')
  })

  it('is a no-op when neither DOM nor store has older content', () => {
    expect(resolveShowEarlierAction(0, false)).toBe(null)
  })
})
