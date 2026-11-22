// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { beforeEach, describe, expect, it } from 'vitest'

import { turnController } from '../app/turnController.js'
import { getTurnState, resetTurnState } from '../app/turnStore.js'

// turnController.recordTodos() parses the raw `todo` tool payload into
// TodoItem[]. Nested subtasks (apps/desktop's `parent` field) must survive
// this parse — the TUI todo panel renders hierarchy from it via todoTree().
describe('turnController.recordTodos — preserves the parent field', () => {
  beforeEach(() => {
    resetTurnState()
    turnController.fullReset()
  })

  it('keeps parent on a valid nested subtask', () => {
    turnController.recordTodos([
      { content: 'Ship feature', id: 'wp1', status: 'in_progress' },
      { content: 'Write tests', id: 't1', parent: 'wp1', status: 'pending' }
    ])

    expect(getTurnState().todos).toEqual([
      { content: 'Ship feature', id: 'wp1', status: 'in_progress' },
      { content: 'Write tests', id: 't1', parent: 'wp1', status: 'pending' }
    ])
  })

  it('drops a self-referential parent instead of keeping a self-loop', () => {
    turnController.recordTodos([{ content: 'x', id: 'a', parent: 'a', status: 'pending' }])

    expect(getTurnState().todos).toEqual([{ content: 'x', id: 'a', status: 'pending' }])
  })

  it('omits parent entirely when absent, matching pre-nesting payloads', () => {
    turnController.recordTodos([{ content: 'x', id: 'a', status: 'pending' }])

    expect(getTurnState().todos).toEqual([{ content: 'x', id: 'a', status: 'pending' }])
  })
})
