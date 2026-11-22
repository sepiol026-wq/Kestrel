// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import assert from 'node:assert/strict'

import { test, vi } from 'vitest'

const skin = {
  profile: 'default',
  skin: { name: 'neon', colors: { background: '#101020', ui_accent: '#ff33aa', banner_text: '#eeeeee' } }
}

const electron = vi.hoisted(() => ({
  contextBridge: { exposeInMainWorld: vi.fn() },
  ipcRenderer: {
    invoke: vi.fn(async () => ({ ok: true })),
    on: vi.fn(),
    removeListener: vi.fn(),
    sendSync: vi.fn((channel: string) => (channel === 'hermes:skin:local' ? skin : {}))
  },
  webFrame: {},
  webUtils: {}
}))

vi.mock('electron', () => electron)

test('the preload carries the local skin across before the renderer starts', async () => {
  await import('./preload')
  const [, bridge] = electron.contextBridge.exposeInMainWorld.mock.calls[0]

  assert.deepEqual(bridge.localSkin, skin)
  assert.equal(
    electron.ipcRenderer.sendSync.mock.calls.some(([channel]) => channel === 'hermes:skin:local'),
    true
  )
})
