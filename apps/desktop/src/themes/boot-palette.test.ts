// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { afterEach, beforeEach, expect, it, vi } from 'vitest'

import { readBootPalette } from '../lib/boot-failure'

import { writeBootPalette } from './boot-palette'

const palette = { background: '#0d1117', foreground: '#e6edf3', accent: '#58a6ff', accentForeground: '#0d1117' }

beforeEach(() => localStorage.clear())
afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

it('writes the palette as one snapshot and reads it back', () => {
  writeBootPalette(palette)
  expect(JSON.parse(localStorage.getItem('hermes-boot-palette')!)).toEqual(palette)
  expect(readBootPalette()).toEqual(palette)
})

it.each([
  ['an unresolved var()', { ...palette, accent: 'var(--theme-primary)' }],
  ['a var() inside a colour function', { ...palette, background: 'color-mix(in srgb, var(--x) 50%, white)' }],
  ['an empty colour', { ...palette, foreground: ' ' }]
])('drops the previous snapshot instead of storing %s', (_case, next) => {
  writeBootPalette(palette)
  writeBootPalette(next)
  expect(localStorage.getItem('hermes-boot-palette')).toBeNull()
  expect(readBootPalette()).toBeNull()
})

it('drops the previous snapshot when the new one cannot be written', () => {
  // A stand-in storage, so the failing write does not depend on the environment's Storage.
  const items = new Map([['hermes-boot-palette', JSON.stringify(palette)]])
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => items.get(key) ?? null,
    removeItem: (key: string) => items.delete(key),
    setItem: () => {
      throw new DOMException('Quota exceeded', 'QuotaExceededError')
    }
  })
  writeBootPalette({ ...palette, background: '#ffffff', foreground: '#1f2328' })
  expect(items.has('hermes-boot-palette')).toBe(false)
})

it('keeps self-contained colour functions', () => {
  const functional = { ...palette, accent: 'oklch(0.7 0.15 250)', background: 'color-mix(in srgb, #000 90%, white)' }
  writeBootPalette(functional)
  expect(readBootPalette()).toEqual(functional)
})
