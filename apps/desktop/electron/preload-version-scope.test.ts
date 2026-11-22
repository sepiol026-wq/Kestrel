// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { expect, it, vi } from 'vitest'

const host = vi.hoisted(() => ({
  exposeInMainWorld: vi.fn(),
  invoke: vi.fn().mockResolvedValue({ appVersion: '1.0.0' }),
  send: vi.fn(),
  sendSync: vi.fn((): unknown => ({}))
}))

vi.mock('electron', () => ({
  contextBridge: { exposeInMainWorld: host.exposeInMainWorld },
  ipcRenderer: { invoke: host.invoke, send: host.send, sendSync: host.sendSync, on: vi.fn(), removeListener: vi.fn() },
  webFrame: {},
  webUtils: {}
}))

type VersionBridge = { getVersion: (scope?: { connectionId?: string; profile?: string }) => Promise<unknown> }

async function bridge(): Promise<VersionBridge> {
  await import('./preload')
  const registration = host.exposeInMainWorld.mock.calls.find(([name]): boolean => name === 'hermesDesktop')

  return registration![1] as VersionBridge
}

// The renderer scopes the version request to the selected connection/profile;
// dropping it here makes main answer from the primary route instead.
it('forwards the connection/profile scope to hermes:version', async (): Promise<void> => {
  const exposed = await bridge()
  host.invoke.mockClear()

  await exposed.getVersion({ connectionId: 'remote-box', profile: 'work' })

  expect(host.invoke).toHaveBeenCalledExactlyOnceWith('hermes:version', { connectionId: 'remote-box', profile: 'work' })
})
