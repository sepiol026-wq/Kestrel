// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { describe, expect, it } from 'vitest'

import { shouldIgnorePlaybackHotkey } from './playback-hotkey'

function spaceOn(target: Element | null, defaultPrevented = false) {
  return { code: 'Space', defaultPrevented, key: ' ', target } as unknown as KeyboardEvent
}

describe('shouldIgnorePlaybackHotkey', () => {
  it('toggles on Space when nothing focusable owns the key', () => {
    expect(shouldIgnorePlaybackHotkey(spaceOn(document.body), document.body)).toBe(false)
  })

  it('ignores Space on a focused Radix menu item (div[role=menuitem] inside role=menu)', () => {
    const menu = document.createElement('div')
    menu.setAttribute('role', 'menu')
    const item = document.createElement('div')
    item.setAttribute('role', 'menuitem')
    item.tabIndex = -1
    menu.append(item)
    document.body.append(menu)

    try {
      expect(shouldIgnorePlaybackHotkey(spaceOn(item), item)).toBe(true)
      expect(shouldIgnorePlaybackHotkey(spaceOn(document.body, true), document.body)).toBe(true)
    } finally {
      menu.remove()
    }
  })
})
