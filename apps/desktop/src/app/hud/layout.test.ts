// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { describe, expect, it } from 'vitest'

import { hudTranscriptHeight } from './layout'

describe('hudTranscriptHeight', () => {
  it('uses the resized window space for a non-empty transcript', () => {
    // The transcript is intentionally not constrained to its content height:
    // resizing HUD must reveal more scrollback instead of growing an empty
    // transparent window below a fixed-height chat band.
    expect(
      hudTranscriptHeight({
        barHeight: 58,
        contentHeight: 72,
        viewportHeight: 640
      })
    ).toBe(582)
  })

  it('keeps an empty HUD collapsed', () => {
    expect(hudTranscriptHeight({ barHeight: 58, contentHeight: 0, viewportHeight: 640 })).toBe(0)
  })
})
