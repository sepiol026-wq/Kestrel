// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { describe, expect, it } from 'vitest'

import { composerPromptText } from '../lib/prompt.js'

describe('composerPromptText', () => {
  it('returns shell prompt for ! commands', () => {
    expect(composerPromptText('❯', 'coder', true)).toBe('$')
  })

  it('prefixes named profiles onto the normal prompt', () => {
    expect(composerPromptText('❯', 'coder')).toBe('coder ❯')
  })

  it('does not prefix default or custom profiles', () => {
    expect(composerPromptText('❯', 'default')).toBe('❯')
    expect(composerPromptText('❯', 'custom')).toBe('❯')
    expect(composerPromptText('❯')).toBe('❯')
  })
})
