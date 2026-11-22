// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { afterEach, describe, expect, it, vi } from 'vitest'

import { $pluginUpdateAllRunning, isPluginUpdateAllRunning, updateAllAgentPlugins } from './plugin-update-all'

describe('plugin update-all running state', () => {
  afterEach(() => $pluginUpdateAllRunning.set(new Set()))

  it('marks only the profile whose run is in flight', async () => {
    let finish!: (value: unknown) => void
    const request = vi.fn(() => new Promise(resolve => (finish = resolve))) as never
    const run = updateAllAgentPlugins(request, 'work')

    expect(isPluginUpdateAllRunning($pluginUpdateAllRunning.get(), 'work')).toBe(true)
    expect(isPluginUpdateAllRunning($pluginUpdateAllRunning.get(), null)).toBe(false)
    expect(isPluginUpdateAllRunning($pluginUpdateAllRunning.get(), 'home')).toBe(false)

    finish({ results: [] })
    await run
    expect(isPluginUpdateAllRunning($pluginUpdateAllRunning.get(), 'work')).toBe(false)
  })
})
