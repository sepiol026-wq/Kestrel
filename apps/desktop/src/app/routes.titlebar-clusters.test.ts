// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { describe, expect, it } from 'vitest'

import { hidesFixedTitlebarClusters } from './routes'

describe('hidesFixedTitlebarClusters', () => {
  it('hides clusters on contributed full pages and overlays', () => {
    expect(hidesFixedTitlebarClusters('extension')).toBe(true)
    expect(hidesFixedTitlebarClusters('settings')).toBe(true)
  })

  it('keeps clusters on chat and first-party workspace pages', () => {
    expect(hidesFixedTitlebarClusters('chat')).toBe(false)
  })
})
