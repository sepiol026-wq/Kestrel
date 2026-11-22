// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { DEFAULT_REASONING_EFFORT, REASONING_EFFORT_VALUES } from '@hermes/shared'
import { describe, expect, it } from 'vitest'

import {
  isThinkingEnabled,
  reasoningEffortClamp,
  reasoningEffortLabel,
  resolveReasoningEffort
} from './reasoning-effort'

describe('reasoning-effort', () => {
  it('labels every level it claims to support', () => {
    for (const effort of REASONING_EFFORT_VALUES) {
      expect(reasoningEffortLabel(effort)).not.toBe('')
    }

    expect(reasoningEffortLabel('')).toBe('')
    // Unknown values pass through rather than silently reading as a real level.
    expect(reasoningEffortLabel('bogus')).toBe('bogus')
  })

  it('labels a route clamp from the gateway wire level only, never by inference', () => {
    expect(reasoningEffortLabel('ultra', 'max')).toBe('Ultra→Max')
    expect(reasoningEffortClamp('ultra', 'max')).toEqual({ effort: 'ultra', wire: 'max' })
    // Unknown ('' — not stamped yet / optimistic pick) or verbatim: plain label, no claim.
    expect(reasoningEffortLabel('ultra', '')).toBe('Ultra')
    expect(reasoningEffortLabel('ultra')).toBe('Ultra')
    expect(reasoningEffortLabel('high', 'high')).toBe('High')
    expect(reasoningEffortClamp('high', 'high')).toBeNull()
    expect(reasoningEffortClamp('none', '')).toBeNull()
  })

  it('treats empty as inherit and only `none` as off', () => {
    expect(isThinkingEnabled('none')).toBe(false)
    expect(isThinkingEnabled('high')).toBe(true)
    // Empty inherits the fallback, so an off fallback reads as off.
    expect(isThinkingEnabled('', 'none')).toBe(false)
    expect(isThinkingEnabled('', 'high')).toBe(true)
  })

  it('resolves a scale value: inherit, off, or clamp', () => {
    expect(resolveReasoningEffort('high')).toBe('high')
    // Empty inherits the profile default rather than snapping to medium.
    expect(resolveReasoningEffort('', 'ultra')).toBe('ultra')
    // Off selects nothing on the scale.
    expect(resolveReasoningEffort('none')).toBe('')
    expect(resolveReasoningEffort('bogus')).toBe(DEFAULT_REASONING_EFFORT)
  })
})
