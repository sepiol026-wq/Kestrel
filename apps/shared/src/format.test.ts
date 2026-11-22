// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { describe, expect, it } from 'vitest'

import { compactNumber } from './format'

describe('compactNumber', () => {
  it.each([
    [0, '0'],
    [999, '999'],
    [1000, '1k'],
    [1500, '1.5k'],
    [128_000, '128k'],
    // Promotion guard: a value that would round to "1000k" promotes to M.
    [999_949, '999.9k'],
    [999_999, '1M'],
    [1_000_000, '1M'],
    [1_500_000, '1.5M'],
    // `M` is the declared top rung (see format.ts): no `B`, so billions stay in M.
    [1_000_000_000, '1000M']
  ])('%d → %s', (value, expected) => {
    expect(compactNumber(value)).toBe(expected)
  })

  it('never emits a unit-boundary artifact like "1000k" or "1000"', () => {
    for (const value of [999.5, 999.9, 999_950, 999_999.4]) {
      expect(compactNumber(value)).not.toMatch(/^1000(\.\d)?k?$/)
    }
  })
})
