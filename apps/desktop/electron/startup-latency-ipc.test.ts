// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { expect, test, vi } from 'vitest'

const handlers = new Map<string, (...args: unknown[]) => unknown>()

vi.mock('electron', () => ({
  ipcMain: {
    handle: (channel: string, fn: (...args: unknown[]) => unknown) => {
      handlers.set(channel, fn)
    }
  }
}))

const { registerStartupLatencyIpc } = await import('./startup-latency-ipc')

test('the launch latency is claimable once per app launch, whichever window asks', () => {
  registerStartupLatencyIpc()

  const claim = handlers.get('hermes:startup-latency:claim')

  expect(claim).toBeDefined()

  const first = claim!({})

  expect(typeof first).toBe('number')
  expect(first as number).toBeGreaterThanOrEqual(0)
  // A renderer reload, a second window or a post-reconnect boot all land here.
  expect(claim!({})).toBeNull()
  expect(claim!({})).toBeNull()
})
