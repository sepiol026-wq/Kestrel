// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

/**
 * A non-source-scoped bot row (`not_scoped`) belongs to the window's ACTIVE
 * source: the rich profiles.list rows come from that gateway. Its Bot Mode
 * target must name that source, never a guessed `local` — on a remote window
 * a `local` owner sends the "+" chat to this device instead of the bot.
 */

import { beforeEach, describe, expect, it, vi } from 'vitest'

import { setBotsWorkspaceOwner } from './routing'
import type { RosterRow } from './types'

const { hostMock } = vi.hoisted(() => ({
  hostMock: {
    setWorkspaceScope: vi.fn(),
    state: { connectionId: { get: vi.fn((): null | string => 'local') } }
  }
}))

vi.mock('@hermes/plugin-sdk', () => ({ host: hostMock }))

const unscoped = { name: 'mybot' } as RosterRow

const publishedTarget = () => hostMock.setWorkspaceScope.mock.calls.at(-1)?.[2]

beforeEach(() => {
  hostMock.setWorkspaceScope.mockClear()
})

describe('setBotsWorkspaceOwner for a not_scoped bot', () => {
  it('routes at the active remote source, not local', () => {
    hostMock.state.connectionId.get.mockReturnValue('remote-a')

    setBotsWorkspaceOwner('bot:mybot', unscoped)

    expect(publishedTarget()).toEqual({
      kind: 'route',
      route: { connectionId: 'remote-a', mode: 'remote', profile: 'mybot', targetProfile: 'mybot' }
    })
  })

  it('routes a local window at local', () => {
    hostMock.state.connectionId.get.mockReturnValue('local')

    setBotsWorkspaceOwner('bot:mybot', unscoped)

    expect(publishedTarget()).toMatchObject({ kind: 'route', route: { connectionId: 'local', mode: 'local' } })
  })

  it('stays blocked while the active source is unknown', () => {
    hostMock.state.connectionId.get.mockReturnValue(null)

    setBotsWorkspaceOwner('bot:mybot', unscoped, 'pick one')

    expect(publishedTarget()).toEqual({ kind: 'blocked', message: 'pick one' })
  })
})
