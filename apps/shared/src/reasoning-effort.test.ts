// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { describe, expect, it } from 'vitest'

import {
  DEFAULT_REASONING_EFFORT,
  isReasoningEffort,
  REASONING_EFFORT_VALUES,
  REASONING_EFFORTS
} from './reasoning-effort'

describe('reasoning-effort', () => {
  it('is one duplicate-free value set with `none` as the only non-level', () => {
    expect(new Set(REASONING_EFFORT_VALUES).size).toBe(REASONING_EFFORT_VALUES.length)
    expect(REASONING_EFFORT_VALUES.filter(v => !isReasoningEffort(v))).toEqual(['none'])
  })

  it('defaults to a real level and recognizes it case-insensitively', () => {
    expect(REASONING_EFFORTS).toContain(DEFAULT_REASONING_EFFORT)
    expect(isReasoningEffort(DEFAULT_REASONING_EFFORT.toUpperCase())).toBe(true)
  })
})
