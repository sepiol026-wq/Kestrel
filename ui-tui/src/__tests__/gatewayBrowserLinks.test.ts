// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { describe, expect, it, vi } from 'vitest'

import { createGatewayEventHandler } from '../app/createGatewayEventHandler.js'
import { createFreeTierChallengePresenter } from '../app/gatewayBrowserLinks.js'

const openExternalUrlMock = vi.fn((_url: string) => true)
vi.mock('../lib/openExternalUrl.js', () => ({
  openExternalUrl: (url: string) => openExternalUrlMock(url)
}))

const url = 'https://portal.example/challenge?code=t'

const challenge = (required: boolean) => ({
  attempt: 0,
  expires_in: 600,
  message: 'A quick check first.',
  required,
  type: 'browser' as const,
  url
})

describe('free_tier.challenge', () => {
  it('shows the link and opens one tab per ticket; an optional check opens nothing', () => {
    const sys = vi.fn()
    const open = vi.fn()
    const show = createFreeTierChallengePresenter(sys, open)

    show(challenge(false))
    expect(open).not.toHaveBeenCalled()

    show(challenge(true))
    show(challenge(true))

    expect(sys.mock.calls.map(c => c[0]).join('\n')).toContain(url)
    expect(open).toHaveBeenCalledTimes(1)
  })

  it('the gateway event handler routes the event to the presenter', () => {
    const sys = vi.fn()

    const ctx = {
      composer: {},
      gateway: { gw: { request: vi.fn() }, rpc: vi.fn() },
      session: {},
      submission: { submitRef: { current: vi.fn() } },
      system: { bellOnComplete: false, sys },
      transcript: {},
      voice: {}
    } as any

    createGatewayEventHandler(ctx)({ payload: challenge(true), type: 'free_tier.challenge' } as any)

    expect(sys).toHaveBeenCalledWith(url)
    expect(openExternalUrlMock).toHaveBeenCalledWith(url)
  })
})
