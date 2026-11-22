// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { describe, expect, it } from 'vitest'

import { clampOverlayWidth } from '../components/overlayPrimitives.js'

describe('clampOverlayWidth', () => {
  it('prefers preferred, capped by maxWidth', () => {
    expect(clampOverlayWidth(60)).toBe(60)
    expect(clampOverlayWidth(60, 40)).toBe(40)
    expect(clampOverlayWidth(30, 80)).toBe(30)
  })

  it('honors caps BELOW the usability floor instead of overflowing the cell', () => {
    // Copilot review on #20379: a 20-col grid cell must get 20, not 24.
    expect(clampOverlayWidth(60, 20)).toBe(20)
    expect(clampOverlayWidth(60, 1)).toBe(1)
  })

  it('keeps the floor when the cap allows it', () => {
    expect(clampOverlayWidth(10, 80)).toBe(24)
    expect(clampOverlayWidth(10)).toBe(24)
  })
})
