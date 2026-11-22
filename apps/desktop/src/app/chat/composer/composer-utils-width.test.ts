// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { describe, expect, it } from 'vitest'

import { composerInputWidthClass } from './composer-utils'

describe('composerInputWidthClass', () => {
  it('fills the unstacked 1fr grid track instead of the 8rem inline floor', () => {
    expect(composerInputWidthClass(false)).toBe('w-full min-w-0')
    expect(composerInputWidthClass(false)).not.toContain('composer-input-inline-min-width')
    expect(composerInputWidthClass(false)).not.toContain('flex-1')
  })

  it('keeps the stacked editor full-width', () => {
    expect(composerInputWidthClass(true)).toBe('w-full')
  })
})
