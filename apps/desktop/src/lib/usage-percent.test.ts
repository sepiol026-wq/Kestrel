// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { describe, expect, it } from 'vitest'

import { formatPercentUsed } from './usage-percent'

describe('formatPercentUsed', () => {
  it('floors, shows <1% for any sliver, and 100% only when exhausted', () => {
    expect(formatPercentUsed(0)).toBe('0%')
    expect(formatPercentUsed(0.0047)).toBe('<1%')
    expect(formatPercentUsed(1 - 0.99)).toBe('1%')
    expect(formatPercentUsed(0.996)).toBe('99%')
    expect(formatPercentUsed(0.9999)).toBe('99%')
    expect(formatPercentUsed(1)).toBe('100%')
  })
})
