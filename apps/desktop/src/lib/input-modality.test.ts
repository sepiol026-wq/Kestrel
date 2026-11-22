// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { describe, expect, it } from 'vitest'

import { lastInputModality } from './input-modality'

describe('lastInputModality', () => {
  it('defaults to keyboard before any input', () => {
    expect(lastInputModality()).toBe('keyboard')
  })

  it('tracks the device behind the last interaction', () => {
    document.dispatchEvent(new Event('pointerdown'))

    expect(lastInputModality()).toBe('pointer')

    document.dispatchEvent(new Event('keydown'))

    expect(lastInputModality()).toBe('keyboard')
  })

  it('sees events a handler stops from bubbling (capture phase)', () => {
    const target = document.createElement('button')

    document.body.append(target)
    target.addEventListener('pointerdown', event => event.stopPropagation())
    target.dispatchEvent(new Event('pointerdown', { bubbles: true }))

    expect(lastInputModality()).toBe('pointer')

    target.remove()
  })
})
