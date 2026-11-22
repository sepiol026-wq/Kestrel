// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { beforeEach, describe, expect, it } from 'vitest'

import { setShowReasoningFromConfig } from '@/store/reasoning-disclosure'
import { $showToolActivity, setShowToolActivityFromConfig, toolProgressVisible } from '@/store/tool-activity'

describe('tool feed visibility follows display.tool_progress only', () => {
  beforeEach(() => {
    setShowReasoningFromConfig(true)
    setShowToolActivityFromConfig(undefined)
  })

  it('silences the feed only for false or "off"', () => {
    for (const off of [false, 'off', ' OFF ']) {
      expect(toolProgressVisible(off)).toBe(false)
    }

    for (const on of [true, 'all', 'new', 'verbose', 'unknown', undefined, null]) {
      expect(toolProgressVisible(on)).toBe(true)
    }
  })

  it('does not follow show_reasoning', () => {
    setShowReasoningFromConfig(false)
    setShowToolActivityFromConfig(undefined)
    expect($showToolActivity.get()).toBe(true)

    setShowReasoningFromConfig(true)
    setShowToolActivityFromConfig('off')
    expect($showToolActivity.get()).toBe(false)
  })
})
