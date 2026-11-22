// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { describe, expect, it } from 'vitest'

import { isImeComposing, isSubmitEnter } from './ime'

describe('isImeComposing', () => {
  it('detects composition via nativeEvent.isComposing (React events)', () => {
    expect(isImeComposing({ key: 'Enter', nativeEvent: { isComposing: true } })).toBe(true)
  })

  it('detects composition via isComposing on the event itself (DOM events)', () => {
    expect(isImeComposing({ isComposing: true, key: 'Enter' })).toBe(true)
  })

  it('detects the legacy 229 keyCode on nativeEvent', () => {
    expect(isImeComposing({ key: 'Enter', nativeEvent: { keyCode: 229 } })).toBe(true)
  })

  it('detects the legacy 229 keyCode on a DOM event', () => {
    expect(isImeComposing({ key: 'Enter', keyCode: 229 })).toBe(true)
  })

  it('passes ordinary events', () => {
    expect(isImeComposing({ key: 'Enter', nativeEvent: { isComposing: false, keyCode: 13 } })).toBe(false)
    expect(isImeComposing({ key: 'a', keyCode: 65 })).toBe(false)
  })
})

describe('isSubmitEnter', () => {
  it('accepts a plain Enter', () => {
    expect(isSubmitEnter({ key: 'Enter', nativeEvent: {} })).toBe(true)
  })

  it('rejects Enter during composition', () => {
    expect(isSubmitEnter({ key: 'Enter', nativeEvent: { isComposing: true } })).toBe(false)
  })

  it('rejects the post-compositionend commit Enter still carrying 229', () => {
    expect(isSubmitEnter({ key: 'Enter', nativeEvent: { isComposing: false, keyCode: 229 } })).toBe(false)
  })

  it('rejects non-Enter keys', () => {
    expect(isSubmitEnter({ key: 'Escape', nativeEvent: {} })).toBe(false)
  })
})
