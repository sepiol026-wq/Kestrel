// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { describe, expect, it } from 'vitest'

import { svgSize } from './svg-image'

describe('svgSize', () => {
  it('reads explicit pixel width/height', () => {
    expect(svgSize('<svg width="312" height="90"><rect/></svg>')).toEqual({ width: 312, height: 90 })
  })

  it('falls back to the viewBox when width is a percentage', () => {
    expect(svgSize('<svg width="100%" viewBox="0 0 260.34375 70"><rect/></svg>')).toEqual({
      width: 260.34375,
      height: 70
    })
  })

  it('falls back to the viewBox when width/height are absent', () => {
    expect(svgSize('<svg viewBox="0 0 400 100"><rect/></svg>')).toEqual({ width: 400, height: 100 })
  })

  it('falls back to a default size when nothing usable exists', () => {
    expect(svgSize('<svg><rect/></svg>')).toEqual({ width: 800, height: 600 })
  })

  it('treats mixed-unit widths as absent (not parseFloat(100) == 100)', () => {
    expect(svgSize('<svg width="100%" height="70" viewBox="0 0 500 200"><rect/></svg>')).toEqual({
      width: 500,
      height: 200
    })
  })
})
