// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { afterEach, expect, it } from 'vitest'

import { $subagentsBySession, reconcileSubagentSnapshot, upsertSubagent } from './subagents'

afterEach(() => $subagentsBySession.set({}))
it('hydrates last tool activity without claiming it is active and preserves stream history on refresh', () => {
  const child = {
    subagent_id: 'worker',
    goal: 'Actual worker',
    status: 'running',
    started_at: 1001,
    last_tool: 'read_file'
  }

  reconcileSubagentSnapshot('owner', [child])
  const first = $subagentsBySession.get().owner
  expect(first[0].stream).toMatchObject([{ kind: 'tool', text: 'Read File' }])
  expect(first[0].currentTool).toBeUndefined()
  expect(first[0].startedAt).toBe(child.started_at * 1000)
  reconcileSubagentSnapshot('owner', [child])
  expect($subagentsBySession.get().owner).toBe(first)
  upsertSubagent('other', { subagent_id: 'worker', goal: 'Other owner' })
  const other = $subagentsBySession.get().other
  upsertSubagent('owner', { subagent_id: 'worker', text: 'New progress' }, false, 'subagent.progress')
  const stream = $subagentsBySession.get().owner[0].stream
  reconcileSubagentSnapshot('owner', [child])
  expect($subagentsBySession.get().owner[0].stream).toBe(stream)
  reconcileSubagentSnapshot('owner', [])
  expect($subagentsBySession.get().owner).toEqual([])
  expect($subagentsBySession.get().other).toBe(other)
})
