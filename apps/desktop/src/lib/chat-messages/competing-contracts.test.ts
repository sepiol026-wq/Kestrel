// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { describe, expect, it } from 'vitest'

import { summarizeToolRun } from '@/components/assistant-ui/tool/run-summary'
import { upsertToolPart } from '@/lib/chat-messages'

describe('D1 competing implementation contracts', () => {
  it('keeps identified parallel running calls separate even with identical args', () => {
    let parts = upsertToolPart([], { name: 'terminal', tool_id: 'a', args: { command: 'pwd' } }, 'running', 1)
    parts = upsertToolPart(parts, { name: 'terminal', tool_id: 'b', args: { command: 'pwd' } }, 'running', 2)
    expect(parts).toHaveLength(2)
  })
  it('honors explicit successful skill results over stale envelope errors', () => {
    const part = {
      type: 'tool-call' as const,
      toolName: 'skill_view',
      args: { name: 'loaded-skill' },
      result: { success: true },
      isError: true
    }

    expect(summarizeToolRun([part], false)).toContain('Loaded skill')
  })
  it('does not report a failed skill as loaded in the settled summary', () => {
    const summary = summarizeToolRun(
      [{ toolName: 'skill_view', args: { name: 'missing-skill' }, result: { error: 'missing' }, isError: true }],
      false
    )

    expect(summary.toLowerCase()).toContain('failed')
    expect(summary).not.toContain('Loaded')
  })
})
