// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { describe, expect, it } from 'vitest'

import { localShowReasoning } from './reasoning-disclosure'

describe('localShowReasoning', () => {
  it('reads the local per-platform key over the global one', () => {
    expect(localShowReasoning({ show_reasoning: true, platforms: { cli: { show_reasoning: false } } })).toBe(false)
    expect(localShowReasoning({ show_reasoning: false, platforms: { cli: { show_reasoning: true } } })).toBe(true)
  })

  it('falls back to the global key, and ignores other platforms', () => {
    expect(localShowReasoning({ show_reasoning: false })).toBe(false)
    expect(localShowReasoning({ show_reasoning: true, platforms: { telegram: { show_reasoning: false } } })).toBe(true)
    expect(localShowReasoning(undefined)).toBeUndefined()
  })
})
