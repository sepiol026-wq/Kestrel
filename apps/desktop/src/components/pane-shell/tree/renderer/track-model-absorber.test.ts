// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { describe, expect, it } from 'vitest'

import { allFixedAbsorberIndex } from './track-model'

describe('allFixedAbsorberIndex', () => {
  it('picks the last uncapped track', () => {
    // terminal (uncapped height) + logs (uncapped) → logs absorbs
    const growable = [0, 1]
    const max = (i: number) => (i === 0 ? '80vh' : undefined)

    expect(allFixedAbsorberIndex(growable, max)).toBe(1)
  })

  it('skips a capped last track and picks an earlier uncapped one', () => {
    // uncapped tool panel + capped files rail at the end of a column
    const growable = [0, 1]
    const max = (i: number) => (i === 1 ? '20rem' : undefined)

    expect(allFixedAbsorberIndex(growable, max)).toBe(0)
  })

  it('refuses to absorb when every fixed track is capped (review/files rail)', () => {
    // Default right rail: review | preview | files — all declare maxWidth.
    // Promoting any of them to grow-1 dropped the clamp and ballooned ⌘G/⌘J.
    const growable = [0, 1, 2]
    const max = () => '20rem'

    expect(allFixedAbsorberIndex(growable, max)).toBe(-1)
  })

  it('refuses a lone capped sidebar', () => {
    // ⌘G alone: only review is visible in the rail — must stay at 237px / max 20rem.
    expect(allFixedAbsorberIndex([0], () => '20rem')).toBe(-1)
  })
})
