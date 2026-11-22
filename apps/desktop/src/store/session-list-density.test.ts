// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { beforeEach, describe, expect, it, vi } from 'vitest'

const loadStore = async () => {
  vi.resetModules()

  return import('./session-list-density')
}

describe('session list density preference', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('defaults to compact (pre-density behavior) and persists changes', async () => {
    const first = await loadStore()

    expect(first.$sessionListDensity.get()).toBe('compact')

    first.setSessionListDensity('detailed')

    expect(window.localStorage.getItem('hermes.desktop.sessionListDensity')).toBe('detailed')
    expect((await loadStore()).$sessionListDensity.get()).toBe('detailed')
  })

  it('falls back to compact for an unknown stored value', async () => {
    window.localStorage.setItem('hermes.desktop.sessionListDensity', 'tiny')

    expect((await loadStore()).$sessionListDensity.get()).toBe('compact')
  })
})
