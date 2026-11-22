// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { describe, expect, it } from 'vitest'

import { decideRightClickAction } from '../components/textInput.js'

describe('decideRightClickAction', () => {
  it('returns paste when there is no selection', () => {
    expect(decideRightClickAction('hello world', null)).toEqual({ action: 'paste' })
  })

  it('returns paste for a collapsed (empty) range', () => {
    expect(decideRightClickAction('hello world', { end: 5, start: 5 })).toEqual({
      action: 'paste'
    })
  })

  it('copies the slice when range covers non-empty text', () => {
    expect(decideRightClickAction('hello world', { end: 5, start: 0 })).toEqual({
      action: 'copy',
      text: 'hello'
    })
  })

  it('falls back to paste when slice is empty (out-of-range indices)', () => {
    expect(decideRightClickAction('', { end: 5, start: 0 })).toEqual({ action: 'paste' })
  })

  it('handles unicode (emoji, CJK) in the slice', () => {
    const value = 'hi 你好 🎉'
    expect(decideRightClickAction(value, { end: 5, start: 3 })).toEqual({
      action: 'copy',
      text: '你好'
    })
  })
})
