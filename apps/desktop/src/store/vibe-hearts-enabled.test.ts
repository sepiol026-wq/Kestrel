// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { beforeEach, describe, expect, it } from 'vitest'

import { $vibeHeartsEnabled, setVibeHeartsEnabled } from '@/store/vibe-hearts-enabled'

const KEY = 'hermes.desktop.vibeHearts.v1'

describe('vibe hearts enabled', () => {
  beforeEach(() => {
    window.localStorage.removeItem(KEY)
    // Reset to the pre-toggle always-on default without going through the
    // setter's persist path first (absent key means on).
    $vibeHeartsEnabled.set(true)
  })

  it('turns off and persists', () => {
    setVibeHeartsEnabled(false)
    expect($vibeHeartsEnabled.get()).toBe(false)
    expect(window.localStorage.getItem(KEY)).toBe('off')
  })
})
