// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { afterEach, describe, expect, it } from 'vitest'

import { storedBoolean } from '@/lib/storage'

import { $alwaysExternalLinks, setAlwaysExternalLinks } from './external-links'

const KEY = 'hermes.desktop.alwaysExternalLinks.v1'

afterEach(() => {
  setAlwaysExternalLinks(false)
})

describe('always-external-links store', () => {
  it('defaults off and persists the pref', () => {
    expect($alwaysExternalLinks.get()).toBe(false)

    setAlwaysExternalLinks(true)
    expect(storedBoolean(KEY, false)).toBe(true)

    setAlwaysExternalLinks(false)
    expect(storedBoolean(KEY, true)).toBe(false)
  })

  it('follows a change made in another window', () => {
    window.localStorage.setItem(KEY, 'true')
    window.dispatchEvent(new StorageEvent('storage', { key: KEY }))
    expect($alwaysExternalLinks.get()).toBe(true)
  })
})
