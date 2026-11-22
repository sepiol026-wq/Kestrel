// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { afterEach, expect, it, vi } from 'vitest'

import { createBrowserSavedConnections } from './browser-saved-connections'
import type { BrowserBootstrap } from './browser-transport'
import { browserApi } from './browser-transport'

const bootstrap: BrowserBootstrap = { authRequired: true, basePath: '', privateSession: false, token: '' }

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

it.each(['ssh', 'remote'] as const)('gives a %s Test its dial budget without changing selection', async kind => {
  vi.useFakeTimers()
  let signal: AbortSignal | null | undefined
  let finish: (response: Response) => void = () => undefined

  const fetchMock = vi.fn((url: URL, init?: RequestInit) => {
    if (url.pathname.endsWith('/test')) {
      signal = init?.signal

      return new Promise<Response>(resolve => { finish = resolve })
    }

    return Promise.resolve(new Response(JSON.stringify({
      connections: [{ id: 'fixture', kind, label: 'Fixture' }],
      lastUsed: 'local',
      primary: 'local'
    })))
  })

  vi.stubGlobal('fetch', fetchMock)
  const { connections } = createBrowserSavedConnections({ api: request => browserApi(bootstrap, request), bootstrap })
  await connections.list()
  const pending = connections.test('fixture')
  await vi.advanceTimersByTimeAsync(25_000)
  expect(signal?.aborted).toBe(kind !== 'ssh')
  finish(new Response(JSON.stringify({ ok: true, version: 'fixture-version' })))
  await expect(pending).resolves.toMatchObject({ ok: true, version: 'fixture-version' })
  expect(fetchMock.mock.calls.map(([url]) => url.pathname)).toEqual([
    '/api/gateway-connections',
    '/api/gateway-connections/fixture/test'
  ])
})
