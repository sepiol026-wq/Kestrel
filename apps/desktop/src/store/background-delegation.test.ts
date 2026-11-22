// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { afterEach, expect, it } from 'vitest'

import { sessionBackgroundResume } from './background-delegation'
import { $activeSessionId, $busy } from './session'
import { $subagentsBySession, upsertSubagent } from './subagents'

afterEach(() => {
  $busy.set(false)
  $activeSessionId.set(null)
  $subagentsBySession.set({})
})

it('tracks only the owning runtime session, independent of foreground busy state and child stream text', () => {
  const owner = sessionBackgroundResume('owner')
  const other = sessionBackgroundResume('other')
  const unbound = sessionBackgroundResume(null)
  upsertSubagent('owner', { subagent_id: 'working', status: 'running' }, true, 'subagent.start')
  upsertSubagent('owner', { subagent_id: 'waiting', status: 'queued' }, true, 'subagent.spawn_requested')
  upsertSubagent('other', { subagent_id: 'working', status: 'running' }, true, 'subagent.start')
  $activeSessionId.set('other')
  $busy.set(true)
  upsertSubagent('owner', { subagent_id: 'working', text: '(°□°) pondering...' }, false, 'subagent.thinking')
  expect(owner.get()).toEqual({ count: 2 })
  expect(other.get()).toEqual({ count: 1 })
  expect(unbound.get()).toBeNull()

  upsertSubagent('owner', { subagent_id: 'working', status: 'completed' }, false, 'subagent.complete')
  expect(owner.get()).toEqual({ count: 1 })
  upsertSubagent('owner', { subagent_id: 'waiting', status: 'timeout' }, false, 'subagent.complete')
  $activeSessionId.set(null)
  $busy.set(false)
  expect(owner.get()).toBeNull()
  expect(other.get()).toEqual({ count: 1 })
})
