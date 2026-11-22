// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { describe, expect, it } from 'vitest'

import { isComposerChord } from '@/lib/keybinds/chords'

import { isMacPlatform, shouldOwnAddSelectionShortcut } from './selection'

const key = (init: Partial<KeyboardEvent> & { key: string }) =>
  ({
    altKey: false,
    ctrlKey: false,
    metaKey: false,
    shiftKey: false,
    type: 'keydown',
    ...init
  }) as KeyboardEvent

/** Chord that the composer-focus ladder accepts on this host. */
const addSelectionKey = () => (isMacPlatform() ? key({ key: 'l', metaKey: true }) : key({ key: 'l', ctrlKey: true }))

describe('shouldOwnAddSelectionShortcut', () => {
  it('only the active tab claims the add-selection shortcut when text is selected (#76116)', () => {
    const chord = addSelectionKey()

    expect(shouldOwnAddSelectionShortcut(chord, { active: true, hasSelection: true })).toBe(true)

    // Inactive mounted tabs must not also fire — that was the N-pill bug.
    expect(shouldOwnAddSelectionShortcut(chord, { active: false, hasSelection: true })).toBe(false)
  })

  it('never claims the shortcut with no selection so clear-screen still reaches the shell', () => {
    const chord = addSelectionKey()

    expect(shouldOwnAddSelectionShortcut(chord, { active: true, hasSelection: false })).toBe(false)
    expect(isComposerChord(chord)).toBe(true)
  })
})
