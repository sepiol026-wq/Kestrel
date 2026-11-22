// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { describe, expect, it } from 'vitest'

import { shouldShowIntro } from './intro-visibility'

const showing = {
  activeSessionId: null,
  auxiliaryWindow: false,
  enabled: true,
  freshDraftReady: true,
  messagesEmpty: true,
  primary: true,
  routedSessionView: false,
  selectedSessionId: null
} as const

describe('shouldShowIntro', () => {
  it('shows on a fresh draft in the primary window', () => {
    expect(shouldShowIntro(showing)).toBe(true)
  })

  it('hides when the Appearance toggle is off', () => {
    expect(shouldShowIntro({ ...showing, enabled: false })).toBe(false)
  })

  it('keeps the toggle authoritative over every other clause', () => {
    // Off means off: no window, session, or draft state re-enables the splash.
    const inputs = [
      { ...showing, auxiliaryWindow: true, enabled: false },
      { ...showing, enabled: false, freshDraftReady: false },
      { ...showing, enabled: false, primary: false },
      { ...showing, enabled: false, messagesEmpty: false }
    ]

    for (const input of inputs) {
      expect(shouldShowIntro(input)).toBe(false)
    }
  })

  it('hides on surfaces that are not an empty primary draft', () => {
    expect(shouldShowIntro({ ...showing, primary: false })).toBe(false)
    expect(shouldShowIntro({ ...showing, auxiliaryWindow: true })).toBe(false)
    expect(shouldShowIntro({ ...showing, freshDraftReady: false })).toBe(false)
    expect(shouldShowIntro({ ...showing, routedSessionView: true })).toBe(false)
    expect(shouldShowIntro({ ...showing, selectedSessionId: 'session-1' })).toBe(false)
    expect(shouldShowIntro({ ...showing, activeSessionId: 'session-1' })).toBe(false)
    expect(shouldShowIntro({ ...showing, messagesEmpty: false })).toBe(false)
  })
})
